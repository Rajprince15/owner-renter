import React from 'react';
import { CheckCircle, Clock, FileText, Server } from 'lucide-react';

const UploadStatusIndicator = ({ documents }) => {
  const uploadedCount = Object.values(documents).filter(doc => doc !== null).length;
  const totalRequired = Object.keys(documents).length;
  const allUploaded = uploadedCount === totalRequired;

  if (uploadedCount === 0) {
    return null;
  }

  return (
    <div 
      className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
      data-testid="upload-status-indicator"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {allUploaded ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <Clock className="w-5 h-5 text-blue-600" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">
              Upload Status: {uploadedCount}/{totalRequired} Documents
            </h3>
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <Server className="w-3.5 h-3.5" />
              <span>Stored on server</span>
            </div>
          </div>
          
          <div className="space-y-2">
            {Object.entries(documents).map(([key, doc]) => (
              <div key={key} className="flex items-center space-x-2 text-sm">
                {doc ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700 flex-1 truncate">
                      {doc.file_name}
                    </span>
                    <span className="text-xs text-green-600 font-medium">Uploaded ✓</span>
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
              </div>
            ))}
          </div>

          {allUploaded ? (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-sm text-green-700 font-medium flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                All documents uploaded and stored on server
              </p>
              <p className="text-xs text-gray-600 mt-1">
                💡 Complete the employment form below to finalize your verification request
              </p>
            </div>
          ) : (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-sm text-blue-700">
                ⏳ Upload remaining documents to continue
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadStatusIndicator;
