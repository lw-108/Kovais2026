import React, { useState, useEffect } from "react";
import { 
  Star, 
  Scissors, 
  Clock, 
  Home, 
  Building, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  X,
  Award,
  Users,
  Quote
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

// UI Components
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

// Main Component
export default function LuxuryBarber() {
  // --- State Management ---
  const [serviceType, setServiceType] = useState<"salon" | "doorstep">("salon");
  const [selectedGender, setSelectedGender] = useState<"man" | "woman" | "kids" | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({ name: "", phone: "", address: "", extraNote: "" });
  const [showLogin, setShowLogin] = useState(false);
  
  // Carousel
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselImages = [
    "https://images.unsplash.com/photo-1503951914875-3c0c13e4d5f6?w=1200&auto=format",
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1200&auto=format",
    "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&auto=format"
  ];
  const carouselTitles = [
    "Where Tradition Meets Innovation",
    "Luxury Redefined",
    "Crafting Confidence Since 1995"
  ];
  const carouselSubtitles = [
    "Step into our sanctuary of style where classic techniques meet modern luxury. Transform your look, elevate your confidence.",
    "Experience the finest in traditional barbering with modern techniques. Our master barbers deliver precision cuts and luxurious grooming services.",
    "Every cut is a masterpiece. Our skilled barbers combine decades of experience with contemporary styling to create your perfect look."
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
    man: [
      { id: "classic", name: "Classic Gentleman HairCut", desc: "Traditional scissor cut with styling", duration: "45 min", price: 45, category: "Men" },
      { id: "color", name: "Hair Color", desc: "Professional hair coloring for men — cover grays, refresh your look with natural, lasting results.", duration: "30 min", price: 35, category: "Men" },
      { id: "shave", name: "Shave & Beard Trim", desc: "Precision shave and beard trim for men — clean lines, sharp style, and expert grooming tailored to your look.", duration: "60 min", price: 55, category: "Men" }
    ],
    woman: [
      { id: "signature", name: "Signature Cut & Style", desc: "Precision cut with professional blow-dry", duration: "75 min", price: 75, category: "Women" },
      { id: "colorW", name: "Color Treatment", desc: "Full color service with conditioning", duration: "180 min", price: 120, category: "Women" },
      { id: "bridal", name: "Bridal Package", desc: "Complete wedding day styling", duration: "240 min", price: 200, category: "Women" }
    ],
    kids: [
      { id: "kidscut", name: "Kids Haircut & Style", desc: "Special experience for little ones", duration: "30 min", price: 25, category: "Kids" }
    ]
  };
  
  const specialists: Specialist[] = [
    { id: 1, name: "Marcus Johnson", role: "Master Barber", rating: 4.9, image: "https://randomuser.me/api/portraits/men/32.jpg", expertise: "man" },
    { id: 2, name: "David Chen", role: "Kids Specialist", rating: 4.7, image: "https://randomuser.me/api/portraits/men/45.jpg", expertise: "kids" },
    { id: 3, name: "Elena Rossi", role: "Color Expert", rating: 4.9, image: "https://randomuser.me/api/portraits/women/68.jpg", expertise: "woman" },
    { id: 4, name: "James Carter", role: "Master Barber", rating: 4.8, image: "https://randomuser.me/api/portraits/men/22.jpg", expertise: "man" }
  ];
  
  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];
  
  const handleGenderSelect = (gender: "man" | "woman" | "kids") => {
    setSelectedGender(gender);
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
    if (serviceType === "doorstep") setBookingStep(4);
    else handleFinalBooking();
  };
  
  const handleFinalBooking = () => {
    if (serviceType === "salon" && (!customerDetails.name || !customerDetails.phone)) {
      alert("Please provide your name and phone number");
      return;
    }
    if (serviceType === "doorstep" && (!customerDetails.name || !customerDetails.phone || !customerDetails.address)) {
      alert("Please provide full address for doorstep service");
      return;
    }
    const totalAmount = (selectedService?.price || 0) + (serviceType === "doorstep" ? 250 : 0);
    alert(`Booking Confirmed!\n\nService: ${selectedService?.name}\nDate: ${selectedDate ? format(selectedDate, "PPP") : ""} at ${selectedTime}\nSpecialist: ${selectedSpecialist?.name}\nTotal: ₹${totalAmount}\n${serviceType === "doorstep" ? "📍 Doorstep service to your address" : "🏢 Salon visit"}`);
    
    // Reset
    setBookingStep(1);
    setSelectedService(null);
    setSelectedSpecialist(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedGender(null);
    setCustomerDetails({ name: "", phone: "", address: "", extraNote: "" });
  };
  
  const getFilteredSpecialists = (): Specialist[] => {
    if (!selectedGender) return specialists;
    if (selectedGender === "kids") return specialists.filter(s => s.expertise === "kids");
    if (selectedGender === "woman") return specialists.filter(s => s.expertise === "woman");
    return specialists.filter(s => s.expertise === "man");
  };
  
  const doorstepFee = serviceType === "doorstep" ? 250 : 0;
  const totalPrice = selectedService ? selectedService.price + doorstepFee : 0;
  
  const renderStepContent = () => {
    if (bookingStep === 1 && selectedService) {
      return (
        <div className="space-y-6">
          <div className="border-l-4 border-[#D4AF37] pl-4 mb-4">
            <h4 className="font-black text-lg">Selected Service</h4>
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
          <h4 className="font-black text-lg">Choose Specialist</h4>
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
            <p className="font-bold text-sm mb-2">Available Times</p>
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
    if (bookingStep === 4 && serviceType === "doorstep") {
      return (
        <div className="space-y-5">
          <h4 className="font-black text-lg">Your Details for Doorstep Service</h4>
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
            placeholder="Complete Address (Street, Landmark, City)" 
            value={customerDetails.address} 
            onChange={e => setCustomerDetails({...customerDetails, address: e.target.value})} 
          />
          <input 
            className="w-full p-3 border border-gray-200 bg-white" 
            placeholder="Extra details / safety notes (optional)" 
            value={customerDetails.extraNote} 
            onChange={e => setCustomerDetails({...customerDetails, extraNote: e.target.value})} 
          />
          <Button onClick={handleFinalBooking} className="w-full bg-black hover:bg-gray-800 text-white">
            Confirm Booking · ₹{totalPrice}
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
          <Scissors className="text-[#D4AF37] w-6 h-6"/>
          <span className="font-black text-xl tracking-tighter" style={{ fontFamily: "'Playfair Display', serif" }}>BARBERCRAFT</span>
        </div>
        <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-wider">
          <a href="#">Home</a>
          <a href="#">Services</a>
          <a href="#">Portfolio</a>
          <a href="#">Contact</a>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowLogin(true)}>Book Now</Button>
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
        
        {/* Premium showcase */}
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8 text-center border-b border-[#D4AF37]/20">
          <div>
            <Award className="mx-auto w-10 h-10 text-[#D4AF37] mb-3"/>
            <div className="font-black text-2xl">4.9</div>
            <p className="text-xs uppercase">Rating</p>
          </div>
          <div>
            <Clock className="mx-auto w-10 h-10 text-[#D4AF37] mb-3"/>
            <div className="font-black text-2xl">25+</div>
            <p className="text-xs uppercase">Years</p>
          </div>
          <div>
            <Users className="mx-auto w-10 h-10 text-[#D4AF37] mb-3"/>
            <div className="font-black text-2xl">500+</div>
            <p className="text-xs uppercase">Happy Clients</p>
          </div>
        </div>
        
        {/* Elegant Switch & Service selection */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex justify-center mb-12">
            <div className="inline-flex border-2 border-[#D4AF37]/40 p-1 rounded-full bg-white shadow-lg">
              <button 
                onClick={() => setServiceType("salon")} 
                className={`px-8 py-3 rounded-full font-black uppercase text-xs tracking-wider transition-all ${serviceType === "salon" ? "bg-[#D4AF37] text-black" : "text-muted-foreground"}`}
              >
                <Building className="inline mr-2 w-4 h-4"/> Salon Service
              </button>
              <button 
                onClick={() => setServiceType("doorstep")} 
                className={`px-8 py-3 rounded-full font-black uppercase text-xs tracking-wider transition-all ${serviceType === "doorstep" ? "bg-[#D4AF37] text-black" : "text-muted-foreground"}`}
              >
                <Home className="inline mr-2 w-4 h-4"/> Doorstep Service {serviceType === "doorstep" && <span className="ml-1 text-[10px]">(+₹250)</span>}
              </button>
            </div>
          </div>
          
          {/* Gender Selection Buttons */}
          <div className="flex justify-center gap-6 mb-16">
            {[
              { key: "man", label: "👨 Man" },
              { key: "woman", label: "👩 Woman" },
              { key: "kids", label: "🧒 Kids" }
            ].map(g => (
              <button 
                key={g.key} 
                onClick={() => handleGenderSelect(g.key as "man" | "woman" | "kids")} 
                className={`px-8 py-3 font-black uppercase tracking-wider text-sm border-2 transition-all ${selectedGender === g.key ? "bg-[#D4AF37] text-black border-[#D4AF37]" : "bg-white text-black border-gray-300 hover:border-[#D4AF37]"}`}
              >
                {g.label}
              </button>
            ))}
          </div>
          
          {/* Service Cards Grid (reveal only if gender selected) */}
          {selectedGender && servicesMap[selectedGender] && (
            <div className="grid md:grid-cols-3 gap-8 mt-6">
              {servicesMap[selectedGender].map(service => (
                <div 
                  key={service.id} 
                  className={`bg-white border p-6 transition-all cursor-pointer hover:shadow-2xl ${selectedService?.id === service.id ? 'border-[#D4AF37] shadow-lg' : 'border-gray-200'}`} 
                  onClick={() => handleServiceSelect(service)}
                >
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
        
        {/* Booking Stepper Section - appears if service selected */}
        {selectedService && (
          <div className="bg-white border-t border-b border-[#D4AF37]/20 py-12 mt-8">
            <div className="max-w-3xl mx-auto px-6">
              <div className="flex justify-between mb-10 text-xs font-black uppercase text-muted-foreground">
                <div className={bookingStep >= 1 ? "text-[#D4AF37]" : ""}>Step 1: Service</div>
                <div className={bookingStep >= 2 ? "text-[#D4AF37]" : ""}>Step 2: Specialist</div>
                <div className={bookingStep >= 3 ? "text-[#D4AF37]" : ""}>Step 3: Date & Time</div>
                <div className={bookingStep >= 4 ? "text-[#D4AF37]" : ""}>Step 4: Details</div>
              </div>
              {renderStepContent()}
            </div>
          </div>
        )}
        
        {/* Portfolio Gallery */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black" style={{ fontFamily: "'Playfair Display', serif" }}>Our Portfolio</h2>
            <div className="w-20 h-0.5 bg-[#D4AF37] mx-auto mt-2"/>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Classic Cut", "Beard Styling", "Traditional Shave", "Modern Style"].map((item, idx) => (
              <div 
                key={idx} 
                className="aspect-square bg-cover bg-center relative group overflow-hidden border border-[#D4AF37]/20" 
                style={{backgroundImage: `url(https://source.unsplash.com/featured/?barber,${item})`}}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-end p-4">
                  <span className="text-white font-bold text-sm">{item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Testimonial */}
        <div className="bg-[#1A1A1A] text-white py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Quote className="w-12 h-12 text-[#D4AF37] mx-auto mb-6"/>
            <p className="text-2xl md:text-3xl font-serif italic">"Best grooming experience I've ever had. The attention to detail and atmosphere is unmatched."</p>
            <p className="mt-6 font-bold">— James Rodriguez</p>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-black text-white/70 py-12 px-6 text-center text-xs">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6">
            <div>
              <Scissors className="text-[#D4AF37] mb-2 mx-auto"/>
              <p className="font-bold">KOVAIS BEAUTY PARLOUR</p>
              <p>097, SH 15, Gobichettipalayam, Tamil Nadu</p>
            </div>
            <div>
              <p>© 2025 BARBERCRAFT. All Rights Reserved.</p>
              <p>Contact: 9234567891 | info@barbercraft.com</p>
            </div>
          </div>
        </footer>
      </main>
      
      {/* Booking modal dialog */}
      <Dialog open={showLogin} onClose={() => setShowLogin(false)}>
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black">Start Your Booking</h3>
            <button onClick={() => setShowLogin(false)}>
              <X/>
            </button>
          </div>
          <p className="mb-6">Please select service & gender above, then proceed with booking flow directly on page. Our smart booking panel is ready for you!</p>
          <Button onClick={() => setShowLogin(false)} className="w-full">Got it</Button>
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