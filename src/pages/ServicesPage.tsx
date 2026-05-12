import { motion } from "framer-motion";
import { ArrowRight, Star, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LazyImage } from "@/components/ui/lazy-image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

// Assets
import hotelImg from "@/assets/hotel.jpeg";
import spaImg from "@/assets/spa.jpeg";
import gymImg from "@/assets/gym.jpeg";
import barberImg from "@/assets/barber.jpeg";
import functionImg from "@/assets/function.png";
import funeralImg from "@/assets/funeral.png";

const SERVICES = [
  {
    id: "hotel",
    title: "Luxury Hospitality",
    highlight: "Suites",
    desc: "Experience world-class comfort in our curated boutique suites. Where heritage meets modern luxury.",
    image: hotelImg,
    path: "/hotel",
    category: "Hospitality",
    className: "lg:col-span-2 lg:row-span-2"
  },
  {
    id: "spa",
    title: "Holistic Wellness",
    highlight: "Rituals",
    desc: "A sanctuary for the senses. Indulge in ancient therapeutic rituals and modern skin science.",
    image: spaImg,
    path: "/spa",
    category: "Wellness",
    className: "lg:col-span-1 lg:row-span-2"
  },
  {
    id: "gym",
    title: "Elite Fitness",
    highlight: "Studio",
    desc: "State-of-the-art equipment and personalized coaching to redefine your physical limits.",
    image: gymImg,
    path: "/gym",
    category: "Performance",
    className: "lg:col-span-1 lg:row-span-1"
  },
  {
    id: "barber",
    title: "Master Grooming",
    highlight: "Atelier",
    desc: "Precision cuts and royal shaves in an environment of absolute sophistication.",
    image: barberImg,
    path: "/barber",
    category: "Grooming",
    className: "lg:col-span-1 lg:row-span-1"
  },
  {
    id: "parlour",
    title: "Couture Beauty",
    highlight: "Maison",
    desc: "High-definition makeup and advanced aesthetic treatments for the most discerning clients.",
    image: spaImg,
    path: "/parlour",
    category: "Aesthetics",
    className: "lg:col-span-2 lg:row-span-1"
  },
  {
    id: "function",
    title: "Grand Celebrations",
    highlight: "Estates",
    desc: "Host your most precious moments in spaces designed for elegance and seamless flow.",
    image: functionImg,
    path: "/function",
    category: "Events",
    className: "lg:col-span-1 lg:row-span-1"
  },
  {
    id: "funeral",
    title: "Graceful Legacies",
    highlight: "Service",
    desc: "Compassionate, dignified arrangements to honor lives with the respect they deserve.",
    image: funeralImg,
    path: "/funeral",
    category: "Remembrance",
    className: "lg:col-span-1 lg:row-span-1"
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen selection:bg-[#D4AF37] selection:text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">The Kovais Suite</span>
              <div className="h-[1px] w-12 bg-[#D4AF37]/30" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter serif leading-[0.9] text-foreground">
              Explore Our <br />
              <span className="text-[#D4AF37] italic">Masterpieces</span>
            </h1>
            <p className="max-w-xl text-muted-foreground text-lg font-medium leading-relaxed">
              From the quiet luxury of our sanctuary to the precision of our grooming rituals, 
              discover a world designed for excellence.
            </p>
          </motion.div>
        </div>

        {/* Decor */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#D4AF37]/5 to-transparent -z-10" />
      </section>

      {/* Services Bento Grid */}
      <section className="px-4 md:px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[300px] md:auto-rows-[350px] lg:auto-rows-[400px]">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.8, 
                  delay: i * 0.1,
                  ease: [0.21, 0.47, 0.32, 0.98] 
                }}
                className={`group relative overflow-hidden bg-black/40 border border-[#D4AF37]/10 hover:border-[#D4AF37]/40 transition-all duration-700 shadow-2xl ${service.className}`}
              >
                {/* Image background with zoom effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <LazyImage 
                    src={service.image} 
                    alt={service.title} 
                    className="size-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-100 transition-all duration-[2.5s] ease-out" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>

                {/* Glassmorphism Border Overlay */}
                <div className="absolute inset-0 border border-white/5 pointer-events-none" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col p-6 md:p-10">
                  <div className="flex justify-between items-start translate-y-2 group-hover:translate-y-0 transition-transform duration-700">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">
                        {service.category}
                      </span>
                      <div className="h-[2px] w-0 group-hover:w-full bg-[#D4AF37] transition-all duration-700" />
                    </div>
                    <div className="p-3 bg-background/5 backdrop-blur-md border border-[#D4AF37]/40 rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <ArrowUpRight className="text-[#D4AF37]" size={20} />
                    </div>
                  </div>

                  <div className="mt-auto space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-3xl md:text-4xl font-black text-white leading-[1.1] tracking-tighter serif">
                        {service.title.split(' ')[0]} <br />
                        <span className="text-[#D4AF37] italic">{service.highlight}</span>
                      </h3>
                      <p className="text-[10px] md:text-xs text-white/40 font-medium leading-relaxed max-w-[280px] transform translate-y-6 group-hover:translate-y-0 transition-all duration-700 opacity-0 group-hover:opacity-100">
                        {service.desc}
                      </p>
                    </div>

                    <div className="pt-2 transform translate-y-8 group-hover:translate-y-0 transition-all duration-700 opacity-0 group-hover:opacity-100">
                      <Link to={service.path}>
                        <Button variant="ghost" className="h-12 px-0 text-[#D4AF37] hover:text-white hover:bg-transparent font-black uppercase tracking-widest text-[9px] flex items-center gap-4 group/btn transition-colors duration-500">
                          Begin Ritual 
                          <ArrowRight className="size-4 group-hover/btn:translate-x-2 transition-transform duration-500" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Subtle Glow */}
                <div className="absolute -bottom-20 -right-20 size-40 bg-[#D4AF37]/10 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
