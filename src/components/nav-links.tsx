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
  { label: "Hotel", href: "/booking/hotel", icon: <Hotel className="size-4" />, description: "Book luxury stays." },
  { label: "Barber Shop", href: "/booking/barber", icon: <Scissors className="size-4" />, description: "Professional grooming." },
  { label: "Spa Center", href: "/booking/spa", icon: <Sparkles className="size-4" />, description: "Relax and rejuvenate." },
  { label: "Parlour", href: "/booking/parlour", icon: <Flower2 className="size-4" />, description: "Beauty treatments." },
  { label: "Gym", href: "/booking/gym", icon: <Dumbbell className="size-4" />, description: "Personal training." },
  { label: "Function", href: "/booking/function", icon: <CalendarDays className="size-4" />, description: "Events and celebrations." },
  { label: "Funeral", href: "/booking/funeral", icon: <Moon className="size-4" />, description: "Respectful services." },
];

export const infoLinks = [
  { label: "Contact Us", href: "/info/contact", icon: <Mail className="size-4" />, description: "Get in touch." },
  { label: "Privacy", href: "/info/privacy", icon: <ShieldCheck className="size-4" />, description: "Our privacy policy." },
  { label: "Terms", href: "/info/terms", icon: <FileText className="size-4" />, description: "Usage terms." },
  { label: "Refunds", href: "/info/refunds", icon: <CreditCard className="size-4" />, description: "Refund information." },
];
