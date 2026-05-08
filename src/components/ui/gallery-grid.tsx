"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { LazyImage } from "@/components/ui/lazy-image";

// Image Imports
import funeralImg from "@/assets/funeral.png";
import hotelImg from "@/assets/hotel.jpeg";
import spaImg from "@/assets/spa.jpeg";
import barberImg from "@/assets/barber.jpeg";
import gymImg from "@/assets/gym.jpeg";
import functionImg from "@/assets/function.png";

const galleryImages = [
  { id: 1, url: funeralImg, title: "Dignified Services" },
  { id: 2, url: hotelImg, title: "Luxury Stays" },
  { id: 3, url: spaImg, title: "Serene Wellness" },
  { id: 4, url: barberImg, title: "Expert Grooming" },
  { id: 5, url: gymImg, title: "Elite Fitness" },
  { id: 6, url: functionImg, title: "Grand Events" },
  { id: 7, url: hotelImg, title: "Premium Living" },
  { id: 8, url: spaImg, title: "Total Rejuvenation" },
  { id: 9, url: barberImg, title: "Precision Cuts" },
];

export function GalleryGrid() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleNext = () => {
    if (selectedImage !== null) {
      const currentIndex = galleryImages.findIndex((img) => img.id === selectedImage);
      const nextIndex = (currentIndex + 1) % galleryImages.length;
      setSelectedImage(galleryImages[nextIndex].id);
    }
  };

  const handlePrev = () => {
    if (selectedImage !== null) {
      const currentIndex = galleryImages.findIndex((img) => img.id === selectedImage);
      const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      setSelectedImage(galleryImages[prevIndex].id);
    }
  };

  const selectedImageData = galleryImages.find((img) => img.id === selectedImage);

  return (
    <section className="w-full px-4 py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 size-96 bg-[#D4AF37]/5 blur-[120px] rounded-full" />
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <Badge className="mb-4 uppercase tracking-[0.2em]" variant="secondary">
            <ImageIcon className="mr-2 h-3 w-3" />
            Visual Portfolio
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter serif mb-4">
            Our <span className="text-[#D4AF37] italic">Gallery</span>
          </h2>
          <div className="h-px w-24 bg-[#D4AF37]/40 mx-auto" />
        </div>

        {/* 3x3 Grid - Always */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 w-full">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="relative group cursor-pointer"
              onClick={() => setSelectedImage(image.id)}
            >
              {/* Corner Clips (L-shaped) */}
              <div className="absolute top-0 left-0 size-3 border-t border-l border-[#D4AF37] z-20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-0 right-0 size-3 border-t border-r border-[#D4AF37] z-20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 size-3 border-b border-l border-[#D4AF37] z-20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 size-3 border-b border-r border-[#D4AF37] z-20 opacity-0 group-hover:opacity-100 transition-opacity" />

              <Card className="relative aspect-square overflow-hidden border-none bg-muted/20">
                <LazyImage
                  src={image.url}
                  alt={image.title}
                  className="h-full w-full transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] flex items-center justify-center">
                    <ZoomIn className="size-8 text-[#D4AF37]" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage !== null && selectedImageData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[120] flex items-center justify-center bg-background/95 backdrop-blur-xl p-4 md:p-8"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-screen max-w-6xl flex flex-col items-center"
              >
                {/* Close Button */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute -top-12 right-0 text-foreground hover:text-[#D4AF37] transition-colors"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-8 w-8" />
                </Button>

                {/* Navigation */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute left-[-2rem] md:left-[-4rem] top-1/2 -translate-y-1/2 text-foreground hover:text-[#D4AF37] hidden sm:flex"
                  onClick={handlePrev}
                >
                  <ChevronLeft className="h-10 w-10" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-[-2rem] md:right-[-4rem] top-1/2 -translate-y-1/2 text-foreground hover:text-[#D4AF37] hidden sm:flex"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-10 w-10" />
                </Button>

                <div className="relative border-4 border-[#D4AF37]/20 p-2 bg-background">
                     {/* Lightbox Corner Clips */}
                    <div className="absolute -top-1 -left-1 size-12 border-t-4 border-l-4 border-[#D4AF37]" />
                    <div className="absolute -top-1 -right-1 size-12 border-t-4 border-r-4 border-[#D4AF37]" />
                    <div className="absolute -bottom-1 -left-1 size-12 border-b-4 border-l-4 border-[#D4AF37]" />
                    <div className="absolute -bottom-1 -right-1 size-12 border-b-4 border-r-4 border-[#D4AF37]" />
                    
                    <LazyImage
                        src={selectedImageData.url}
                        alt={selectedImageData.title}
                        className="max-h-[70vh] md:max-h-[80vh] w-auto shadow-2xl"
                    />
                </div>

                <div className="mt-8 text-center">
                  <h3 className="text-2xl md:text-4xl font-black serif text-foreground tracking-tighter">
                    {selectedImageData.title}
                  </h3>
                  <Badge variant="secondary" className="mt-4 uppercase tracking-widest text-[10px]">
                    Kovais Collection
                  </Badge>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
