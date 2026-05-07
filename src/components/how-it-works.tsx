"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    title: "Choose Your Service",
    description: "Browse our curated range of luxury services and select what speaks to you.",
  },
  {
    number: "02",
    title: "Book Your Slot",
    description: "Pick a convenient time with our seamless online booking system.",
  },
  {
    number: "03",
    title: "Arrive & Unwind",
    description: "Walk in and let our expert team take care of everything else.",
  },
  {
    number: "04",
    title: "Leave Transformed",
    description: "Depart refreshed, refined, and ready to conquer the world.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px]  rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-24 space-y-4">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-3">
                Simple & Seamless
            </span>
            <div className="h-[2px] w-16 bg-[#D4AF37]" />
          </div>
          
          <h2 className="text-5xl md:text-8xl font-black text-foreground tracking-tighter serif">
            How It <span className="text-[#D4AF37] italic">Works</span>
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 w-full">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.8, ease: "easeOut" }}
              className="group relative"
            >
              {/* Photo Frame Corners (L-shaped) - More Visible */}
              <div className="absolute -top-1 -left-1 size-8 border-t-2 border-l-2 border-[#D4AF37] transition-all duration-500 group-hover:size-10" />
              <div className="absolute -top-1 -right-1 size-8 border-t-2 border-r-2 border-[#D4AF37] transition-all duration-500 group-hover:size-10" />
              <div className="absolute -bottom-1 -left-1 size-8 border-b-2 border-l-2 border-[#D4AF37] transition-all duration-500 group-hover:size-10" />
              <div className="absolute -bottom-1 -right-1 size-8 border-b-2 border-r-2 border-[#D4AF37] transition-all duration-500 group-hover:size-10" />

              {/* Card Content */}
              <div className="h-full p-12 flex flex-col items-center text-center bg-card/40 backdrop-blur-md border border-[#D4AF37]/10 transition-all duration-500 group-hover:bg-[#D4AF37]/10 group-hover:border-[#D4AF37]/30 shadow-xl">
                <span className="text-6xl font-black text-[#D4AF37]/20 mb-8 transition-colors duration-500 group-hover:text-[#D4AF37]/40 serif">
                  {step.number}
                </span>
                
                <h3 className="text-2xl font-bold text-foreground mb-6 tracking-tight serif">
                  {step.title}
                </h3>
                
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
