import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Download, AlertCircle } from 'lucide-react';

const QueryInterface = ({ onExecute }) => {
  const [query, setQuery] = useState('');
  const [readOnly, setReadOnly] = useState(true);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExecute = async () => {
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const result = await onExecute(query, readOnly);
      setResults(result.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Query execution failed');
    } finally {
      setLoading(false);
    }
  };

  const sampleQueries = [
    'SELECT * FROM users LIMIT 10;',
    'SELECT * FROM properties WHERE status = "active";',
    'SELECT COUNT(*) as total_users FROM users;',
    'SELECT transaction_type, SUM(amount) as total FROM transactions GROUP BY transaction_type;'
  ];

  const exportResults = () => {
    if (!results || !results.rows) return;
    
    const csv = [
      Object.keys(results.rows[0]).join(','),
      ...results.rows.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query_results_${Date.now()}.csv`;
    a.click();
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow" 
      data-testid="query-interface"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6 border-b border-gray-200">
        <motion.div 
          className="flex items-center justify-between mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-bold text-gray-900">SQL Query Interface</h3>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <motion.input
                type="checkbox"
                checked={readOnly}
                onChange={(e) => setReadOnly(e.target.checked)}
                className="rounded border-gray-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
              <span className="text-gray-700">Read-only mode</span>
            </label>
          </div>
        </motion.div>

        <AnimatePresence>
          {!readOnly && (
            <motion.div 
              className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              </motion.div>
              <div className="text-sm text-red-800">
                <strong>Warning:</strong> Write operations are enabled. Use with extreme caution!
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-4">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your SQL query here..."
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            data-testid="query-input"
          />
        </div>

        <div className="flex items-center justify-between">
          <motion.button
            onClick={handleExecute}
            disabled={loading || !query.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center gap-2 font-medium"
            data-testid="execute-query-btn"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={loading ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: 'linear' }}
            >
              <Play className="w-4 h-4" />
            </motion.div>
            {loading ? 'Executing...' : 'Execute Query'}
          </motion.button>

          <AnimatePresence>
            {results && (
              <motion.button
                onClick={exportResults}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-gray-700"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4" />
                Export as CSV
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Sample queries:</p>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.map((sample, index) => (
              <button
                key={index}
                onClick={() => setQuery(sample)}
                className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition"
              >
                {sample.substring(0, 40)}...
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            className="p-6 bg-red-50 border-t border-red-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              </motion.div>
              <div>
                <h4 className="text-sm font-semibold text-red-900 mb-1">Error</h4>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {results && (
          <motion.div 
            className="p-6 border-t border-gray-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Results</h4>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Rows: {results.rowCount || results.rows?.length || 0}</span>
              <span>Executed at: {new Date(results.executedAt).toLocaleString()}</span>
            </div>
          </div>

          {results.rows && results.rows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(results.rows[0]).map((key) => (
                      <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.rows.slice(0, 100).map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {Object.values(row).map((value, i) => (
                        <td key={i} className="px-4 py-2 text-gray-900">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {results.rows.length > 100 && (
                <p className="text-sm text-gray-500 mt-2">Showing first 100 rows of {results.rows.length}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Query executed successfully. No rows returned.</p>
          )}
        </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QueryInterface;
