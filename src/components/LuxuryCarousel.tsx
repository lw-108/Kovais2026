import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { LazyImage } from './ui/lazy-image';

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
  { 
    desktop: img1, 
    mobile: img1M,
    category: "Hospitality",
    title: "Luxury Hospitality",
    subtitle: "Boutique Heritage Suites"
  },
  { 
    desktop: img2, 
    mobile: img2M,
    category: "Wellness",
    title: "Holistic Wellness",
    subtitle: "Ancient Therapeutic Spa Rituals"
  },
  { 
    desktop: img3, 
    mobile: img3M,
    category: "Performance",
    title: "Elite Fitness",
    subtitle: "State-of-the-Art Training Studio"
  },
  { 
    desktop: img4, 
    mobile: img4M,
    category: "Grooming",
    title: "Master Grooming",
    subtitle: "Precision Barber Atelier"
  },
  { 
    desktop: img5, 
    mobile: img5M,
    category: "Aesthetics",
    title: "Couture Beauty",
    subtitle: "High-Definition Aesthetics Maison"
  },
  { 
    desktop: img6, 
    mobile: img6M,
    category: "Events",
    title: "Grand Celebrations",
    subtitle: "Elegantly Crafted Event Estates"
  },
  { 
    desktop: img7, 
    mobile: img7M,
    category: "Remembrance",
    title: "Graceful Legacies",
    subtitle: "Compassionate Remembrance Services"
  },
];


export const LuxuryCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="relative w-full h-[calc(100dvh-5rem)] overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full flex items-center justify-center"
        >
          <picture className="absolute inset-0 w-full h-full z-0">
            <source media="(max-width: 768px)" srcSet={images[currentIndex].mobile} />
            <img
              src={images[currentIndex].desktop}
              alt={images[currentIndex].title}
              loading="eager"
              className="w-full h-full object-cover"
            />
          </picture>

          {/* Vignette Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent z-10 pointer-events-none" />

          {/* Content Overlay */}
          <div className="absolute bottom-24 left-6 md:left-20 z-20 max-w-xl text-left pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-2 mb-2"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                {images[currentIndex].category}
              </span>
              <div className="h-[1px] w-8 bg-primary/40" />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-4xl md:text-6xl font-black tracking-tighter text-white font-instrument-serif italic leading-tight"
            >
              {images[currentIndex].title}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-white/60 text-xs md:text-sm tracking-widest font-sans uppercase mt-2 font-medium"
            >
              {images[currentIndex].subtitle}
            </motion.p>
          </div>
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


