import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Download, FileText, Image as ImageIcon, 
  File, ZoomIn, ZoomOut, ExternalLink 
} from 'lucide-react';

const DocumentViewer = ({ isOpen, onClose, documents, title }) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [zoom, setZoom] = useState(100);

  if (!isOpen) return null;

  const getFileType = (url) => {
    if (!url) return 'unknown';
    const extension = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) return 'image';
    if (['pdf'].includes(extension)) return 'pdf';
    return 'document';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const renderDocumentPreview = (doc) => {
    const fileType = getFileType(doc.document_url || doc.file_url);
    const url = doc.document_url || doc.file_url;

    if (fileType === 'image') {
      return (
        <motion.div 
          className="flex items-center justify-center bg-gray-100 rounded-lg p-4 h-96 overflow-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.img 
            src={url} 
            alt={doc.type || 'Document'} 
            className="max-w-full max-h-full object-contain"
            style={{ transform: `scale(${zoom / 100})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          />
        </motion.div>
      );
    } else if (fileType === 'pdf') {
      return (
        <motion.div 
          className="bg-gray-100 rounded-lg p-8 h-96 flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <FileText className="w-24 h-24 text-gray-400 mb-4" />
          </motion.div>
          <p className="text-gray-700 font-semibold mb-2">PDF Document</p>
          <p className="text-gray-600 text-sm mb-4 truncate max-w-md">{url}</p>
          <div className="flex gap-3">
            <motion.a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-4 h-4" />
              Open in New Tab
            </motion.a>
            <motion.button
              onClick={() => {
                const link = document.createElement('a');
                link.href = url;
                link.download = url.split('/').pop();
                link.click();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
              Download
            </motion.button>
          </div>
          <p className="text-gray-500 text-xs mt-4">Preview not available for mock data. Click buttons above to view.</p>
        </motion.div>
      );
    } else {
      return (
        <motion.div 
          className="bg-gray-100 rounded-lg p-8 h-96 flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <File className="w-24 h-24 text-gray-400 mb-4" />
          </motion.div>
          <p className="text-gray-700 font-semibold mb-2">Document File</p>
          <p className="text-gray-600 text-sm mb-4 truncate max-w-md">{url}</p>
          <motion.button
            onClick={() => {
              const link = document.createElement('a');
              link.href = url;
              link.download = url.split('/').pop();
              link.click();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4" />
            Download
          </motion.button>
        </motion.div>
      );
    }
  };

  const documentList = documents ? Object.entries(documents).map(([key, value]) => ({
    id: key,
    type: key.replace('_', ' '),
    ...value
  })) : [];

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
        data-testid="document-viewer-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <motion.div 
            className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{title || 'Document Viewer'}</h2>
              <p className="text-gray-600 text-sm mt-1">{documentList.length} document(s)</p>
            </div>
            <motion.button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              data-testid="close-viewer-button"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6 text-gray-600" />
            </motion.button>
          </motion.div>

          {/* Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Document List Sidebar */}
            <motion.div 
              className="w-64 border-r border-gray-200 overflow-y-auto bg-gray-50"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-4 space-y-2">
                {documentList.map((doc, index) => (
                  <motion.button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedDoc?.id === doc.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white hover:bg-gray-100 text-gray-900 hover:shadow-md'
                    }`}
                    data-testid={`doc-item-${doc.id}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (index * 0.05) }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {getFileType(doc.document_url || doc.file_url) === 'image' ? (
                        <ImageIcon className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                      <span className="font-medium text-sm capitalize">{doc.type}</span>
                    </div>
                    {doc.verified !== undefined && (
                      <span className={`text-xs ${
                        selectedDoc?.id === doc.id ? 'text-blue-100' : 'text-gray-600'
                      }`}>
                        {doc.verified ? '✓ Verified' : '○ Pending'}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Document Preview Area */}
            <motion.div 
              className="flex-1 overflow-y-auto p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {selectedDoc ? (
                <div className="space-y-4">
                  {/* Document Info */}
                  <motion.div 
                    className="bg-gray-50 rounded-lg p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-semibold text-gray-900 capitalize mb-2">{selectedDoc.type}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">File Type:</span>
                        <span className="ml-2 font-medium text-gray-900">{selectedDoc.type}</span>
                      </div>
                      {selectedDoc.file_size && (
                        <div>
                          <span className="text-gray-600">Size:</span>
                          <span className="ml-2 font-medium text-gray-900">{formatFileSize(selectedDoc.file_size)}</span>
                        </div>
                      )}
                      {selectedDoc.uploaded_at && (
                        <div>
                          <span className="text-gray-600">Uploaded:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {new Date(selectedDoc.uploaded_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {selectedDoc.verified !== undefined && (
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <span className={`ml-2 font-medium ${
                            selectedDoc.verified ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {selectedDoc.verified ? 'Verified' : 'Pending Verification'}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Zoom Controls (for images) */}
                  {getFileType(selectedDoc.document_url || selectedDoc.file_url) === 'image' && (
                    <motion.div 
                      className="flex items-center gap-2 justify-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.button
                        onClick={() => setZoom(Math.max(25, zoom - 25))}
                        className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                        data-testid="zoom-out-button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ZoomOut className="w-4 h-4" />
                      </motion.button>
                      <span className="text-sm text-gray-700 font-medium">{zoom}%</span>
                      <motion.button
                        onClick={() => setZoom(Math.min(200, zoom + 25))}
                        className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                        data-testid="zoom-in-button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ZoomIn className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => setZoom(100)}
                        className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Reset
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Document Preview */}
                  {renderDocumentPreview(selectedDoc)}
                </div>
              ) : (
                <motion.div 
                  className="flex items-center justify-center h-full text-gray-500"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    </motion.div>
                    <p className="text-lg font-medium">Select a document to preview</p>
                    <p className="text-sm mt-1">Choose from the list on the left</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DocumentViewer;