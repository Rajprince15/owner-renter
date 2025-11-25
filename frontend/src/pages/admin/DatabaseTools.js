import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  return (
    <div className="min-h-screen bg-gray-50 p-6" data-testid="database-tools">
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
              <h1 className="text-3xl font-bold text-gray-900">Database Tools</h1>
              <p className="text-gray-600 mt-1">
                Query and manage database (Admin only)
              </p>
            </div>
            <button
              onClick={handleBackupDatabase}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              data-testid="backup-button"
            >
              <Download className="w-4 h-4" />
              Backup Database
            </button>
          </div>
        </div>

        {/* Danger Warning */}
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-red-800 font-semibold">⚠️ DANGER ZONE</p>
          </div>
          <p className="text-red-700 text-sm mt-1">
            These tools provide direct database access. Use with extreme caution. All actions are logged.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('query')}
              className={`px-6 py-3 font-semibold flex items-center gap-2 ${activeTab === 'query' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              data-testid="query-tab"
            >
              <Code className="w-4 h-4" />
              Query Interface
            </button>
            <button
              onClick={() => setActiveTab('tables')}
              className={`px-6 py-3 font-semibold flex items-center gap-2 ${activeTab === 'tables' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600 hover:text-gray-900'}`}
              data-testid="tables-tab"
            >
              <Table className="w-4 h-4" />
              Table Browser
            </button>
          </div>
        </div>

        {/* Query Interface Tab */}
        {activeTab === 'query' && (
          <div className="space-y-6">
            {/* Sample Queries */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Sample Queries</h2>
              <div className="grid grid-cols-1 gap-2">
                {sampleQueries.map((sampleQuery, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(sampleQuery)}
                    className="text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-mono text-gray-700"
                    data-testid={`sample-query-${index}`}
                  >
                    {sampleQuery}
                  </button>
                ))}
              </div>
            </div>

            {/* Query Input */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">SQL Query</h2>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={readOnly}
                    onChange={(e) => setReadOnly(e.target.checked)}
                    className="w-4 h-4"
                    data-testid="read-only-checkbox"
                  />
                  <span className="text-gray-700">Read-only mode</span>
                </label>
              </div>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter SQL query..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500"
                rows={8}
                data-testid="query-input"
              />
              <button
                onClick={() => handleExecuteQuery()}
                disabled={executing}
                className="mt-4 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="execute-query-button"
              >
                <Play className="w-4 h-4" />
                {executing ? 'Executing...' : 'Execute Query'}
              </button>
            </div>

            {/* Query Results */}
            {queryResults && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Results</h2>
                {queryResults.error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-mono text-sm">{queryResults.error}</p>
                  </div>
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
                              <tr key={index}>
                                {Object.values(row).map((value, i) => (
                                  <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Table Browser Tab */}
        {activeTab === 'tables' && (
          <div className="space-y-6">
            {/* Table Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Table</h2>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                data-testid="table-select"
              >
                <option value="users">users</option>
                <option value="properties">properties</option>
                <option value="chats">chats</option>
                <option value="transactions">transactions</option>
                <option value="shortlists">shortlists</option>
                <option value="notifications">notifications</option>
              </select>
            </div>

            {/* Table Schema */}
            {tableSchema && (
              <div className="bg-white rounded-lg shadow p-6">
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
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{column.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{column.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{column.nullable ? 'Yes' : 'No'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {tableSchema.indexes && tableSchema.indexes.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Indexes:</h3>
                    <div className="flex flex-wrap gap-2">
                      {tableSchema.indexes.map((index, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {index}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setActiveTab('query');
                    setQuery(`SELECT * FROM ${selectedTable} LIMIT 10;`);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  data-testid="view-data-button"
                >
                  View Data
                </button>
                <button
                  onClick={() => {
                    setActiveTab('query');
                    setQuery(`SELECT COUNT(*) as count FROM ${selectedTable};`);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  data-testid="count-rows-button"
                >
                  Count Rows
                </button>
              </div>
            </div>
          </div>
        )}
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
    </div>
  );
};

export default DatabaseTools;
