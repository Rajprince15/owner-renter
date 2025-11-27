import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, Play, Download, AlertTriangle, ChevronLeft, 
  RefreshCw, Table, Code 
} from 'lucide-react';
import { 
  executeQuery, 
  getTableSchema,
  backupDatabase,
  logAdminAction 
} from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import QueryInterface from '../../components/admin/QueryInterface';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { useToast } from '../../context/ToastContext';

const DatabaseTools = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('query');
  const [query, setQuery] = useState('');
  const [readOnly, setReadOnly] = useState(true);
  const [queryResults, setQueryResults] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [selectedTable, setSelectedTable] = useState('users');
  const [tableSchema, setTableSchema] = useState(null);
  const [showDangerConfirm, setShowDangerConfirm] = useState(false);
  const [pendingQuery, setPendingQuery] = useState(null);

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const handleExecuteQuery = async (queryToExecute = query) => {
    if (!queryToExecute.trim()) {
      showToast('Please enter a query', 'warning');
      return;
    }

    // Check if query is potentially dangerous
    const lowerQuery = queryToExecute.toLowerCase();
    const isDangerous = !readOnly && (
      lowerQuery.includes('delete') ||
      lowerQuery.includes('drop') ||
      lowerQuery.includes('truncate')
    );

    if (isDangerous) {
      setPendingQuery(queryToExecute);
      setShowDangerConfirm(true);
      return;
    }

    try {
      setExecuting(true);
      const response = await executeQuery(queryToExecute, readOnly);
      setQueryResults(response.data);
      logAdminAction(user.user_id, 'database_query', 'database', null, {
        query: queryToExecute,
        readOnly
      });
      showToast('Query executed successfully', 'success');
    } catch (error) {
      console.error('Error executing query:', error);
      showToast('Query execution failed', 'error');
      setQueryResults({
        error: error.response?.data?.message || 'Query execution failed'
      });
    } finally {
      setExecuting(false);
    }
  };

  const confirmDangerousQuery = async () => {
    setShowDangerConfirm(false);
    await handleExecuteQuery(pendingQuery);
    setPendingQuery(null);
  };

  const loadTableSchema = async (tableName) => {
    try {
      const response = await getTableSchema(tableName);
      setTableSchema(response.data);
    } catch (error) {
      console.error('Error loading table schema:', error);
      showToast('Failed to load table schema', 'error');
    }
  };

  useEffect(() => {
    if (activeTab === 'tables') {
      loadTableSchema(selectedTable);
    }
  }, [activeTab, selectedTable]);

  const handleBackupDatabase = async () => {
    try {
      const response = await backupDatabase();
      logAdminAction(user.user_id, 'database_backup', 'database', null, {
        backup_id: response.data.backupId
      });
      showToast('Database backup created successfully', 'success');
    } catch (error) {
      console.error('Error creating backup:', error);
      showToast('Failed to create backup', 'error');
    }
  };

  const sampleQueries = [
    'SELECT * FROM users LIMIT 10;',
    'SELECT * FROM properties WHERE is_verified = true LIMIT 10;',
    'SELECT COUNT(*) as total_users FROM users;',
    'SELECT user_type, COUNT(*) as count FROM users GROUP BY user_type;',
    'SELECT status, COUNT(*) as count FROM properties GROUP BY status;'
  ];

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 p-6" 
      data-testid="database-tools"
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
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-600"
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
                  <Database className="w-8 h-8 text-indigo-600" />
                  Database Tools
                </motion.h1>
                <p className="text-gray-600 mt-2">
                  Query and manage database with full administrative access
                </p>
              </div>
              <motion.button
                onClick={handleBackupDatabase}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md"
                data-testid="backup-button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4" />
                Backup Database
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Danger Warning */}
        <motion.div 
          className="bg-red-50 border-l-4 border-red-500 p-4 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </motion.div>
            <p className="text-red-800 font-semibold">⚠️ DANGER ZONE</p>
          </div>
          <p className="text-red-700 text-sm mt-1">
            These tools provide direct database access. Use with extreme caution. All actions are logged.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex gap-2 border-b border-gray-200">
            {[
              { key: 'query', label: 'Query Interface', icon: Code, color: 'blue' },
              { key: 'tables', label: 'Table Browser', icon: Table, color: 'green' }
            ].map((tab) => (
              <motion.button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 font-semibold flex items-center gap-2 ${activeTab === tab.key ? `border-b-2 border-${tab.color}-600 text-${tab.color}-600` : 'text-gray-600 hover:text-gray-900'}`}
                data-testid={`${tab.key}-tab`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Query Interface Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'query' && (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Sample Queries */}
              <motion.div 
                className="bg-white rounded-lg shadow p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Sample Queries</h2>
                <motion.div 
                  className="grid grid-cols-1 gap-2"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {sampleQueries.map((sampleQuery, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setQuery(sampleQuery)}
                      className="text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-mono text-gray-700"
                      data-testid={`sample-query-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (index * 0.05) }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {sampleQuery}
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>

              {/* Query Input */}
              <motion.div 
                className="bg-white rounded-lg shadow p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">SQL Query</h2>
                  <motion.label 
                    className="flex items-center gap-2 text-sm"
                    whileHover={{ scale: 1.05 }}
                  >
                    <input
                      type="checkbox"
                      checked={readOnly}
                      onChange={(e) => setReadOnly(e.target.checked)}
                      className="w-4 h-4"
                      data-testid="read-only-checkbox"
                    />
                    <span className="text-gray-700">Read-only mode</span>
                  </motion.label>
                </div>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter SQL query..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500"
                  rows={8}
                  data-testid="query-input"
                />
                <motion.button
                  onClick={() => handleExecuteQuery()}
                  disabled={executing}
                  className="mt-4 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="execute-query-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-4 h-4" />
                  {executing ? 'Executing...' : 'Execute Query'}
                </motion.button>
              </motion.div>

              {/* Query Results */}
              <AnimatePresence>
                {queryResults && (
                  <motion.div 
                    className="bg-white rounded-lg shadow p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Results</h2>
                    {queryResults.error ? (
                      <motion.div 
                        className="bg-red-50 border border-red-200 rounded-lg p-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <p className="text-red-800 font-mono text-sm">{queryResults.error}</p>
                      </motion.div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-600 mb-3">
                          Rows returned: {queryResults.rowCount || queryResults.rows?.length || 0}
                        </p>
                        {queryResults.rows && queryResults.rows.length > 0 && (
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  {Object.keys(queryResults.rows[0]).map((key) => (
                                    <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      {key}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {queryResults.rows.map((row, index) => (
                                  <motion.tr 
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                  >
                                    {Object.values(row).map((value, i) => (
                                      <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                      </td>
                                    ))}
                                  </motion.tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Table Browser Tab */}
          {activeTab === 'tables' && (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Table Selection */}
              <motion.div 
                className="bg-white rounded-lg shadow p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Table</h2>
                <motion.select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="table-select"
                  whileHover={{ scale: 1.02 }}
                >
                  <option value="users">users</option>
                  <option value="properties">properties</option>
                  <option value="chats">chats</option>
                  <option value="transactions">transactions</option>
                  <option value="shortlists">shortlists</option>
                  <option value="notifications">notifications</option>
                </motion.select>
              </motion.div>

              {/* Table Schema */}
              {tableSchema && (
                <motion.div 
                  className="bg-white rounded-lg shadow p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Table Schema: {selectedTable}</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nullable</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {tableSchema.columns?.map((column, index) => (
                          <motion.tr 
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{column.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{column.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{column.nullable ? 'Yes' : 'No'}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {tableSchema.indexes && tableSchema.indexes.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Indexes:</h3>
                      <div className="flex flex-wrap gap-2">
                        {tableSchema.indexes.map((index, i) => (
                          <motion.span 
                            key={i} 
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            {index}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Quick Actions */}
              <motion.div 
                className="bg-white rounded-lg shadow p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => {
                      setActiveTab('query');
                      setQuery(`SELECT * FROM ${selectedTable} LIMIT 10;`);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    data-testid="view-data-button"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Data
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setActiveTab('query');
                      setQuery(`SELECT COUNT(*) as count FROM ${selectedTable};`);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    data-testid="count-rows-button"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Count Rows
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dangerous Query Confirmation */}
      {showDangerConfirm && (
        <ConfirmDialog
          title="⚠️ Dangerous Query"
          message="This query will modify data. This action cannot be undone. Are you absolutely sure?"
          confirmText="Execute Anyway"
          confirmColor="red"
          onConfirm={confirmDangerousQuery}
          onCancel={() => {
            setShowDangerConfirm(false);
            setPendingQuery(null);
          }}
        />
      )}
    </motion.div>
  );
};

export default DatabaseTools;
