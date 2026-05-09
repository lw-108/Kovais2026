"use client";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import asciiArt from "@/assets/asciii-art.png";
import { LazyImage } from "@/components/ui/lazy-image";

import { Link } from "react-router-dom";

export const CTA = () => {
  return (
    <div className="px-4 py-8 md:px-6 md:py-16 relative overflow-hidden">
       {/* Background Glow - Reduced blur for performance */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[250px] md:size-[500px] bg-[#D4AF37]/5 blur-[60px] md:blur-[100px] rounded-full -z-10" />

      <div className="relative mx-auto max-w-7xl overflow-hidden group">
        {/* Responsive container with height compromise */}
        <div className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[400px] flex items-center justify-center">
            <LazyImage
              src={asciiArt}
              alt="Kovais Aesthetic"
              className="absolute inset-0 size-full transition-transform duration-[20s] group-hover:scale-105 will-change-transform"
            />
            {/* Reduced backdrop blur for performance */}
            <div className="absolute inset-0 bg-black/70 md:bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-black/40 to-transparent" />

            <div className="relative z-10 w-full h-full flex flex-col justify-end md:justify-center px-6 sm:px-12 md:px-20 py-12 md:py-16 space-y-4 md:space-y-6">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-4 md:space-y-6 max-w-2xl"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">
                            Your Journey Starts Here
                        </span>
                        <div className="h-[1px] w-6 md:w-12 bg-[#D4AF37]/50" />
                    </div>

                    <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] serif">
                        Ready to Experience <br />
                        True <span className="text-[#D4AF37] italic"> Kovais</span> Luxury?
                    </h2>

                    <p className="max-w-md text-xs sm:text-sm md:text-lg text-white/80 font-medium leading-relaxed">
                        Join thousands of guests who trust Kovais for their wellness and hospitality needs.
                    </p>

                    <Link to="/services">
                      <Button
                          className="h-10 md:h-14 px-5 md:px-8 bg-[#D4AF37] text-white hover:bg-[#B8962E] rounded-none font-black uppercase tracking-widest text-[8px] md:text-[10px] shadow-lg shadow-[#D4AF37]/10 transition-all hover:translate-x-1"
                          size="lg"
                      >
                          Book a Service<ArrowUpRight className="ml-2 size-4" />
                      </Button>
                    </Link>
                </motion.div>
            </div>
        </div>
      </div>
    </div>
  );
};
