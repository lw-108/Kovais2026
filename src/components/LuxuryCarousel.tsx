import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyImage } from './ui/lazy-image';

// Desktop Images
import img1 from '../assets/1.jpg';
import img2 from '../assets/2.jpg';
import img3 from '../assets/3.png';
import img4 from '../assets/4.png';
import img5 from '../assets/5.png';
import img6 from '../assets/6.png';
import img7 from '../assets/7.png';

// Mobile Images
import img1M from '../assets/1Mobile.png';
import img2M from '../assets/2Mobile.png';
import img3M from '../assets/3Mobile.png';
import img4M from '../assets/4Mobile.png';
import img5M from '../assets/5Mobile.png';
import img6M from '../assets/6Mobile.png';
import img7M from '../assets/7Mobile.png';

const images = [
  { desktop: img1, mobile: img1M },
  { desktop: img2, mobile: img2M },
  { desktop: img3, mobile: img3M },
  { desktop: img4, mobile: img4M },
  { desktop: img5, mobile: img5M },
  { desktop: img6, mobile: img6M },
  { desktop: img7, mobile: img7M },
];


export const LuxuryCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Robust mobile detection
    const mql = window.matchMedia('(max-width: 768px)');
    const onChange = () => setIsMobile(mql.matches);
    
    setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    
    return () => {
      mql.removeEventListener('change', onChange);
      clearInterval(timer);
    };
  }, []);

  const currentImage = isMobile ? images[currentIndex].mobile : images[currentIndex].desktop;

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#0a0a0a] flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentIndex}-${isMobile}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full flex items-center justify-center"
        >
          <img
            src={currentImage}
            alt={`Luxury Slide ${currentIndex + 1}`}
            loading="eager"
            className="w-full h-full object-contain"
          />

        </motion.div>
      </AnimatePresence>

      {/* Progress Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {images.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-700 ${
              i === currentIndex ? 'w-10 bg-primary' : 'w-2 bg-white/10'
            }`}
          />
        ))}
      </div>
    </div>
  );
};


