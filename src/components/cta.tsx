"use client";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import asciiArt from "@/assets/asciii-art.png";

export const CTA = () => {
  return (
    <div className="px-4 py-12 md:px-6 md:py-24 relative overflow-hidden">
       {/* Background Glow */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[300px] md:size-[600px] bg-[#D4AF37]/10 blur-[80px] md:blur-[120px] rounded-full -z-10" />

      <div className="relative mx-auto max-w-7xl overflow-hidden group">

        <div className="relative aspect-[4/5] sm:aspect-video md:aspect-[21/9] flex items-center justify-center">
            <img
            alt="Kovais Aesthetic"
            className="absolute inset-0 size-full object-cover transition-transform duration-[20s] group-hover:scale-110"
            src={asciiArt}
            />
            <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px] md:bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-black/40 to-transparent" />

            <div className="relative z-10 w-full h-full flex flex-col justify-end md:justify-center px-6 sm:px-12 md:px-20 py-10 md:py-14 space-y-4 md:space-y-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="space-y-4 md:space-y-6 max-w-2xl"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">
                            The Future of Wellness
                        </span>
                        <div className="h-[1px] w-8 md:w-12 bg-[#D4AF37]/50" />
                    </div>

                    <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] serif">
                        Step Into <br />
                        Something <span className="text-[#D4AF37] italic">Better</span>
                    </h2>

                    <p className="max-w-md text-sm md:text-xl text-white/80 font-medium leading-relaxed">
                        Get seamless access to everything you need, right from your phone. 
                        Experience the Kovais digital concierge.
                    </p>

                    <Button
                        className="h-12 md:h-14 px-6 md:px-8 bg-[#D4AF37] text-white hover:bg-[#B8962E] rounded-none font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-lg shadow-[#D4AF37]/20 transition-all hover:translate-x-2"
                        size="lg"
                    >
                        Download Now <ArrowUpRight className="ml-2 size-4" />
                    </Button>
                </motion.div>
            </div>
        </div>
      </div>
    </div>
  );
};
