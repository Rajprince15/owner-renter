import React, { useState, useRef } from 'react';
import { Upload, X, File, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';

const DocumentUpload = ({ 
  label, 
  documentType, 
  onUpload, 
  acceptedFormats = '.pdf,.jpg,.jpeg,.png',
  maxSize = 5 * 1024 * 1024, // 5MB
  required = true,
  existingFile = null
}) => {
  const [file, setFile] = useState(existingFile);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    const acceptedExtensions = acceptedFormats.split(',').map(f => f.trim());
    if (!acceptedExtensions.includes(fileExtension)) {
      return `Only ${acceptedFormats} files are allowed`;
    }

    return null;
  };

  const handleFileSelect = async (selectedFile) => {
    setError(null);
    setUploadProgress(0);

    // Validate file
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Call upload handler
      const uploadedFile = await onUpload(selectedFile, documentType);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setFile(uploadedFile);
      }, 300);
    } catch (err) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!file && !uploading) {
      fileInputRef.current?.click();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full" data-testid={`document-upload-${documentType}`}>
      <motion.label 
        className="block text-sm font-medium text-gray-700 mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </motion.label>

      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="upload-zone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onClick={handleClick}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300
              ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50 scale-105'
                  : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
              }
              ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedFormats}
              onChange={handleFileInputChange}
              className="hidden"
              disabled={uploading}
            />

            {uploading ? (
              <motion.div 
                className="flex flex-col items-center" 
                data-testid="uploading-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader className="w-10 h-10 text-indigo-500 mb-3" />
                </motion.div>
                <p className="text-sm text-gray-600 mb-2">Uploading...</p>
                {uploadProgress > 0 && (
                  <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-indigo-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <motion.div
                  animate={ isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                </motion.div>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="text-indigo-600 font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  {acceptedFormats.toUpperCase()} (Max {Math.round(maxSize / (1024 * 1024))}MB)
                </p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="file-preview"
            className="border border-gray-300 rounded-lg p-4 bg-gray-50" 
            data-testid="uploaded-file-preview"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <motion.div 
                  className="flex-shrink-0"
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <File className="w-8 h-8 text-indigo-500" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.file_name || file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {file.file_size ? formatFileSize(file.file_size) : formatFileSize(file.size)}
                  </p>
                </div>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                </motion.div>
              </div>
              <motion.button
                onClick={handleRemove}
                className="ml-3 p-1 text-gray-400 hover:text-red-500 transition-colors rounded-full"
                data-testid="remove-file-button"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div 
            className="mt-2 flex items-center space-x-2 text-red-600" 
            data-testid="error-message"
            initial={{ opacity: 0, x: -10 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              transition: { duration: 0.3 }
            }}
            exit={{ opacity: 0, x: -10 }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            </motion.div>
            <p className="text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentUpload;