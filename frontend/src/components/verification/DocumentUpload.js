import React, { useState, useRef } from 'react';
import { Upload, X, File, CheckCircle, AlertCircle, Loader } from 'lucide-react';
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

    // Validate file
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);

    try {
      // Call upload handler
      const uploadedFile = await onUpload(selectedFile, documentType);
      setFile(uploadedFile);
    } catch (err) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
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
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {!file ? (
        <div
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
            ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50'
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
            <div className="flex flex-col items-center" data-testid="uploading-indicator">
              <Loader className="w-10 h-10 text-indigo-500 animate-spin mb-3" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-1">
                <span className="text-indigo-600 font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                {acceptedFormats.toUpperCase()} (Max {Math.round(maxSize / (1024 * 1024))}MB)
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50" data-testid="uploaded-file-preview">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <File className="w-8 h-8 text-indigo-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.file_name || file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {file.file_size ? formatFileSize(file.file_size) : formatFileSize(file.size)}
                </p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            </div>
            <button
              onClick={handleRemove}
              className="ml-3 p-1 text-gray-400 hover:text-red-500 transition-colors"
              data-testid="remove-file-button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 flex items-center space-x-2 text-red-600" data-testid="error-message">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
