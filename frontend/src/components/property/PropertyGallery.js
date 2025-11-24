import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const PropertyGallery = ({ images = [], title = 'Property' }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLightboxOpen]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="w-full" data-testid="property-gallery">
        {images.length === 1 ? (
          /* Single image */
          <div className="w-full h-96 rounded-lg overflow-hidden cursor-pointer" onClick={() => openLightbox(0)}>
            <img
              src={images[0]}
              alt={`${title} view`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : images.length === 2 ? (
          /* Two images */
          <div className="grid grid-cols-2 gap-2 h-96">
            {images.map((image, index) => (
              <div
                key={index}
                className="rounded-lg overflow-hidden cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image}
                  alt={`${title} view ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        ) : (
          /* Multiple images - Featured grid */
          <div className="grid grid-cols-4 gap-2 h-96">
            {/* Main image - larger */}
            <div
              className="col-span-2 row-span-2 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => openLightbox(0)}
            >
              <img
                src={images[0]}
                alt={`${title} main view`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Secondary images */}
            {images.slice(1, 5).map((image, index) => (
              <div
                key={index + 1}
                className="col-span-2 rounded-lg overflow-hidden cursor-pointer relative"
                onClick={() => openLightbox(index + 1)}
              >
                <img
                  src={image}
                  alt={`${title} view ${index + 2}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                
                {/* Show "+X more" overlay on last thumbnail if there are more images */}
                {index === 3 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-2xl font-semibold">
                      +{images.length - 5} more
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* View all photos button */}
        {images.length > 1 && (
          <button
            onClick={() => openLightbox(0)}
            className="mt-4 w-full py-2 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            data-testid="view-all-photos-btn"
          >
            View All {images.length} Photos
          </button>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center" data-testid="lightbox-modal">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            data-testid="lightbox-close-btn"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 text-white text-lg z-10">
            {currentImageIndex + 1} / {images.length}
          </div>

          {/* Previous button */}
          {images.length > 1 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 text-white hover:text-gray-300 z-10"
              data-testid="lightbox-prev-btn"
            >
              <ChevronLeft className="w-12 h-12" />
            </button>
          )}

          {/* Current image */}
          <div className="max-w-6xl max-h-[90vh] mx-auto px-16">
            <img
              src={images[currentImageIndex]}
              alt={`${title} view ${currentImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 text-white hover:text-gray-300 z-10"
              data-testid="lightbox-next-btn"
            >
              <ChevronRight className="w-12 h-12" />
            </button>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    index === currentImageIndex ? 'border-white' : 'border-transparent opacity-50'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PropertyGallery;
