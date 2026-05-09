import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Scissors, 
  CalendarDays, 
  Hotel as HotelIcon, 
  Sparkles, 
  Clock,
  Dumbbell,
} from "lucide-react";
import { LazyImage } from "@/components/ui/lazy-image";

// Image Imports
import funeralImg from "@/assets/funeral.png";
import hotelImg from "@/assets/hotel.jpeg";
import spaImg from "@/assets/spa.jpeg";
import barberImg from "@/assets/barber.jpeg";
import gymImg from "@/assets/gym.jpeg";
import functionImg from "@/assets/function.png";

const features = [
  {
    title: "Master Grooming",
    description: "Precision cuts and styling for the modern gentleman, crafted with traditional care.",
    image: barberImg,
    href: "/barber",
    icon: Scissors
  },
  {
    title: "Luxury Hotel",
    description: "Elite accommodation with personalized concierge services for a seamless stay.",
    image: hotelImg,
    href: "/hotel",
    icon: HotelIcon
  },
  {
    title: "Wellness Spa",
    description: "Rejuvenate your body and mind in our serene sanctuary of total relaxation.",
    image: spaImg,
    href: "/spa",
    icon: Sparkles
  },
  {
    title: "Fitness Studio",
    description: "State-of-the-art equipment and personal training to elevate your peak performance.",
    image: gymImg,
    href: "/gym",
    icon: Dumbbell
  },
  {
    title: "Function Services",
    description: "Flawless grooming and events management for your special occasions.",
    image: functionImg,
    href: "/function",
    icon: CalendarDays
  },
  {
    title: "Funeral Services",
    description: "Dignified and respectful funeral services, handled with the utmost care and compassion.",
    image: funeralImg,
    href: "/funeral",
    icon: Clock
  },
];

const Features = () => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 md:py-32  relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 size-96  blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 size-96  blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-7xl">
        <div className="max-w-2xl mb-20">
          <h2 className="font-black text-4xl md:text-6xl text-foreground tracking-tighter leading-[1.1] mb-6 serif">
            Our Premium Services
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-medium">
            Excellence in every detail, tailored to elevate your lifestyle with Coimbatore's finest hospitality standards.
          </p>
        </div>

        <div className="grid w-full gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              className="group flex w-full flex-col text-start"
              key={feature.title}
            >
              <div className="relative mb-6 aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-xl transition-all duration-500 group-hover:shadow-[#D4AF37]/10">
                <LazyImage
                  src={feature.image}
                  alt={feature.title}
                  className="size-full bg-muted transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                
                <div className="absolute top-4 right-4 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                   <feature.icon className="size-5 text-[#D4AF37]" />
                </div>
              </div>
              
              <div className="px-1 flex flex-col items-start gap-4">
                <div className="space-y-2">
                    <h3 className="font-bold text-2xl tracking-tight text-foreground serif">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-[35ch]">
                      {feature.description}
                    </p>
                </div>

                <Button 
                    asChild
                    className="bg-[#D4AF37] hover:bg-[#B8962E] text-white rounded-full px-6 transition-all hover:scale-105"
                >
                    <a href={feature.href}>
                        Explore Service <ArrowRight className="size-4 ml-2" />
                    </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
