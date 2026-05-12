"use client";
import { useState, useEffect } from "react";
import { 
  Star, 
  Clock, 
  MapPin, 
  Home, 
  User, 
  ArrowRight,
  Phone,
  Zap,
  Check,
  Lock,
  Calendar as CalendarIcon,
  Camera,
  Mail,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";



import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { LazyImage } from "@/components/ui/lazy-image";

import { userService, bookingService } from "@/lib/data-service";

// --- Data ---
const SERVICES = [
  { id: 'm1', category: 'Men', name: 'Classic Gentleman HairCut', description: 'Traditional scissor cut with styling', price: 45, image: 'https://images.unsplash.com/photo-1599351431613-18ef1fdd27e1?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', duration: '45 min' },
  { id: 'm2', category: 'Men', name: 'Hair Color', description: 'Professional hair coloring for men', price: 35, image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80', duration: '30 min' },
  { id: 'm3', category: 'Men', name: 'Shave & Beard Trim', description: 'Precision shave and expert grooming', price: 55, image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80', duration: '60 min' },
  { id: 'w1', category: 'Women', name: 'Signature Cut & Style', description: 'Precision cut with professional blow-dry', price: 75, image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80', duration: '90 min' },
  { id: 'w2', category: 'Women', name: 'Color Treatment', description: 'Full color service with conditioning', price: 120, image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80', duration: '180 min' },
  { id: 'w3', category: 'Women', name: 'Bridal Package', description: 'Complete wedding day styling', price: 200, image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80', duration: '240 min' },
  { id: 'k1', category: 'Kids', name: 'Kids Haircut & Style', description: 'Special experience for little ones', price: 25, image: 'https://images.unsplash.com/photo-1524503033411-c9566986fc8f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', duration: '30 min' },
];

const EMPLOYEES = [
  { id: 'emp1', name: 'Marcus Johnson', speciality: 'Master Barber', rating: 4.9, categories: ['Men'] },
  { id: 'emp2', name: 'Sofia Martinez', speciality: 'Hair Stylist', rating: 4.8, categories: ['Women'] },
  { id: 'emp3', name: 'David Chen', speciality: 'Kids Specialist', rating: 4.7, categories: ['Kids', 'Men'] },
  { id: 'emp4', name: 'Isabella', speciality: 'Senior Stylist', rating: 4.9, categories: ['Women'] }
];

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM',
];

const GALLERY = [
  { id: 1, image: "https://images.unsplash.com/photo-1599351431613-18ef1fdd27e1?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", category: "haircuts", title: "Classic Cut" },
  { id: 2, image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80", category: "beards", title: "Beard Styling" },
  { id: 3, image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80", category: "shaves", title: "Traditional Shave" },
  { id: 4, image: "https://images.unsplash.com/photo-1618049049816-43a00d5b0c3d?q=80&w=680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", category: "haircuts", title: "Modern Style" },
];



export default function LuxuryBarber() {

  const [selectedLocation, setSelectedLocation] = useState<"salon" | "doorstep">("salon");
  const [selectedCategory, setSelectedCategory] = useState<string>("Men");
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [showLogin, setShowLogin] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  const HERO_IMAGES = [
    "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1599351431613-18ef1fdd27e1?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const [user, setUser] = useState<any>(null);
  const [points, setPoints] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const [payType, setPayType] = useState<"online" | "offline">("offline");
  const [usedPoints, setUsedPoints] = useState(0);
  const [pointsInput, setPointsInput] = useState("");

  const serviceTotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const doorstepCharge = selectedLocation === "doorstep" ? 250 : 0;
  const baseTotal = serviceTotal + doorstepCharge;
  const discount = usedPoints * 0.10;
  const finalTotal = Math.max(0, baseTotal - discount);

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u && u.user_id) {
          setUser(u);
          setPoints(userService.getPoints(u.user_id));
        }
      } catch (e) {}
    }
  }, []);

  const handleServiceToggle = (service: any) => {
    if (selectedServices.find(s => s.id === service.id)) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleBookingClick = () => {
    if (selectedServices.length === 0) {
      Swal.fire({ icon: 'error', title: 'Selection Required', text: "Please select at least one service" });
      return;
    }
    if (!selectedEmployee) {
      Swal.fire({ icon: 'error', title: 'Specialist Required', text: "Please select a specialist" });
      return;
    }
    if (!selectedDate || !selectedTime) {
      Swal.fire({ icon: 'error', title: 'Time Required', text: "Please select date and time" });
      return;
    }
    if (!user) {
      setShowLogin(true);
    } else {
      setShowBookingModal(true);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const u = await userService.login(loginData.username, loginData.password);
      setUser(u);
      setPoints(u.points);
      setShowLogin(false);
      setShowBookingModal(true);
      Swal.fire({ icon: 'success', title: 'Welcome back!', text: "Login successful" });
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Login Failed', text: "Invalid credentials" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      await userService.signup(loginData.username, loginData.phone, loginData.password);
      setIsNewUser(false);
      Swal.fire({ icon: 'success', title: 'Account Created', text: "Please login with your new credentials" });
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error', text: "Signup failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPoints = () => {
    const pts = parseInt(pointsInput);
    if (isNaN(pts) || pts <= 0) return;
    if (pts > points) {
      Swal.fire({ icon: 'error', title: 'Insufficient Points', text: "You don't have enough points" });
      return;
    }
    if (pts * 0.10 > baseTotal) {
      Swal.fire({ icon: 'error', title: 'Limit Exceeded', text: "Discount cannot exceed total amount" });
      return;
    }
    setUsedPoints(pts);
    Swal.fire({ icon: 'success', title: 'Applied', text: `₹${(pts * 0.1).toFixed(2)} discount applied!` });
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      await bookingService.createBarberBooking({
        user_id: user.user_id,
        services: selectedServices.map(s => s.name).join(", "),
        location: selectedLocation,
        employee_id: selectedEmployee.id,
        date: format(selectedDate!, "yyyy-MM-dd"),
        time: selectedTime!,
        total_amount: finalTotal,
        payment_type: payType,
        points_used: usedPoints
      });

      if (usedPoints > 0) {
        const newPoints = points - usedPoints;
        userService.updatePoints(user.user_id, newPoints);
        setPoints(newPoints);
      }

      setShowBookingModal(false);
      Swal.fire({ icon: 'success', title: 'Ritual Confirmed', text: "Your grooming session has been scheduled." });
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error', text: "Booking failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = SERVICES.filter(s => s.category === selectedCategory);
  const availableEmployees = EMPLOYEES.filter(e => e.categories.includes(selectedCategory));

  return (
    <div className="min-h-screen bg-transparent">
      <Header />

      <main className="pb-24 max-w-7xl mx-auto space-y-20 px-6 md:px-12">
        {/* Hero Section with Dynamic Carousel (Desktop Only) */}
        <section className="relative -mx-6 md:-mx-12 md:h-[80vh] flex flex-col justify-center md:justify-end px-6 md:px-12 pt-10 md:pt-0 pb-10 md:pb-20 overflow-hidden group">
          {/* Background Carousel - Hidden on Mobile */}
          <div className="absolute inset-0 z-0 hidden md:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={heroImageIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <img 
                  src={HERO_IMAGES[heroImageIndex]} 
                  alt="Barber Background" 
                  className="size-full object-cover" 
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Immersive Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-black/40 z-10" />
          </div>

          <div className="relative z-20 space-y-6 max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-[#D4AF37] font-black tracking-[0.3em] text-[10px] uppercase md:bg-black/40 md:backdrop-blur-md md:px-4 md:py-2 w-fit border-l-2 border-[#D4AF37]"
            >
              EST. 1995 - MASTER CRAFTSMANSHIP
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter serif leading-[0.85] text-foreground md:text-white drop-shadow-2xl"
            >
              Luxury <span className="text-[#D4AF37] italic">Barbering</span> <br />
              <span className="md:text-white">&</span> Personal <span className="text-[#D4AF37] italic">Grooming</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground md:text-white/80 font-medium text-base md:text-xl max-w-2xl leading-relaxed drop-shadow-lg"
            >
              Experience the finest in traditional barbering with modern techniques. 
              Transform your look in our sanctuary of style.
            </motion.p>
          </div>

          {/* Carousel Progress Indicators - Hidden on Mobile */}
          <div className="absolute bottom-10 right-12 z-30 hidden md:flex gap-2">
            {HERO_IMAGES.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 transition-all duration-500 ${i === heroImageIndex ? 'w-12 bg-[#D4AF37]' : 'w-4 bg-white/20'}`} 
              />
            ))}
          </div>
        </section>

        {/* Ritual Selection Bar */}
        <div className="space-y-1">
          <div className="p-2 bg-card/40 backdrop-blur-xl border border-border/10 shadow-2xl relative">
            <div className="absolute top-0 left-0 size-4 border-t border-l border-[#D4AF37]/40" />
            <div className="absolute bottom-0 right-0 size-4 border-b border-r border-[#D4AF37]/40" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Ritual Type</label>
                <div className="grid grid-cols-2 gap-1 p-1 bg-background border border-border/10">
                  <button 
                    onClick={() => setSelectedLocation("salon")}
                    className={`flex items-center justify-center gap-2 h-10 text-[10px] font-black uppercase transition-all ${selectedLocation === 'salon' ? 'bg-[#D4AF37] text-white' : 'hover:bg-[#D4AF37]/5 text-muted-foreground'}`}
                  >
                    <MapPin className="size-3" /> Salon
                  </button>
                  <button 
                    onClick={() => setSelectedLocation("doorstep")}
                    className={`flex items-center justify-center gap-2 h-10 text-[10px] font-black uppercase transition-all ${selectedLocation === 'doorstep' ? 'bg-[#D4AF37] text-white' : 'hover:bg-[#D4AF37]/5 text-muted-foreground'}`}
                  >
                    <Home className="size-3" /> Home
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Category</label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-background border border-border/10">
                  {['Men', 'Women', 'Kids'].map(cat => (
                    <button 
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSelectedServices([]);
                        setSelectedEmployee(null);
                      }}
                      className={`h-10 text-[10px] font-black uppercase transition-all ${selectedCategory === cat ? 'bg-[#D4AF37] text-white' : 'hover:bg-[#D4AF37]/5 text-muted-foreground'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Schedule</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-bold rounded-none border-border/10 h-12">
                      <CalendarIcon className="mr-2 h-4 w-4 text-[#D4AF37]" />
                      {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-none border-[#D4AF37]/20" align="start">
                    <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus className="rounded-none" />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Specialist</label>
                <div className="flex items-center gap-2 p-3 bg-background border border-border/10 h-12 font-bold text-sm">
                  <User className="size-4 text-[#D4AF37]" />
                  {selectedEmployee ? selectedEmployee.name : "Choose after services"}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Banner */}
          <AnimatePresence>
            {selectedServices.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-[#D4AF37] text-stone-950 px-8 py-3 flex items-center justify-between font-black uppercase tracking-[0.1em] text-[11px]">
                  <div className="flex items-center gap-6">
                    <span>{selectedServices.length} Rituals Selected</span>
                    {selectedLocation === 'doorstep' && <span className="bg-black/10 px-3 py-1">+ ₹250 Convenience Fee</span>}
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="text-lg">Total Ritual Value: <span className="text-stone-950 ml-2 font-black">₹{finalTotal.toLocaleString()}</span></span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Services & Booking Grid */}
        <div className="grid lg:grid-cols-2 gap-1 px-1 bg-[#D4AF37]/10 border border-[#D4AF37]/20">
          {/* Left: Service Menu */}
          <div className="p-6 bg-background space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black serif uppercase tracking-tight">Ritual Menu</h2>
              <Badge variant="outline" className="border-[#D4AF37]/30 text-[#D4AF37] rounded-none">{selectedCategory}</Badge>
            </div>
            
            <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar h-auto">
              {filteredServices.map((service) => {
                const isSelected = selectedServices.find(s => s.id === service.id);
                return (
                  <motion.div 
                    key={service.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => handleServiceToggle(service)}
                    className={`group p-4 border transition-all cursor-pointer flex items-center gap-4 ${isSelected ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-border/10 hover:border-[#D4AF37]/30 bg-muted/20'}`}
                  >
                    <div className="size-20 overflow-hidden border border-border/10 shrink-0">
                      <LazyImage src={service.image} alt={service.name} className="size-full transition-transform group-hover:scale-110" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-sm uppercase">{service.name}</h4>
                        <span className="font-black text-[#D4AF37]">₹{service.price}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-medium">{service.description}</p>
                      <div className="flex items-center gap-3 text-[10px] font-black uppercase text-[#D4AF37]/60">
                        <Clock className="size-3" /> {service.duration}
                      </div>
                    </div>
                    <div className={`size-5 border flex items-center justify-center transition-all ${isSelected ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-border/20 group-hover:border-[#D4AF37]/50'}`}>
                      {isSelected && <Check className="size-3 text-white" />}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: Specialists & Finalize */}
          <div className="p-8 md:p-12 bg-background flex flex-col justify-between">
            <div className="space-y-10">
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#D4AF37]">1. Select Specialist</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {availableEmployees.map((emp) => (
                    <button 
                      key={emp.id}
                      onClick={() => setSelectedEmployee(emp)}
                      className={`p-5 md:p-6 border transition-all flex items-center gap-5 ${selectedEmployee?.id === emp.id ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-lg shadow-[#D4AF37]/5' : 'border-border/10 hover:border-[#D4AF37]/30 bg-muted/5'}`}
                    >
                      <div className="size-12 md:size-14 shrink-0 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                        <User className="size-6 text-[#D4AF37]" />
                      </div>
                      <div className="text-left min-w-0 flex-1 space-y-1">
                        <div className="font-black text-xs md:text-sm uppercase tracking-tight truncate">{emp.name}</div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-[#D4AF37]">
                          <div className="flex items-center gap-0.5">
                            <Star className="size-2.5 fill-[#D4AF37]" />
                            <Star className="size-2.5 fill-[#D4AF37]" />
                            <Star className="size-2.5 fill-[#D4AF37]" />
                            <Star className="size-2.5 fill-[#D4AF37]" />
                            <Star className="size-2.5 fill-[#D4AF37]" />
                          </div>
                          <span>{emp.rating}</span>
                        </div>
                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{emp.speciality}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#D4AF37]">2. Select Time</h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {TIME_SLOTS.map((time) => (
                    <button 
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`h-10 text-[10px] font-black border transition-all ${selectedTime === time ? 'bg-black text-white border-black' : 'border-border/10 hover:border-[#D4AF37]/50 text-muted-foreground'}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-10 border-t border-border/10">
                <Button 
                  className="w-full h-14 rounded-none bg-[#D4AF37] hover:bg-[#B8962E] text-white font-black uppercase tracking-widest text-[11px]"
                  onClick={handleBookingClick}
                >
                  Schedule Ritual <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Preview */}
        <section className="space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Camera className="size-6 text-[#D4AF37]" />
              <h3 className="text-3xl font-black tracking-tight serif uppercase">The Artistry</h3>
            </div>
            <Button variant="link" className="text-[#D4AF37] font-black uppercase tracking-widest text-[10px]">View All Work</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {GALLERY.map((item, i) => (
              <motion.div 
                key={item.id}
                whileHover={{ y: -5 }}
                onClick={() => { setGalleryIndex(i); setShowGalleryModal(true); }}
                className="aspect-[4/5] bg-card border border-border/10 overflow-hidden group cursor-pointer relative"
              >
                                <LazyImage src={item.image} alt={item.title} className="size-full transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-[10px] font-black uppercase text-[#D4AF37] mb-2">{item.category}</span>
                  <h4 className="text-white font-black uppercase tracking-tight">{item.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Map & Contact */}
        <div className="relative h-[500px] border border-[#D4AF37]/20 group overflow-hidden">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d18554.56633963675!2d77.502998!3d11.442899!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba93fe75defff09%3A0x57385b9e1e3130cf!2sKOVAIS%20LODGE%20A%2Fc%20Rooms!5e1!3m2!1sen!2sus!4v1778110263590!5m2!1sen!2sus" 
            width="100%" 
            height="100%" 
            style={{ border:0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            className="grayscale group-hover:grayscale-0 transition-all duration-1000"
          ></iframe>
          <div className="absolute bottom-6 left-6 right-6 p-10 bg-black/80 backdrop-blur-xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 group-hover:border-[#D4AF37]/30 transition-all">
            <div className="space-y-4 flex-1">
              <h5 className="text-2xl font-black tracking-tight text-[#D4AF37] serif">Kovais Master Barber</h5>
              <p className="text-white/60 text-xs font-medium leading-relaxed max-w-sm">
                097, SH 15, Otthekkuthirai, Gobichettipalayam, Tamil Nadu 638455
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex items-center gap-4 text-white">
                <Phone className="size-4 text-[#D4AF37]" />
                <span className="text-sm font-bold tracking-tight">9234567891</span>
              </div>
              <div className="flex items-center gap-4 text-white">
                <Mail className="size-4 text-[#D4AF37]" />
                <span className="text-sm font-bold tracking-tight">grooming@kovais.com</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* --- Login Modal --- */}
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="max-w-md p-8 bg-background border border-[#D4AF37]/20 rounded-none shadow-2xl">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-black tracking-tight serif uppercase">Gentleman's Entrance</h2>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-2">
                {isNewUser ? "Join the inner circle" : "Identify yourself"}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#D4AF37]" />
                <input className="w-full h-12 pl-10 pr-4 bg-background border border-border/10 rounded-none focus:outline-none focus:border-[#D4AF37] text-foreground" placeholder="Username" value={loginData.username} onChange={e => setLoginData({...loginData, username: e.target.value})} />
              </div>
              {isNewUser && (
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#D4AF37]" />
                  <input className="w-full h-12 pl-10 pr-4 bg-background border border-border/10 rounded-none focus:outline-none focus:border-[#D4AF37] text-foreground" placeholder="Phone Number" value={loginData.phone} onChange={e => setLoginData({...loginData, phone: e.target.value})} />
                </div>
              )}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#D4AF37]" />
                <input type="password" className="w-full h-12 pl-10 pr-4 bg-background border border-border/10 rounded-none focus:outline-none focus:border-[#D4AF37] text-foreground" placeholder="Password" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} />
              </div>
              
              <Button className="w-full h-12 bg-[#D4AF37] hover:bg-[#B8962E] text-white font-black uppercase tracking-widest text-[10px]" onClick={isNewUser ? handleSignup : handleLogin} disabled={loading}>
                {loading ? "Processing..." : isNewUser ? "Create Profile" : "Authenticate"}
              </Button>

              <div className="text-center">
                <button className="text-[10px] font-black uppercase text-[#D4AF37] hover:underline" onClick={() => setIsNewUser(!isNewUser)}>
                  {isNewUser ? "Already a member? Login" : "New here? Register ritual"}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- Booking Modal --- */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="max-w-6xl p-0 bg-background border border-[#D4AF37]/20 rounded-none shadow-2xl overflow-visible">
          <div className="p-8 bg-background border-b border-[#D4AF37]/10">
            <div className="flex items-center gap-3">
              <Zap className="size-5 text-[#D4AF37]" />
              <h2 className="text-2xl font-black tracking-tight serif uppercase">Confirm Grooming Ritual</h2>
            </div>
          </div>
          
          <div className="p-8 max-h-[85vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Column 1: Summary & Services */}
              <div className="space-y-6">
                <div className="p-6 bg-background border border-border/10 space-y-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-2">Selected Rituals</div>
                  {selectedServices.map(s => (
                    <div key={s.id} className="flex justify-between items-center border-b border-border/5 pb-2 last:border-0 last:pb-0">
                      <div className="font-black text-[10px] uppercase">{s.name}</div>
                      <div className="font-black text-sm serif">₹{s.price}</div>
                    </div>
                  ))}
                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase">
                      <CalendarIcon className="size-3" /> {format(selectedDate || new Date(), "EEE, dd MMM")} · {selectedTime}
                    </div>
                    <div className="text-xl font-black serif">₹{finalTotal.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Column 2: Rewards Section */}
              <div className="space-y-6">
                <div className="p-6 bg-[#D4AF37]/5 border border-[#D4AF37]/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="size-4 text-[#D4AF37] fill-[#D4AF37]" />
                      <span className="text-xs font-black uppercase tracking-tight">Apply Rewards</span>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground">{points} pts available</span>
                  </div>
                  <div className="space-y-4">
                    <input className="w-full h-12 px-4 bg-background border border-border/20 rounded-none focus:outline-none focus:border-[#D4AF37] text-foreground" placeholder="Enter points" value={pointsInput} onChange={e => setPointsInput(e.target.value)} />
                    <Button className="w-full h-12 bg-[#D4AF37] hover:bg-[#B8962E] text-white rounded-none font-black text-[10px] uppercase" onClick={handleApplyPoints}>Apply Points</Button>
                  </div>
                  {usedPoints > 0 && <div className="text-[10px] font-bold text-green-600 flex items-center gap-2"><Check className="size-3" /> ₹{discount.toFixed(2)} discount applied</div>}
                </div>
              </div>

              {/* Column 3: Payment Ritual */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Payment Ritual</label>
                  <div className="grid grid-cols-1 gap-4">
                    <div className={`p-4 border cursor-pointer flex items-center gap-4 transition-all rounded-none ${payType === 'offline' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'bg-background border-border/10'}`} onClick={() => setPayType('offline')}>
                      <Clock className="size-6 text-[#D4AF37]" />
                      <div>
                        <div className="font-black text-xs uppercase">At Salon</div>
                        <div className="text-[9px] font-bold opacity-60">Pay after transformation</div>
                      </div>
                    </div>
                    <div className={`p-4 border cursor-pointer flex items-center gap-4 transition-all rounded-none ${payType === 'online' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'bg-background border-border/10'}`} onClick={() => setPayType('online')}>
                      <Zap className="size-6 text-[#D4AF37]" />
                      <div>
                        <div className="font-black text-xs uppercase">Pay Now</div>
                        <div className="text-[9px] font-bold opacity-60">Priority confirmation</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-background border-t border-border/10">
            <Button className="w-full h-14 bg-[#D4AF37] hover:bg-[#B8962E] text-white font-black uppercase tracking-widest text-[11px]" onClick={handleConfirmBooking} disabled={loading}>
              {loading ? "Registering Ritual..." : `Confirm Ritual · ₹${finalTotal.toLocaleString()}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Gallery Modal */}
      <Dialog open={showGalleryModal} onOpenChange={setShowGalleryModal}>
        <DialogContent className="max-w-4xl p-0 bg-black border-none overflow-hidden rounded-none">
          <div className="relative aspect-[4/5] md:aspect-video flex items-center justify-center">
            <LazyImage src={GALLERY[galleryIndex].image} alt="Gallery Work" className="size-full" />
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white hover:bg-white/10" onClick={() => setShowGalleryModal(false)}>
              <X className="size-6" />
            </Button>
            <Button variant="ghost" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10" onClick={() => setGalleryIndex((i) => (i === 0 ? GALLERY.length - 1 : i - 1))}>
              <ChevronLeft className="size-8" />
            </Button>
            <Button variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10" onClick={() => setGalleryIndex((i) => (i === GALLERY.length - 1 ? 0 : i + 1))}>
              <ChevronRight className="size-8" />
            </Button>
          </div>
          <div className="p-6 bg-black/90 backdrop-blur-md text-white border-t border-white/10">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-widest">{GALLERY[galleryIndex].category}</span>
                <h3 className="text-xl font-black serif uppercase tracking-tight">{GALLERY[galleryIndex].title}</h3>
              </div>
              <div className="text-[10px] font-black uppercase opacity-60">{galleryIndex + 1} / {GALLERY.length}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}