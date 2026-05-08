"use client";
import { useEffect, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import{
  Zap, 
  Gem, 
  Shield, 
  Headset, 
  Rocket, 
  Search, 
  Calendar, 
  Smile, 
  Users, 
  Building, 
  Clock, 
  Star, 
  Check,
  Quote
} from "lucide-react";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { LazyImage } from "@/components/ui/lazy-image";

// --- Animated Counter Component ---
function AnimatedCounter({ value, suffix = "", isFloat = false }: { value: number, suffix?: string, isFloat?: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 30,
    restDelta: 0.001
  });
  
  const displayValue = useTransform(springValue, (latest) => 
    isFloat ? latest.toFixed(1) : Math.floor(latest).toLocaleString()
  );

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  return (
    <span ref={ref}>
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </span>
  );
}

// --- Data ---
const FEATURES = [
  { icon: <Zap className="size-6" />, title: "Instant Booking", desc: "Reserve your favourite services in seconds with our lightning-fast booking system — no waiting, no hassle." },
  { icon: <Gem className="size-6" />, title: "Exclusive Perks", desc: "Unlock special discounts, loyalty rewards, and members-only promotions designed for regulars." },
  { icon: <Shield className="size-6" />, title: "Secure & Trusted", desc: "Bank-grade security for every transaction. Your data and payments are always fully protected." },
  { icon: <Headset className="size-6" />, title: "24/7 Support", desc: "Our dedicated support team is always available to assist you — any hour, any day of the week." },
  { icon: <Rocket className="size-6" />, title: "Smart Recommendations", desc: "AI-powered suggestions tailored to your preferences and booking history for a personalised touch." },
];

const SERVICES = [
  { img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80", title: "Luxury AC Room", desc: "Experience world-class hospitality with premium AC rooms, offering unmatched comfort.", number: "01" },
  { img: "https://images.unsplash.com/photo-1544161515-4af6b1d4640b?auto=format&fit=crop&q=80", title: "Relaxing Spa", desc: "Rejuvenate your body and mind with our expert spa treatments, crafted for deep relaxation.", number: "02" },
  { img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80", title: "Modern Gym", desc: "Train with state-of-the-art equipment in our fully-equipped modern gym.", number: "03" },
  { img: "https://images.unsplash.com/photo-1503951914875-3c0c13e4d5f6?auto=format&fit=crop&q=80", title: "Premium Salon", desc: "Get styled by expert professionals in our premium salon, offering trending cuts.", number: "04" },
];

const STEPS = [
  { icon: <Search />, title: "Browse & Discover", desc: "Explore our curated selection of premium services in one place." },
  { icon: <Calendar />, title: "Pick a Slot", desc: "View real-time availability and choose a date that perfectly fits your schedule." },
  { icon: <Shield />, title: "Secure Booking", desc: "Confirm your reservation with our encrypted, hassle-free payment system." },
  { icon: <Smile />, title: "Enjoy the Experience", desc: "Arrive and be welcomed. Your pre-booked premium experience awaits." },
];

const TESTIMONIALS = [
  { text: "Kovais completely transformed how I book my spa days. The interface is elegant, fast, and I always get exactly what I need.", author: "Priya Ramesh", role: "Lifestyle Blogger", initial: "P" },
  { text: "I travel frequently for work and Kovais has become my go-to for hotel pre-bookings. Instant confirmation, great pricing.", author: "Arjun Nair", role: "Senior Consultant", initial: "A" },
  { text: "The gym booking feature is brilliant. I can plan my workout slots a week in advance. Kovais feels like a personal concierge.", author: "Meena Sundaram", role: "Fitness Enthusiast", initial: "M" },
];

const MARQUEE = ["Luxury Hotels", "Rejuvenating Spas", "Modern Gyms", "Premium Salons", "Instant Booking", "Trusted by 10,000+", "24/7 Support"];

export default function AboutPage() {

  return (
    <div className="min-h-screen bg-transparent">
      <Header />

      <main className="pt-32 pb-24 space-y-32">
        {/* 1. Hero Section */}
        <section className="relative px-6 max-w-7xl mx-auto text-center space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-[#D4AF37] font-bold tracking-[0.4em] text-[10px] uppercase border border-[#D4AF37]/20 px-4 py-2"
          >
            <div className="size-1.5 bg-[#D4AF37] rounded-full animate-pulse" />
            Premium Services Platform
          </motion.div>
          
          <div className="space-y-8">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black tracking-tighter serif leading-[0.95] uppercase"
            >
              Elevate Your Lifestyle <br />
              <span className="text-[#D4AF37] italic font-light">with Kovais</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground font-medium text-lg md:text-xl max-w-2xl mx-auto"
            >
              Your all-in-one destination for seamless pre-booking of premium services — 
              from luxury hotels and rejuvenating spas to modern gyms and expert salons.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center"
          >
            <div className="size-12 border border-[#D4AF37]/20 flex items-center justify-center rounded-full">
              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="size-1.5 bg-[#D4AF37] rounded-full" 
              />
            </div>
          </motion.div>
        </section>

        {/* 2. Marquee Track */}
        <div className="py-8 bg-black overflow-hidden border-y border-[#D4AF37]/20">
          <div className="flex animate-marquee whitespace-nowrap gap-16 items-center">
            {[...MARQUEE, ...MARQUEE].map((item, i) => (
              <span key={i} className="text-white/40 text-[10px] font-black tracking-[0.5em] flex items-center gap-4 uppercase">
                <span className="text-[#D4AF37]">◆</span> {item}
              </span>
            ))}
          </div>
        </div>

        {/* 3. Features Section */}
        <section className="max-w-7xl mx-auto px-6 space-y-20">
          <div className="text-center space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">WHY CHOOSE US</span>
            <h2 className="text-4xl md:text-6xl font-black serif uppercase tracking-tight">Built for <span className="text-[#D4AF37]">Excellence</span></h2>
            <p className="text-muted-foreground text-sm font-medium max-w-xl mx-auto">Every detail is crafted to deliver a premium, luxury experience from start to finish.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-10 border border-[#D4AF37]/10 bg-background hover:border-[#D4AF37]/30 transition-all duration-500 space-y-6 group"
              >
                <div className="text-[#D4AF37] group-hover:scale-110 transition-transform duration-500">{f.icon}</div>
                <div className="space-y-3">
                  <h4 className="font-black text-xs uppercase tracking-widest">{f.title}</h4>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. Curated Services */}
        <section className="bg-black py-32 text-white">
          <div className="max-w-7xl mx-auto px-6 space-y-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">OUR SERVICES</span>
                <h2 className="text-4xl md:text-6xl font-black serif uppercase tracking-tight">Curated <br /> <span className="text-[#D4AF37]">Experiences</span></h2>
              </div>
              <p className="text-white/40 text-sm font-medium max-w-md">
                Discover our handpicked range of premium services, each designed to exceed your expectations of modern luxury.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-1">
              {SERVICES.map((s, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative aspect-[3/4] overflow-hidden"
                >
                  <LazyImage src={s.img} alt={s.title} className="size-full grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end space-y-4 translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-[#D4AF37] font-black serif text-4xl opacity-40">{s.number}</span>
                    <h4 className="font-black text-xl uppercase tracking-tight">{s.title}</h4>
                    <p className="text-[10px] text-white/60 font-medium uppercase tracking-widest leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Process Section */}
        <section className="max-w-7xl mx-auto px-6 space-y-20">
          <div className="text-center space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">HOW IT WORKS</span>
            <h2 className="text-4xl md:text-6xl font-black serif uppercase tracking-tight">Simple. Seamless. <span className="text-[#D4AF37]">Premium.</span></h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center space-y-8 relative group"
              >
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-px border-t border-dashed border-[#D4AF37]/20" />
                )}
                <div className="size-24 mx-auto bg-background border border-[#D4AF37]/20 rounded-full flex items-center justify-center relative z-10 group-hover:bg-[#D4AF37] group-hover:text-white transition-all duration-500">
                  <div className="text-[#D4AF37] group-hover:text-white transition-colors">{step.icon}</div>
                  <div className="absolute -top-2 -right-2 size-8 bg-black text-[#D4AF37] text-[10px] font-black flex items-center justify-center rounded-full border border-[#D4AF37]/20">
                    0{i+1}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-black text-xs uppercase tracking-widest">{step.title}</h4>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 6. Mission Section */}
        <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <LazyImage src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80" alt="About 1" className="aspect-[3/4] border border-[#D4AF37]/20" />
                                <LazyImage src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80" alt="About 2" className="aspect-square border border-[#D4AF37]/20" />
              </div>
              <div className="space-y-4">
                <LazyImage src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80" alt="About 3" className="aspect-square border border-[#D4AF37]/20" />
                <LazyImage src="https://images.unsplash.com/photo-1503951914875-3c0c13e4d5f6?auto=format&fit=crop&q=80" alt="About 4" className="aspect-[3/4] border border-[#D4AF37]/20" />
              </div>
            </div>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">OUR MISSION</span>
                <h2 className="text-5xl font-black serif uppercase tracking-tight leading-[1.1]">Redefining How You Book <br /> <span className="text-[#D4AF37]">Premium Services</span></h2>
              </div>
              
              <p className="text-muted-foreground text-lg font-medium">
                At Kovais, we believe in making luxury accessible. Our platform bridges the gap between you and the finest services, ensuring a seamless, delightful booking experience every time.
              </p>

              <div className="space-y-4">
                {[
                  "Curated selection of verified premium service providers",
                  "Real-time availability with instant confirmation",
                  "Personalised recommendations powered by smart algorithms",
                  "Transparent pricing with no hidden charges"
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-black/60">
                    <div className="size-5 rounded-full border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                      <Check className="size-3" />
                    </div>
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 7. Stats Section */}
        <section className="bg-background border-y border-[#D4AF37]/10 py-32">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-16">
            {[
              { icon: <Users />, value: 10000, suffix: "+", label: "Happy Clients" },
              { icon: <Building />, value: 500, suffix: "+", label: "Partner Venues" },
              { icon: <Star />, value: 4.9, suffix: "/5", label: "Average Rating", isFloat: true },
              { icon: <Clock />, value: 3, suffix: " Min", label: "Avg. Booking Time" },
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-6 group">
                <div className="size-16 mx-auto rounded-full border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white transition-all duration-500">
                  {stat.icon}
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black serif uppercase tracking-tight">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} isFloat={stat.isFloat} />
                  </div>
                  <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Testimonials Section */}
        <section className="max-w-7xl mx-auto px-6 space-y-20">
          <div className="text-center space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">TESTIMONIALS</span>
            <h2 className="text-4xl md:text-6xl font-black serif uppercase tracking-tight">What Our <span className="text-[#D4AF37]">Clients</span> Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {TESTIMONIALS.map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-10 bg-background border border-[#D4AF37]/10 flex flex-col justify-between space-y-10 group"
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    {[...Array(5)].map((_, si) => <Star key={si} className="size-3 fill-current" />)}
                  </div>
                  <div className="relative">
                    <Quote className="size-10 text-[#D4AF37]/10 absolute -top-4 -left-4" />
                    <p className="text-sm font-medium italic text-muted-foreground relative z-10 leading-relaxed">"{t.text}"</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-black text-[#D4AF37] font-black flex items-center justify-center text-xs">
                    {t.initial}
                  </div>
                  <div>
                    <div className="font-black text-[10px] uppercase tracking-widest">{t.author}</div>
                    <div className="text-[9px] font-bold text-[#D4AF37] uppercase">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 9. CTA Section */}
        <section className="px-6 max-w-7xl mx-auto">
          <div className="relative bg-black py-24 px-8 overflow-hidden text-center border border-[#D4AF37]/30">
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80')] bg-cover bg-center" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-10">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">GET STARTED TODAY</span>
                <h2 className="text-4xl md:text-6xl font-black serif uppercase tracking-tight text-white leading-[1.1]">Ready to Experience <br /> <span className="text-[#D4AF37] italic">Luxury</span> on Your Terms?</h2>
              </div>
              <p className="text-white/60 font-medium max-w-lg mx-auto">Join over 10,000 clients who pre-book with confidence. Your next premium experience is just a tap away.</p>
              <div className="flex flex-wrap justify-center gap-6">
                <Button className="h-16 px-12 bg-[#D4AF37] hover:bg-white hover:text-black text-white font-black uppercase tracking-widest text-[11px] rounded-none transition-all duration-500">
                  Book Now
                </Button>
                <Button variant="outline" className="h-16 px-12 bg-white/10 border-white/20 hover:bg-white hover:text-black text-white font-black uppercase tracking-widest text-[11px] rounded-none transition-all duration-500">
                  Explore Services
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
