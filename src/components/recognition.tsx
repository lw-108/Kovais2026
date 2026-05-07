"use client";
import { motion } from "framer-motion";
import { Trophy, Shield, Leaf } from "lucide-react";

const accolades = [
  {
    title: "Best Luxury Salon",
    year: "2023",
    issuer: "Tamil Nadu Hospitality Awards",
    icon: Trophy,
  },
  {
    title: "Excellence in Service",
    year: "2022",
    issuer: "South India Wellness Council",
    icon: Shield,
  },
  {
    title: "Eco-Friendly Practices",
    year: "2023",
    issuer: "Green Business Initiative",
    icon: Leaf,
  },
];

export function Recognition() {
  return (
    <section className="py-24 px-6 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-20 space-y-4">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-2">
                Recognition
            </span>
            <div className="h-[2px] w-16 bg-[#D4AF37]" />
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter serif">
            Awards & <span className="text-[#D4AF37] italic">Accolades</span>
          </h2>
        </div>

        {/* Accolades Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
          {accolades.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative"
            >
              {/* Photo Frame Corners (L-shaped) - High Visibility */}
              <div className="absolute -top-1 -left-1 size-10 border-t-2 border-l-2 border-[#D4AF37] transition-all duration-500 group-hover:size-12" />
              <div className="absolute -top-1 -right-1 size-10 border-t-2 border-r-2 border-[#D4AF37] transition-all duration-500 group-hover:size-12" />
              <div className="absolute -bottom-1 -left-1 size-10 border-b-2 border-l-2 border-[#D4AF37] transition-all duration-500 group-hover:size-12" />
              <div className="absolute -bottom-1 -right-1 size-10 border-b-2 border-r-2 border-[#D4AF37] transition-all duration-500 group-hover:size-12" />

              <div className="h-full p-12 flex flex-col items-center text-center bg-card/40 backdrop-blur-md border border-[#D4AF37]/10 transition-all duration-500 group-hover:bg-[#D4AF37]/10 group-hover:border-[#D4AF37]/30 shadow-2xl">
                <div className="mb-10 p-5 rounded-full bg-[#D4AF37]/10 group-hover:bg-[#D4AF37]/20 transition-all duration-500 group-hover:scale-110">
                    <item.icon className="size-10 text-[#D4AF37]" />
                </div>
                
                <h3 className="text-3xl font-bold text-foreground mb-6 tracking-tight serif">
                  {item.title}
                </h3>
                
                <div className="flex flex-col items-center gap-6">
                    <span className="px-4 py-1.5 bg-[#D4AF37] text-white text-[11px] font-black tracking-[0.2em] rounded-none">
                        {item.year}
                    </span>
                    <p className="text-sm text-muted-foreground font-bold uppercase tracking-[0.15em] max-w-[20ch]">
                        {item.issuer}
                    </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
