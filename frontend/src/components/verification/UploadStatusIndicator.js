import React from 'react';
import { CheckCircle, Clock, FileText, Server } from 'lucide-react';
import { motion } from 'framer-motion';

const UploadStatusIndicator = ({ documents }) => {
  const uploadedCount = Object.values(documents).filter(doc => doc !== null).length;
  const totalRequired = Object.keys(documents).length;
  const allUploaded = uploadedCount === totalRequired;

  if (uploadedCount === 0) {
    return null;
  }

  return (
    <motion.div 
      className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
      data-testid="upload-status-indicator"
      initial={{ opacity: 0, scale: 0.95, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <div className="flex items-start space-x-3">
        <motion.div 
          className="flex-shrink-0 mt-0.5"
          animate={
            allUploaded
              ? { scale: [1, 1.2, 1] }
              : { rotate: 360 }
          }
          transition={
            allUploaded
              ? { duration: 1, delay: 0.3 }
              : { duration: 2, repeat: Infinity, ease: "linear" }
          }
        >
          {allUploaded ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <Clock className="w-5 h-5 text-blue-600" />
          )}
        </motion.div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <motion.h3 
              className="text-sm font-semibold text-gray-900"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Upload Status: {uploadedCount}/{totalRequired} Documents
            </motion.h3>
            <motion.div 
              className="flex items-center space-x-1 text-xs text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Stored on server</span>
            </motion.div>
          </div>
          
          <div className="space-y-2">
            {Object.entries(documents).map(([key, doc], index) => (
              <motion.div 
                key={key} 
                className="flex items-center space-x-2 text-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                {doc ? (
                  <>
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    </motion.div>
                    <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700 flex-1 truncate">
                      {doc.file_name}
                    </span>
                    <motion.span 
                      className="text-xs text-green-600 font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      Uploaded ✓
                    </motion.span>
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0" />
                    <span className="text-gray-500">
                      {key.replace('_', ' ').charAt(0).toUpperCase() + key.replace('_', ' ').slice(1)}
                    </span>
                    <span className="text-xs text-gray-400">Not uploaded</span>
                  </>
                )}
              </motion.div>
            ))}
          </div>

          {allUploaded ? (
            <motion.div 
              className="mt-3 pt-3 border-t border-blue-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-sm text-green-700 font-medium flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                All documents uploaded and stored on server
              </p>
              <p className="text-xs text-gray-600 mt-1">
                💡 Complete the employment form below to finalize your verification request
              </p>
            </motion.div>
          ) : (
            <motion.div 
              className="mt-3 pt-3 border-t border-blue-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-sm text-blue-700">
                ⏳ Upload remaining documents to continue
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UploadStatusIndicator;