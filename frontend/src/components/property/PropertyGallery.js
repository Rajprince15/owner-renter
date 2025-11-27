import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

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
      {/* Gallery Grid with Animations */}
      <motion.div
        className="w-full"
        data-testid="property-gallery"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {images.length === 1 ? (
          /* Single image */
          <motion.div
            className="w-full h-96 rounded-lg overflow-hidden cursor-pointer group relative"
            onClick={() => openLightbox(0)}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={images[0]}
              alt={`${title} view`}
              className="w-full h-full object-cover"
            />
            <motion.div
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <ZoomIn className="w-12 h-12 text-white" />
            </motion.div>
          </motion.div>
        ) : images.length === 2 ? (
          /* Two images */
          <motion.div
            className="grid grid-cols-2 gap-2 h-96"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {images.map((image, index) => (
              <motion.div
                key={index}
                className="rounded-lg overflow-hidden cursor-pointer group relative"
                onClick={() => openLightbox(index)}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 }
                }}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={image}
                  alt={`${title} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <motion.div
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ZoomIn className="w-8 h-8 text-white" />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Multiple images - Featured grid */
          <motion.div
            className="grid grid-cols-4 gap-2 h-96"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
          >
            {/* Main image - larger */}
            <motion.div
              className="col-span-2 row-span-2 rounded-lg overflow-hidden cursor-pointer group relative"
              onClick={() => openLightbox(0)}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 }
              }}
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={images[0]}
                alt={`${title} main view`}
                className="w-full h-full object-cover"
              />
              <motion.div
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ZoomIn className="w-12 h-12 text-white" />
              </motion.div>
            </motion.div>

            {/* Secondary images */}
            {images.slice(1, 5).map((image, index) => (
              <motion.div
                key={index + 1}
                className="col-span-2 rounded-lg overflow-hidden cursor-pointer relative group"
                onClick={() => openLightbox(index + 1)}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 }
                }}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={image}
                  alt={`${title} view ${index + 2}`}
                  className="w-full h-full object-cover"
                />
                <motion.div
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ZoomIn className="w-8 h-8 text-white" />
                </motion.div>
                
                {/* Show "+X more" overlay on last thumbnail if there are more images */}
                {index === 3 && images.length > 5 && (
                  <motion.div
                    className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.span
                      className="text-white text-2xl font-semibold"
                      whileHover={{ scale: 1.1 }}
                    >
                      +{images.length - 5} more
                    </motion.span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* View all photos button with Animation */}
        {images.length > 1 && (
          <motion.button
            onClick={() => openLightbox(0)}
            className="mt-4 w-full py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            data-testid="view-all-photos-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            View All {images.length} Photos
          </motion.button>
        )}
      </motion.div>

      {/* Lightbox Modal with Animations */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
            data-testid="lightbox-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close button with Animation */}
            <motion.button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              data-testid="lightbox-close-btn"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-8 h-8" />
            </motion.button>

            {/* Image counter with Animation */}
            <motion.div
              className="absolute top-4 left-4 text-white text-lg z-10"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {currentImageIndex + 1} / {images.length}
            </motion.div>

            {/* Previous button */}
            {images.length > 1 && (
              <motion.button
                onClick={goToPrevious}
                className="absolute left-4 text-white hover:text-gray-300 z-10"
                data-testid="lightbox-prev-btn"
                whileHover={{ scale: 1.2, x: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-12 h-12" />
              </motion.button>
            )}

            {/* Current image with Zoom Animation */}
            <motion.div
              className="max-w-6xl max-h-[90vh] mx-auto px-16"
              key={currentImageIndex}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={images[currentImageIndex]}
                alt={`${title} view ${currentImageIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain"
              />
            </motion.div>

            {/* Next button */}
            {images.length > 1 && (
              <motion.button
                onClick={goToNext}
                className="absolute right-4 text-white hover:text-gray-300 z-10"
                data-testid="lightbox-next-btn"
                whileHover={{ scale: 1.2, x: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-12 h-12" />
              </motion.button>
            )}

            {/* Thumbnail strip with Animations */}
            {images.length > 1 && (
              <motion.div
                className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {images.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-white' : 'border-transparent opacity-50'
                    }`}
                    whileHover={{ scale: 1.1, opacity: 1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PropertyGallery;