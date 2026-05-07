import { 
  Hotel, 
  Scissors, 
  Sparkles, 
  Flower2, 
  Dumbbell, 
  CalendarDays, 
  Moon,
  Mail,
  ShieldCheck,
  FileText,
  CreditCard
} from "lucide-react";

export const bookingLinks = [
  { label: "Hotel", href: "/hotel", icon: <Hotel className="size-4" />, description: "Book luxury stays." },
  { label: "Barber Shop", href: "/barber", icon: <Scissors className="size-4" />, description: "Professional grooming." },
  { label: "Spa Center", href: "/spa", icon: <Sparkles className="size-4" />, description: "Relax and rejuvenate." },
  { label: "Parlour", href: "/parlour", icon: <Flower2 className="size-4" />, description: "Beauty treatments." },
  { label: "Gym", href: "/gym", icon: <Dumbbell className="size-4" />, description: "Personal training." },
  { label: "Function", href: "/function", icon: <CalendarDays className="size-4" />, description: "Events and celebrations." },
  { label: "Funeral", href: "/funeral", icon: <Moon className="size-4" />, description: "Respectful services." },
];

export const infoLinks = [
  { label: "About Us", href: "/about", icon: <FileText className="size-4" />, description: "Our story and mission." },
  { label: "Contact Us", href: "/contact", icon: <Mail className="size-4" />, description: "Get in touch." },
  { label: "Privacy", href: "/privacy", icon: <ShieldCheck className="size-4" />, description: "Our privacy policy." },
  { label: "Terms", href: "/terms", icon: <FileText className="size-4" />, description: "Usage terms." },
  { label: "Refunds", href: "/refunds", icon: <CreditCard className="size-4" />, description: "Refund information." },
];
