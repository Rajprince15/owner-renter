import React from 'react';
import { X, FileText, ExternalLink, Calendar, HardDrive } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';

const DocumentPreview = ({ document, onClose, onReupload }) => {
  if (!document) return null;

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isPDF = document.file_name?.toLowerCase().endsWith('.pdf');
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(document.file_name || '');

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
        data-testid="document-preview-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <motion.div 
            className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <FileText className="w-5 h-5 text-indigo-600" />
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Document Preview
                </h3>
                <p className="text-sm text-gray-500">{document.file_name}</p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              data-testid="close-preview-button"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-gray-600" />
            </motion.button>
          </motion.div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {/* File Info */}
            <motion.div 
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  className="flex items-center space-x-2 text-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <HardDrive className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-gray-500 text-xs">File Size</p>
                    <p className="text-gray-900 font-medium">
                      {formatFileSize(document.file_size)}
                    </p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-2 text-sm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-gray-500 text-xs">Uploaded</p>
                    <p className="text-gray-900 font-medium">
                      {formatDate(document.uploaded_at)}
                    </p>
                  </div>
                </motion.div>
              </div>
              <motion.div 
                className="mt-3 pt-3 border-t border-blue-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>Stored on server:</span>
                  <code className="bg-white px-2 py-1 rounded text-xs">
                    {document.file_url}
                  </code>
                </div>
              </motion.div>
            </motion.div>

            {/* Preview */}
            {isImage && (
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm font-medium text-gray-700 mb-3">Preview:</p>
                <motion.div 
                  className="border border-gray-200 rounded-lg overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <img 
                    src={document.file_url} 
                    alt={document.file_name}
                    className="w-full h-auto"
                  />
                </motion.div>
              </motion.div>
            )}

            {isPDF && (
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                  </motion.div>
                  <p className="text-sm text-gray-600 mb-2">PDF Document</p>
                  <p className="text-xs text-gray-500 mb-4">
                    Click "View Document" to open in a new tab
                  </p>
                  <motion.a
                    href={document.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Document</span>
                  </motion.a>
                </div>
              </motion.div>
            )}

            {/* Status */}
            <motion.div 
              className="bg-green-50 border border-green-200 rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-start space-x-3">
                <motion.div 
                  className="flex-shrink-0"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                </motion.div>
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Document Uploaded Successfully
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    This document is stored on our secure server and ready for verification.
                    You can complete the rest of the form and submit your verification request.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div 
            className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.a
              href={document.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open in New Tab</span>
            </motion.a>
            
            <div className="flex items-center space-x-3">
              {onReupload && (
                <Button
                  variant="outline"
                  onClick={onReupload}
                  data-testid="reupload-button"
                >
                  Re-upload
                </Button>
              )}
              <Button
                onClick={onClose}
                data-testid="close-button"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DocumentPreview;