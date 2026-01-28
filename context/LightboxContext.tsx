'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LightboxContextType {
  isOpen: boolean;
  src: string;
  alt: string;
  openImage: (src: string, alt?: string) => void;
  closeImage: () => void;
}

const LightboxContext = createContext<LightboxContextType | undefined>(undefined);

export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState({ src: '', alt: '' });

  const openImage = (src: string, alt: string = '') => {
    setCurrentImage({ src, alt });
    setIsOpen(true);
  };

  const closeImage = () => {
    setIsOpen(false);
  };

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <LightboxContext.Provider value={{ isOpen, src: currentImage.src, alt: currentImage.alt, openImage, closeImage }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
            onClick={closeImage}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-[95vw] max-h-[95vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentImage.src}
                alt={currentImage.alt || 'Fullscreen image'}
                className="max-w-[90vw] md:max-w-[80vw] max-h-[85vh] object-contain rounded-md shadow-2xl"
              />
              {currentImage.alt && (
                <p className="text-center text-white/90 mt-4 text-base font-medium">
                  {currentImage.alt}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const context = useContext(LightboxContext);
  if (context === undefined) {
    throw new Error('useLightbox must be used within a LightboxProvider');
  }
  return context;
}
