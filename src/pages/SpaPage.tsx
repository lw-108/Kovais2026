import React, { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  Star, 
  Flower2,
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Home, 
  Building, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  X,
  Award,
  Users,
  Quote,
  Sparkles,
  Droplets,
  Massage,
  Leaf,
  Coffee,
  Wind,
  Scissors,
  Heart,
  Moon,
  Sun
} from "lucide-react";
import { format } from "date-fns";

// Type definitions
interface Service {
  id: string;
  name: string;
  desc: string;
  duration: string;
  price: number;
  category: string;
  popular?: boolean;
}

interface Specialist {
  id: number;
  name: string;
  role: string;
  rating: number;
  image: string;
  expertise: string;
}

interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  extraNote: string;
}

// UI Components (same as barber page)
const Button = ({ 
  children, 
  onClick, 
  variant = "default", 
  className = "", 
  disabled = false, 
  size = "default" 
}: { 
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost";
  className?: string;
  disabled?: boolean;
  size?: "sm" | "default" | "lg";
}) => {
  let baseClass = "inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-300 rounded-none ";
  if (variant === "default") baseClass += "bg-[#D4AF37] hover:bg-[#B8962E] text-black ";
  if (variant === "outline") baseClass += "border border-[#D4AF37]/30 bg-transparent hover:bg-[#D4AF37]/10 text-black ";
  if (variant === "ghost") baseClass += "bg-transparent hover:bg-black/5 text-black ";
  if (size === "sm") baseClass += "px-4 py-2 text-[10px] h-10 ";
  if (size === "default") baseClass += "px-6 py-3 text-[11px] h-12 ";
  if (size === "lg") baseClass += "px-8 py-4 text-sm h-14 ";
  return (
    <button className={`${baseClass} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

const Badge = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-[#D4AF37]/10 border border-[#D4AF37]/20 ${className}`}>
    {children}
  </span>
);

const Dialog = ({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-w-2xl w-full mx-4 bg-[#FDFBF7] border border-[#D4AF37]/30 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const SimpleCalendar = ({ selected, onSelect }: { selected: Date | null; onSelect: (date: Date) => void }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysArray: (Date | null)[] = [];
  for (let i = 0; i < startDay; i++) daysArray.push(null);
  for (let i = 1; i <= endOfMonth.getDate(); i++) daysArray.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
  
  const isSelected = (date: Date) => selected && format(date, "yyyy-MM-dd") === format(selected, "yyyy-MM-dd");
  const isToday = (date: Date) => format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  
  return (
    <div className="p-4 bg-white border border-[#D4AF37]/20 w-full">
      <div className="flex justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}>
          <ChevronLeft className="w-4 h-4"/>
        </Button>
        <span className="font-bold text-sm">{format(currentMonth, "MMMM yyyy")}</span>
        <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}>
          <ChevronRight className="w-4 h-4"/>
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-muted-foreground mb-2">
        {days.map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {daysArray.map((date, idx) => (
          <div key={idx} className="h-10 flex items-center justify-center">
            {date && (
              <button 
                onClick={() => onSelect(date)} 
                className={`w-8 h-8 text-xs font-bold rounded-full transition-all ${isSelected(date) ? "bg-[#D4AF37] text-white" : isToday(date) ? "border border-[#D4AF37] text-black" : "hover:bg-[#D4AF37]/20"}`}
              >
                {date.getDate()}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Main SPA Component
export default function SpaPage() {
  // --- State Management ---
  const [serviceType, setServiceType] = useState<"salon" | "home">("salon");
  const [selectedCategory, setSelectedCategory] = useState<"women" | "men" | "couples" | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({ name: "", phone: "", address: "", extraNote: "" });
  const [showInfo, setShowInfo] = useState(false);
  
  // Carousel
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselImages = [
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&auto=format",
    "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=1200&auto=format",
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1200&auto=format"
  ];
  const carouselTitles = [
    "Where Beauty Meets Serenity",
    "Rejuvenate Your Senses",
    "Luxury Wellness Since 2010"
  ];
  const carouselSubtitles = [
    "Step into our sanctuary of beauty where expert therapists deliver transformative spa experiences. Discover ultimate relaxation and radiant glow.",
    "Experience the finest in traditional wellness with modern techniques. Our master therapists deliver personalized treatments for complete rejuvenation.",
    "Every treatment is a journey to wellness. Our skilled professionals combine ancient wisdom with contemporary luxury to restore your natural beauty."
  ];
  
  // Auto carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);
  
  // Services Data
  const servicesMap: Record<string, Service[]> = {
    women: [
      { id: "facial", name: "Signature Facial", desc: "Deep cleansing with organic products", duration: "60 min", price: 85, category: "Women", popular: true },
      { id: "massage", name: "Aromatherapy Massage", desc: "Full body relaxation with essential oils", duration: "90 min", price: 120, category: "Women" },
      { id: "bodywrap", name: "Body Wrap & Scrub", desc: "Exfoliation and nourishing wrap", duration: "75 min", price: 95, category: "Women" },
      { id: "bridal", name: "Bridal Package", desc: "Complete wedding day preparation", duration: "240 min", price: 250, category: "Women", popular: true }
    ],
    men: [
      { id: "mensfacial", name: "Gentleman's Facial", desc: "Deep cleansing for men's skin", duration: "50 min", price: 75, category: "Men" },
      { id: "sportsmassage", name: "Sports Massage", desc: "Deep tissue relief for active men", duration: "60 min", price: 90, category: "Men", popular: true },
      { id: "grooming", name: "Premium Grooming", desc: "Facial, manicure & head massage", duration: "90 min", price: 110, category: "Men" }
    ],
    couples: [
      { id: "couplesmassage", name: "Couples Massage", desc: "Side-by-side relaxation experience", duration: "90 min", price: 220, category: "Couples", popular: true },
      { id: "spaday", name: "Spa Day Package", desc: "Full day of pampering for two", duration: "300 min", price: 380, category: "Couples" },
      { id: "romantic", name: "Romantic Retreat", desc: "Champagne, chocolates & massage", duration: "120 min", price: 280, category: "Couples" }
    ]
  };
  
  const specialists: Specialist[] = [
    { id: 1, name: "Dr. Sarah Wilson", role: "Master Aesthetician", rating: 4.9, image: "https://randomuser.me/api/portraits/women/44.jpg", expertise: "women" },
    { id: 2, name: "Maria Garcia", role: "Spa Therapist", rating: 4.8, image: "https://randomuser.me/api/portraits/women/68.jpg", expertise: "women" },
    { id: 3, name: "James Peterson", role: "Men's Specialist", rating: 4.7, image: "https://randomuser.me/api/portraits/men/32.jpg", expertise: "men" },
    { id: 4, name: "Emma & David", role: "Couples Experts", rating: 4.9, image: "https://randomuser.me/api/portraits/women/89.jpg", expertise: "couples" }
  ];
  
  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];
  
  const handleCategorySelect = (category: "women" | "men" | "couples") => {
    setSelectedCategory(category);
    setSelectedService(null);
    setBookingStep(1);
  };
  
  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setBookingStep(1);
  };
  
  const proceedToStep2 = () => {
    if (!selectedService) return;
    setBookingStep(2);
  };
  
  const proceedToStep3 = () => {
    if (!selectedSpecialist) return;
    setBookingStep(3);
  };
  
  const proceedToStep4 = () => {
    if (!selectedDate || !selectedTime) return;
    if (serviceType === "home") setBookingStep(4);
    else handleFinalBooking();
  };
  
  const handleFinalBooking = () => {
    if (serviceType === "salon" && (!customerDetails.name || !customerDetails.phone)) {
      alert("Please provide your name and phone number");
      return;
    }
    if (serviceType === "home" && (!customerDetails.name || !customerDetails.phone || !customerDetails.address)) {
      alert("Please provide full address for home service");
      return;
    }
    const totalAmount = (selectedService?.price || 0) + (serviceType === "home" ? 300 : 0);
    alert(`✨ Spa Booking Confirmed! ✨\n\nService: ${selectedService?.name}\nDate: ${selectedDate ? format(selectedDate, "PPP") : ""} at ${selectedTime}\nTherapist: ${selectedSpecialist?.name}\nTotal: ₹${totalAmount}\n${serviceType === "home" ? "📍 Home spa service to your address" : "🏢 Visit our luxury spa"}\n\nWe look forward to pampering you!`);
    
    // Reset
    setBookingStep(1);
    setSelectedService(null);
    setSelectedSpecialist(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedCategory(null);
    setCustomerDetails({ name: "", phone: "", address: "", extraNote: "" });
  };
  
  const getFilteredSpecialists = (): Specialist[] => {
    if (!selectedCategory) return specialists;
    if (selectedCategory === "women") return specialists.filter(s => s.expertise === "women");
    if (selectedCategory === "men") return specialists.filter(s => s.expertise === "men");
    return specialists.filter(s => s.expertise === "couples");
  };
  
  const homeFee = serviceType === "home" ? 300 : 0;
  const totalPrice = selectedService ? selectedService.price + homeFee : 0;
  
  const renderStepContent = () => {
    if (bookingStep === 1 && selectedService) {
      return (
        <div className="space-y-6">
          <div className="border-l-4 border-[#D4AF37] pl-4 mb-4">
            <h4 className="font-black text-lg">Selected Treatment</h4>
            <div className="flex justify-between items-center mt-3 p-4 bg-white/60">
              <div>
                <p className="font-bold">{selectedService.name}</p>
                <p className="text-xs text-muted-foreground">{selectedService.duration}</p>
              </div>
              <p className="font-black text-xl">₹{selectedService.price}</p>
            </div>
            <Button className="w-full mt-6" onClick={proceedToStep2}>
              Continue <ChevronRight className="w-4 h-4 ml-2"/>
            </Button>
          </div>
        </div>
      );
    }
    if (bookingStep === 2) {
      return (
        <div className="space-y-5">
          <h4 className="font-black text-lg">Choose Your Therapist</h4>
          <div className="grid grid-cols-1 gap-4 max-h-64 overflow-auto">
            {getFilteredSpecialists().map(spec => (
              <div 
                key={spec.id} 
                onClick={() => setSelectedSpecialist(spec)} 
                className={`p-4 border cursor-pointer transition flex items-center gap-4 ${selectedSpecialist?.id === spec.id ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-gray-200 bg-white'}`}
              >
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                  <img src={spec.image} alt={spec.name} className="w-full h-full object-cover"/>
                </div>
                <div className="flex-1">
                  <p className="font-bold">{spec.name}</p>
                  <p className="text-xs text-muted-foreground">{spec.role}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]"/>
                  <span className="text-sm font-bold">{spec.rating}</span>
                </div>
                {selectedSpecialist?.id === spec.id && <Check className="w-5 h-5 text-[#D4AF37]"/>}
              </div>
            ))}
          </div>
          <Button onClick={proceedToStep3} disabled={!selectedSpecialist} className="w-full">
            Continue <ChevronRight className="w-4 h-4 ml-2"/>
          </Button>
        </div>
      );
    }
    if (bookingStep === 3) {
      return (
        <div className="space-y-6">
          <h4 className="font-black text-lg">Choose Date & Time</h4>
          <div className="border border-[#D4AF37]/20 p-4 bg-white">
            <SimpleCalendar selected={selectedDate} onSelect={setSelectedDate}/>
          </div>
          <div>
            <p className="font-bold text-sm mb-2">Available Time Slots</p>
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map(t => (
                <button 
                  key={t} 
                  onClick={() => setSelectedTime(t)} 
                  className={`py-2 border text-xs font-bold transition ${selectedTime === t ? 'bg-[#D4AF37] text-white border-[#D4AF37]' : 'bg-white border-gray-200 hover:border-[#D4AF37]'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={proceedToStep4} disabled={!selectedDate || !selectedTime} className="w-full">
            Continue
          </Button>
        </div>
      );
    }
    if (bookingStep === 4 && serviceType === "home") {
      return (
        <div className="space-y-5">
          <h4 className="font-black text-lg">Your Details for Home Spa</h4>
          <input 
            className="w-full p-3 border border-gray-200 bg-white" 
            placeholder="Full Name" 
            value={customerDetails.name} 
            onChange={e => setCustomerDetails({...customerDetails, name: e.target.value})} 
          />
          <input 
            className="w-full p-3 border border-gray-200 bg-white" 
            placeholder="Phone Number" 
            value={customerDetails.phone} 
            onChange={e => setCustomerDetails({...customerDetails, phone: e.target.value})} 
          />
          <textarea 
            className="w-full p-3 border border-gray-200 bg-white" 
            rows={2} 
            placeholder="Complete Address for Home Service" 
            value={customerDetails.address} 
            onChange={e => setCustomerDetails({...customerDetails, address: e.target.value})} 
          />
          <input 
            className="w-full p-3 border border-gray-200 bg-white" 
            placeholder="Special requests / preferences (optional)" 
            value={customerDetails.extraNote} 
            onChange={e => setCustomerDetails({...customerDetails, extraNote: e.target.value})} 
          />
          <Button onClick={handleFinalBooking} className="w-full bg-[#D4AF37] text-black">
            Confirm Spa Booking · ₹{totalPrice}
          </Button>
        </div>
      );
    }
    if (bookingStep === 4 && serviceType === "salon") {
      return (
        <div className="space-y-5">
          <h4 className="font-black text-lg">Your Contact Details</h4>
          <input 
            className="w-full p-3 border border-gray-200 bg-white" 
            placeholder="Full Name" 
            value={customerDetails.name} 
            onChange={e => setCustomerDetails({...customerDetails, name: e.target.value})} 
          />
          <input 
            className="w-full p-3 border border-gray-200 bg-white" 
            placeholder="Phone Number" 
            value={customerDetails.phone} 
            onChange={e => setCustomerDetails({...customerDetails, phone: e.target.value})} 
          />
          <Button onClick={handleFinalBooking} className="w-full bg-[#D4AF37] text-black">
            Confirm Booking · ₹{totalPrice}
          </Button>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <header className="fixed top-0 w-full z-30 bg-white/90 backdrop-blur-md border-b border-[#D4AF37]/20 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Flower2 className="text-[#D4AF37] w-6 h-6"/>
          <span className="font-black text-xl tracking-tighter" style={{ fontFamily: "'Playfair Display', serif" }}>KOVAIS SPA</span>
        </div>
        <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-wider">
          <a href="#">Home</a>
          <a href="#">Treatments</a>
          <a href="#">Packages</a>
          <a href="#">Contact</a>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowInfo(true)}>Book Now</Button>
      </header>
      
      <main className="pt-28 pb-20">
        {/* Hero Carousel Section */}
        <div className="relative h-[70vh] overflow-hidden group">
          <div 
            className="absolute inset-0 transition-all duration-700" 
            style={{
              backgroundImage: `url(${carouselImages[carouselIndex]})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black/40"/>
          </div>
          <div className="relative h-full flex flex-col justify-center items-center text-center text-white px-6">
            <div className="max-w-3xl animate-fade">
              <h1 className="text-5xl md:text-7xl font-black mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                {carouselTitles[carouselIndex]}
              </h1>
              <p className="text-lg md:text-xl font-light opacity-90">{carouselSubtitles[carouselIndex]}</p>
            </div>
          </div>
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
            {carouselImages.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setCarouselIndex(idx)} 
                className={`transition-all ${idx === carouselIndex ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-white/50'} h-2 rounded-full`}
              />
            ))}
          </div>
        </div>
        
        {/* Premium Stats */}
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8 text-center border-b border-[#D4AF37]/20">
          <div>
            <Award className="mx-auto w-10 h-10 text-[#D4AF37] mb-3"/>
            <div className="font-black text-2xl">4.9</div>
            <p className="text-xs uppercase">Client Rating</p>
          </div>
          <div>
            <Users className="mx-auto w-10 h-10 text-[#D4AF37] mb-3"/>
            <div className="font-black text-2xl">10k+</div>
            <p className="text-xs uppercase">Happy Clients</p>
          </div>
          <div>
            <Heart className="mx-auto w-10 h-10 text-[#D4AF37] mb-3"/>
            <div className="font-black text-2xl">15+</div>
            <p className="text-xs uppercase">Expert Therapists</p>
          </div>
        </div>
        
        {/* Service Location Switch & Category Selection */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex justify-center mb-12">
            <div className="inline-flex border-2 border-[#D4AF37]/40 p-1 rounded-full bg-white shadow-lg">
              <button 
                onClick={() => setServiceType("salon")} 
                className={`px-8 py-3 rounded-full font-black uppercase text-xs tracking-wider transition-all ${serviceType === "salon" ? "bg-[#D4AF37] text-black" : "text-muted-foreground"}`}
              >
                <Building className="inline mr-2 w-4 h-4"/> Spa Salon
              </button>
              <button 
                onClick={() => setServiceType("home")} 
                className={`px-8 py-3 rounded-full font-black uppercase text-xs tracking-wider transition-all ${serviceType === "home" ? "bg-[#D4AF37] text-black" : "text-muted-foreground"}`}
              >
                <Home className="inline mr-2 w-4 h-4"/> Home Spa {serviceType === "home" && <span className="ml-1 text-[10px]">(+₹300)</span>}
              </button>
            </div>
          </div>
          
          {/* Category Selection Buttons */}
          <div className="flex justify-center gap-6 mb-16">
            <button 
              onClick={() => handleCategorySelect("women")} 
              className={`px-8 py-3 font-black uppercase tracking-wider text-sm border-2 transition-all ${selectedCategory === "women" ? "bg-[#D4AF37] text-black border-[#D4AF37]" : "bg-white text-black border-gray-300 hover:border-[#D4AF37]"}`}
            >
              <Sparkles className="inline mr-2 w-4 h-4"/> Women
            </button>
            <button 
              onClick={() => handleCategorySelect("men")} 
              className={`px-8 py-3 font-black uppercase tracking-wider text-sm border-2 transition-all ${selectedCategory === "men" ? "bg-[#D4AF37] text-black border-[#D4AF37]" : "bg-white text-black border-gray-300 hover:border-[#D4AF37]"}`}
            >
              <Scissors className="inline mr-2 w-4 h-4"/> Men
            </button>
            <button 
              onClick={() => handleCategorySelect("couples")} 
              className={`px-8 py-3 font-black uppercase tracking-wider text-sm border-2 transition-all ${selectedCategory === "couples" ? "bg-[#D4AF37] text-black border-[#D4AF37]" : "bg-white text-black border-gray-300 hover:border-[#D4AF37]"}`}
            >
              <Heart className="inline mr-2 w-4 h-4"/> Couples
            </button>
          </div>
          
          {/* Service Cards Grid */}
          {selectedCategory && servicesMap[selectedCategory] && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
              {servicesMap[selectedCategory].map(service => (
                <div 
                  key={service.id} 
                  className={`bg-white border p-6 transition-all cursor-pointer hover:shadow-2xl ${selectedService?.id === service.id ? 'border-[#D4AF37] shadow-lg' : 'border-gray-200'}`} 
                  onClick={() => handleServiceSelect(service)}
                >
                  {service.popular && (
                    <Badge className="mb-3 bg-[#D4AF37] text-white border-none">Most Popular</Badge>
                  )}
                  <h3 className="font-black text-xl mb-2">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{service.desc}</p>
                  <div className="flex justify-between items-center">
                    <Badge>{service.duration}</Badge>
                    <span className="font-black text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>₹{service.price}</span>
                  </div>
                  {selectedService?.id === service.id && (
                    <div className="mt-4 text-right">
                      <Check className="inline text-[#D4AF37] w-5 h-5"/>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Booking Stepper */}
        {selectedService && (
          <div className="bg-white border-t border-b border-[#D4AF37]/20 py-12 mt-8">
            <div className="max-w-3xl mx-auto px-6">
              <div className="flex justify-between mb-10 text-xs font-black uppercase text-muted-foreground">
                <div className={bookingStep >= 1 ? "text-[#D4AF37]" : ""}>Step 1: Treatment</div>
                <div className={bookingStep >= 2 ? "text-[#D4AF37]" : ""}>Step 2: Therapist</div>
                <div className={bookingStep >= 3 ? "text-[#D4AF37]" : ""}>Step 3: Date & Time</div>
                <div className={bookingStep >= 4 ? "text-[#D4AF37]" : ""}>Step 4: Details</div>
              </div>
              {renderStepContent()}
            </div>
          </div>
        )}
        
        {/* Spa Amenities */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black" style={{ fontFamily: "'Playfair Display', serif" }}>The Spa Experience</h2>
            <div className="w-20 h-0.5 bg-[#D4AF37] mx-auto mt-2"/>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6"><Droplets className="mx-auto w-12 h-12 text-[#D4AF37] mb-3"/><p className="font-bold">Aromatherapy</p></div>
            <div className="text-center p-6"><Massage className="mx-auto w-12 h-12 text-[#D4AF37] mb-3"/><p className="font-bold">Deep Tissue</p></div>
            <div className="text-center p-6"><Leaf className="mx-auto w-12 h-12 text-[#D4AF37] mb-3"/><p className="font-bold">Organic Products</p></div>
            <div className="text-center p-6"><Wind className="mx-auto w-12 h-12 text-[#D4AF37] mb-3"/><p className="font-bold">Steam & Sauna</p></div>
          </div>
        </div>
        
        {/* Testimonial */}
        <div className="bg-[#1A1A1A] text-white py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Quote className="w-12 h-12 text-[#D4AF37] mx-auto mb-6"/>
            <p className="text-2xl md:text-3xl font-serif italic">"The most relaxing spa experience I've ever had. The therapists are truly experts and the ambiance is heavenly."</p>
            <p className="mt-6 font-bold">— Priya Sharma</p>
            <div className="flex justify-center gap-1 mt-4">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]"/>)}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-black text-white/70 py-12 px-6 text-center text-xs">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6">
            <div>
              <Flower2 className="text-[#D4AF37] mb-2 mx-auto"/>
              <p className="font-bold">KOVAIS SPA & WELLNESS</p>
              <p>097, SH 15, Gobichettipalayam, Tamil Nadu</p>
            </div>
            <div>
              <p>© 2025 KOVAIS SPA. All Rights Reserved.</p>
              <p>Contact: 9234567891 | info@kovaisspa.com</p>
            </div>
          </div>
        </footer>
      </main>
      
      {/* Info Dialog */}
      <Dialog open={showInfo} onClose={() => setShowInfo(false)}>
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black">Book Your Spa Experience</h3>
            <button onClick={() => setShowInfo(false)}><X/></button>
          </div>
          <p className="mb-6">Select your preferred category (Women/Men/Couples), choose a treatment, and follow the booking steps. Our expert therapists await to pamper you!</p>
          <Button onClick={() => setShowInfo(false)} className="w-full">Begin Your Journey</Button>
        </div>
      </Dialog>
      
      <style>{`
        @keyframes fadeSlide { 
          0% { opacity: 0; transform: translateY(20px); } 
          100% { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade { animation: fadeSlide 0.8s ease-out; }
      `}</style>
    </div>
  );
}