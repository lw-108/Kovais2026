"use client";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "HOTEL GUEST",
    content: "An unparalleled experience. The staff anticipated every need before I even asked. This is what true luxury feels like.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
  },
  {
    name: "Priya Suresh",
    role: "SPA CLIENT",
    content: "The spa treatments left me completely rejuvenated. The ambiance, the therapists, the products — absolutely world-class.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
  },
  {
    name: "Vikram Mohan",
    role: "REGULAR MEMBER",
    content: "I've been coming to Kovais for two years. The consistency of quality and the personal attention keeps me coming back.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-[#D4AF37]/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-20 space-y-4">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-2">
                Guest Voices
            </span>
            <div className="h-[2px] w-16 bg-[#D4AF37]" />
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter serif">
            What Our <span className="text-[#D4AF37] italic">Guests</span> Say
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="group relative"
            >
              <div className="h-full p-10 flex flex-col items-start text-left bg-card/30 backdrop-blur-md border border-border/10 transition-all duration-500 group-hover:bg-[#D4AF37]/5 shadow-xl">
                <Quote className="size-8 text-[#D4AF37]/40 mb-6" />
                
                <p className="text-lg text-foreground/90 italic leading-relaxed mb-8 font-medium">
                  "{t.content}"
                </p>

                <div className="flex gap-1 mb-8">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="size-4 fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                </div>

                <div className="mt-auto flex items-center gap-4">
                  <div className="size-12 rounded-full border-2 border-[#D4AF37] p-0.5 overflow-hidden">
                    <img src={t.avatar} alt={t.name} className="size-full object-cover rounded-full bg-muted" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground text-sm uppercase tracking-wider serif">{t.name}</span>
                    <span className="text-[10px] text-[#D4AF37] font-black tracking-widest">{t.role}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
