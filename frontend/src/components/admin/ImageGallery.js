import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, ExternalLink } from 'lucide-react';

const ImageGallery = ({ isOpen, onClose, images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen || !images || images.length === 0) return null;

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleDownload = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = imageUrl.split('/').pop();
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" data-testid="image-gallery-modal">
      <div className="relative w-full h-full flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent p-6 z-10">
          <div className="flex items-center justify-between text-white">
            <div>
              <h2 className="text-2xl font-bold">{title || 'Image Gallery'}</h2>
              <p className="text-sm opacity-80">
                Image {currentIndex + 1} of {images.length}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.open(images[currentIndex], '_blank')}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                data-testid="open-external-button"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDownload(images[currentIndex])}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                data-testid="download-image-button"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                data-testid="close-gallery-button"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Image Display */}
        <div className="flex-1 flex items-center justify-center p-20">
          <img
            src={images[currentIndex]}
            alt={`Property ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            data-testid="gallery-main-image"
          />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all text-white"
              data-testid="previous-image-button"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all text-white"
              data-testid="next-image-button"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <div className="flex gap-2 justify-center overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? 'border-blue-500 ring-2 ring-blue-400'
                      : 'border-white border-opacity-30 hover:border-opacity-60'
                  }`}
                  data-testid={`thumbnail-${index}`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
