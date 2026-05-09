"use client";
import { useState, useEffect } from "react";
import { 
  Star, 
  Clock, 
  MapPin, 
  Home, 
  User, 
  Calendar as CalendarIcon, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Camera,
  X,
  Phone,
  Mail,
  Zap,
  Check,
  Lock,
  Award,
  Sparkles,
  CheckCircle,
  Scissors
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import Swal from "sweetalert2";
import { useInView } from 'react-intersection-observer';

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { LazyImage } from "@/components/ui/lazy-image";

import { userService, bookingService } from "@/lib/data-service";



// --- Essential Data (From Legacy) ---
const SERVICES = [
  { 
    id: 'f1', 
    category: 'Function', 
    name: 'Function Grooming Service', 
    description: 'Complete grooming package for weddings, parties, and special events, ear to toe styling', 
    price: 500, 
    image: 'https://images.pexels.com/photos/13918932/pexels-photo-13918932.jpeg', 
    duration: '60-90 min' 
  },
  { 
    id: 'f2', 
    category: 'Function', 
    name: 'Bridal Party Grooming', 
    description: 'Specialized grooming services for wedding parties and grooms', 
    price: 700, 
    image: 'https://images.pexels.com/photos/1270076/pexels-photo-1270076.jpeg', 
    duration: '90 min' 
  },
  { 
    id: 'f3', 
    category: 'Function', 
    name: 'Corporate Event Styling', 
    description: 'Professional styling for corporate events and business functions', 
    price: 600, 
    image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg', 
    duration: '60 min' 
  },
];

const EMPLOYEES = [
  { id: 'emp4', name: 'Isabella', speciality: 'Event & Function Specialist', rating: 4.9, categories: ['Function'] },
  { id: 'emp5', name: 'Sophia', speciality: 'Bridal Stylist', rating: 4.8, categories: ['Function'] }
];

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM',
];

const GALLERY = [
  { id: 1, image: "https://images.pexels.com/photos/1187765/pexels-photo-1187765.jpeg", category: "events", title: "Wedding Grooming" },
  { id: 2, image: "https://images.pexels.com/photos/1270076/pexels-photo-1270076.jpeg", category: "events", title: "Bridal Party" },
  { id: 3, image: "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg", category: "corporate", title: "Corporate Events" },
  { id: 4, image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg", category: "events", title: "Special Occasions" },
];

const HERO_SLIDES = [
  {
    image: "https://images.pexels.com/photos/1187765/pexels-photo-1187765.jpeg",
    title: "Function",
    titleHighlight: "Grooming",
    subtitle: "Making Every Event Memorable",
    desc: "Experience the finest grooming services for your special occasions. Our expert stylists deliver perfection for weddings, parties, and corporate events."
  },
  {
    image: "https://images.pexels.com/photos/1270076/pexels-photo-1270076.jpeg",
    title: "Event",
    titleHighlight: "Styling",
    subtitle: "Perfection for Your Special Day",
    desc: "Every event deserves perfect grooming. Our skilled stylists combine creativity with precision to ensure you look your best."
  }
];

const STATS = [
  { icon: Star, value: "4.9", label: "Rating" },
  { icon: Clock, value: "25+", label: "Years" },
  { icon: Award, value: "500+", label: "Happy Clients" },
];

import { useEffect } from "react";

export default function FunctionPage() {

  const [selectedLocation, setSelectedLocation] = useState<"salon" | "doorstep">("doorstep");
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

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
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
      Swal.fire({ icon: 'error', title: 'Specialist Required', text: "Please select an event specialist" });
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
      Swal.fire({ icon: 'success', title: 'Identity Verified', text: "Welcome to Kovais Function Grooming" });
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
      Swal.fire({ icon: 'success', title: 'Account Created', text: "Your event journey begins now" });
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error', text: "Account creation failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPoints = () => {
    const pts = parseInt(pointsInput);
    if (isNaN(pts) || pts <= 0) return;
    if (pts > points) {
      Swal.fire({ icon: 'error', title: 'Insufficient Points', text: "You don't have enough reward points" });
      return;
    }
    if (pts * 0.10 > baseTotal) {
      Swal.fire({ icon: 'error', title: 'Limit Exceeded', text: "Discount cannot exceed total amount" });
      return;
    }
    setUsedPoints(pts);
    Swal.fire({ icon: 'success', title: 'Applied', text: `₹${(pts * 0.1).toFixed(2)} savings applied!` });
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      await bookingService.createGenericBooking('function', {
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
      Swal.fire({ icon: 'success', title: 'Ritual Requested', text: "Our event coordinator will contact you shortly." });
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error', text: "Reservation request failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Header />

      <main className="pt-32 pb-24 space-y-24">
        {/* Animated Hero Section */}
        <section className="relative h-[80vh] md:h-[90vh] overflow-hidden mx-6">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentHeroSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <LazyImage src={HERO_SLIDES[currentHeroSlide].image} alt="Hero background" className="size-full brightness-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </motion.div>
          </AnimatePresence>

          <div className="relative h-full flex items-center justify-center text-center px-6">
            <div className="max-w-4xl space-y-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-3 text-[#D4AF37] font-bold tracking-[0.4em] text-[10px] uppercase"
              >
                <div className="size-1.5 bg-[#D4AF37]" />
                {HERO_SLIDES[currentHeroSlide].subtitle}
                <div className="size-1.5 bg-[#D4AF37]" />
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentHeroSlide}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-6xl md:text-9xl font-black tracking-tight serif text-white leading-[0.85] uppercase">
                    {HERO_SLIDES[currentHeroSlide].title} <br />
                    <span className="text-[#D4AF37] italic font-light">{HERO_SLIDES[currentHeroSlide].titleHighlight}</span>
                  </h1>
                  <p className="text-white/60 font-medium text-lg md:text-xl max-w-xl mx-auto mt-8">
                    {HERO_SLIDES[currentHeroSlide].desc}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex flex-wrap justify-center gap-12 pt-8">
                {STATS.map((stat, i) => (
                  <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-[#D4AF37] font-black text-2xl md:text-3xl">{stat.value}</div>
                    <div className="text-white/40 text-[10px] font-black uppercase tracking-widest">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4">
            {HERO_SLIDES.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentHeroSlide(i)}
                className={`h-1 transition-all duration-700 ${i === currentHeroSlide ? 'w-12 bg-[#D4AF37]' : 'w-4 bg-white/30'}`} 
              />
            ))}
          </div>
        </section>

        {/* Ritual Selection Bar */}
        <div className="max-w-7xl mx-auto px-6 space-y-1">
          <div className="p-2 bg-card/40 backdrop-blur-xl border border-border/10 shadow-2xl relative">
            <div className="absolute top-0 left-0 size-4 border-t border-l border-[#D4AF37]/40" />
            <div className="absolute bottom-0 right-0 size-4 border-b border-r border-[#D4AF37]/40" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Service Type</label>
                <div className="grid grid-cols-2 gap-1 p-1 bg-background border border-border/10">
                  <button 
                    onClick={() => setSelectedLocation("salon")}
                    className={`flex items-center justify-center gap-2 h-11 text-[10px] font-black uppercase transition-all ${selectedLocation === 'salon' ? 'bg-[#D4AF37] text-white' : 'hover:bg-[#D4AF37]/5 text-muted-foreground'}`}
                  >
                    <MapPin className="size-3" /> Salon
                  </button>
                  <button 
                    onClick={() => setSelectedLocation("doorstep")}
                    className={`flex items-center justify-center gap-2 h-11 text-[10px] font-black uppercase transition-all ${selectedLocation === 'doorstep' ? 'bg-[#D4AF37] text-white' : 'hover:bg-[#D4AF37]/5 text-muted-foreground'}`}
                  >
                    <Home className="size-3" /> Doorstep
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Celebration Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-bold rounded-none border-border/10 h-11 bg-background">
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
                <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Event Specialist</label>
                <div className="flex items-center gap-2 p-3 bg-background border border-border/10 h-11 font-bold text-sm">
                  <User className="size-4 text-[#D4AF37]" />
                  {selectedEmployee ? selectedEmployee.name : "Choose after services"}
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {selectedServices.length > 0 && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="bg-[#D4AF37] text-white px-8 py-3 flex items-center justify-between font-black uppercase tracking-widest text-[11px]">
                  <div className="flex items-center gap-6">
                    <span>{selectedServices.length} Package(s) Selected</span>
                    {selectedLocation === 'doorstep' && <span className="bg-black/20 px-3 py-1">+ ₹250 Doorstep Convenience</span>}
                  </div>
                  <span className="text-lg">Total Value: <span className="text-black ml-2">₹{finalTotal.toLocaleString()}</span></span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Services & Booking Grid */}
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-1 bg-[#D4AF37]/10 border border-[#D4AF37]/20" id="ritual-grid">
          {/* Left: Service Menu */}
          <div className="p-8 md:p-12 bg-background space-y-10">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-2 block">RITUAL MENU</span>
              <h2 className="text-3xl font-black serif uppercase tracking-tight">Function Packages</h2>
            </div>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              {SERVICES.map((service) => {
                const isSelected = selectedServices.find(s => s.id === service.id);
                return (
                  <motion.div 
                    key={service.id}
                    onClick={() => handleServiceToggle(service)}
                    className={`group p-6 border transition-all cursor-pointer flex items-center gap-6 ${isSelected ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-border/10 hover:border-[#D4AF37]/30 bg-muted/5'}`}
                  >
                    <div className="size-24 overflow-hidden border border-border/10 shrink-0">
                      <LazyImage src={service.image} alt={service.name} className="size-full transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-lg uppercase tracking-tight">{service.name}</h4>
                        <span className="font-black text-[#D4AF37]">₹{service.price}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">{service.description}</p>
                      <div className="flex items-center gap-4 text-[10px] font-black uppercase text-[#D4AF37]/60">
                        <span className="flex items-center gap-1"><Clock className="size-3" /> {service.duration}</span>
                        <span className="flex items-center gap-1"><Sparkles className="size-3" /> Premium Styling</span>
                      </div>
                    </div>
                    <div className={`size-6 border flex items-center justify-center transition-all ${isSelected ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-border/20 group-hover:border-[#D4AF37]/50'}`}>
                      {isSelected && <Check className="size-4 text-white" />}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: Specialists & Finalize */}
          <div className="p-8 md:p-16 bg-background flex flex-col justify-between border-l border-[#D4AF37]/10">
            <div className="space-y-12">
              <div className="space-y-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">I. Choose Specialist</h3>
                <div className="grid grid-cols-1 gap-4">
                  {EMPLOYEES.map((emp) => (
                    <button 
                      key={emp.id}
                      onClick={() => setSelectedEmployee(emp)}
                      className={`p-5 border transition-all flex items-center justify-between ${selectedEmployee?.id === emp.id ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'bg-background border-border/10 hover:border-[#D4AF37]/30'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                          <User className="size-6 text-[#D4AF37]" />
                        </div>
                        <div className="text-left">
                          <div className="font-black text-xs uppercase tracking-tight">{emp.name}</div>
                          <div className="text-[9px] font-bold text-muted-foreground uppercase">{emp.speciality}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-black text-[#D4AF37]">
                        <Star className="size-3 fill-[#D4AF37]" /> {emp.rating}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">II. Choose Time</h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {TIME_SLOTS.map((time) => (
                    <button 
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`h-11 text-[10px] font-black border transition-all ${selectedTime === time ? 'bg-black text-white border-black' : 'bg-background border-border/10 hover:border-[#D4AF37]/50 text-muted-foreground'}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-12 border-t border-[#D4AF37]/20">
                <div className="flex justify-between items-end mb-8">
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Ritual Value</div>
                    <div className="text-4xl font-black serif">₹{finalTotal.toLocaleString()}</div>
                  </div>
                </div>
                <Button 
                  className="w-full h-16 rounded-none bg-[#D4AF37] hover:bg-[#B8962E] text-white font-black uppercase tracking-widest text-[11px]"
                  onClick={handleBookingClick}
                >
                  Schedule Ritual <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Preview */}
        <section className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="flex items-center justify-between border-b border-[#D4AF37]/10 pb-8">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">THE ARTISTRY</span>
              <h2 className="text-4xl font-black serif uppercase tracking-tight">Event Showreel</h2>
            </div>
            <Button variant="outline" className="rounded-none border-[#D4AF37]/20 text-[#D4AF37] font-black uppercase tracking-widest text-[10px] px-8 h-12">View Portfolio</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {GALLERY.map((item, i) => (
              <motion.div 
                key={item.id}
                whileHover={{ y: -5 }}
                onClick={() => { setGalleryIndex(i); setShowGalleryModal(true); }}
                className="aspect-[4/5] bg-card border border-border/10 overflow-hidden group cursor-pointer relative"
              >
                <LazyImage src={item.image} alt={item.title} className="size-full transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] mb-3">{item.category}</span>
                  <h4 className="text-white font-black uppercase tracking-tight text-lg">{item.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Map Section (Updated with Legacy Iframe) */}
        <div className="relative h-[600px] border-y border-[#D4AF37]/10 mx-6 overflow-hidden group">
          <iframe 
            src="https://www.google.com/maps?q=097,+SH+15,+Otthakkuthirai,+Gobichettipalayam,+Tamil+Nadu+638455,+India&output=embed"
            width="100%" 
            height="100%" 
            style={{ border:0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            className="grayscale group-hover:grayscale-0 transition-all duration-1000"
            title="KOVAIS BEAUTY PARLOUR Location"
          />
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6">
            <div className="p-12 bg-black/90 backdrop-blur-2xl border border-[#D4AF37]/20 flex flex-col md:flex-row items-center justify-between gap-12 group-hover:border-[#D4AF37]/50 transition-all">
              <div className="space-y-4 flex-1 text-center md:text-left">
                <h5 className="text-3xl font-black tracking-tight text-[#D4AF37] serif uppercase">Kovais Sanctuary</h5>
                <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest leading-relaxed max-w-sm">
                  097, SH 15, Otthakkuthirai Gobichettipalayam, Tamil Nadu 638455
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-12">
                <div className="flex items-center gap-4 text-white group/phone">
                  <div className="size-10 rounded-full border border-white/10 flex items-center justify-center group-hover/phone:border-[#D4AF37] transition-colors">
                    <Phone className="size-4 text-[#D4AF37]" />
                  </div>
                  <span className="text-sm font-black tracking-[0.1em]">9234567891</span>
                </div>
                <div className="flex items-center gap-4 text-white group/mail">
                  <div className="size-10 rounded-full border border-white/10 flex items-center justify-center group-hover/mail:border-[#D4AF37] transition-colors">
                    <Mail className="size-4 text-[#D4AF37]" />
                  </div>
                  <span className="text-sm font-black tracking-[0.1em]">events@kovais.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* --- Login Modal --- */}
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="max-w-md p-8 bg-[#FDFBF7] border-none rounded-2xl shadow-2xl">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-black tracking-tight serif uppercase">Event Access</h2>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-2">
                {isNewUser ? "Join our planning circle" : "Verify your identity"}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#D4AF37]" />
                <input className="w-full h-12 pl-10 pr-4 bg-white border border-border/10 rounded-none focus:outline-none focus:border-[#D4AF37]" placeholder="Username" value={loginData.username} onChange={e => setLoginData({...loginData, username: e.target.value})} />
              </div>
              {isNewUser && (
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#D4AF37]" />
                  <input className="w-full h-12 pl-10 pr-4 bg-white border border-border/10 rounded-none focus:outline-none focus:border-[#D4AF37]" placeholder="Phone Number" value={loginData.phone} onChange={e => setLoginData({...loginData, phone: e.target.value})} />
                </div>
              )}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#D4AF37]" />
                <input type="password" className="w-full h-12 pl-10 pr-4 bg-white border border-border/10 rounded-none focus:outline-none focus:border-[#D4AF37]" placeholder="Password" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} />
              </div>
              
              <Button className="w-full h-12 bg-[#D4AF37] hover:bg-[#B8962E] text-white font-black uppercase tracking-widest text-[10px]" onClick={isNewUser ? handleSignup : handleLogin} disabled={loading}>
                {loading ? "Processing..." : isNewUser ? "Begin Planning" : "Authenticate"}
              </Button>

              <div className="text-center">
                <button className="text-[10px] font-black uppercase text-[#D4AF37] hover:underline" onClick={() => setIsNewUser(!isNewUser)}>
                  {isNewUser ? "Already a client? Login" : "New to Kovais? Start here"}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- Booking Modal --- */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-[#FDFBF7] border-none rounded-2xl shadow-2xl">
          <div className="p-8 bg-white border-b border-[#D4AF37]/10">
            <div className="flex items-center gap-3">
              <Zap className="size-5 text-[#D4AF37]" />
              <h2 className="text-2xl font-black tracking-tight serif uppercase">Reservation Request</h2>
            </div>
          </div>
          
          <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
            <div className="p-6 bg-white border border-border/5 space-y-4">
              {selectedServices.map(s => (
                <div key={s.id} className="flex justify-between items-center border-b border-border/5 pb-2 last:border-0 last:pb-0">
                  <div className="font-black text-[10px] uppercase">{s.name} Ritual</div>
                  <div className="font-black text-sm serif">₹{s.price}</div>
                </div>
              ))}
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <CalendarIcon className="size-3" /> {format(selectedDate || new Date(), "EEE, dd MMM")} · {selectedTime}
                </div>
                <div className="text-xl font-black serif text-[#D4AF37]">₹{finalTotal.toLocaleString()}</div>
              </div>
            </div>

            <div className="p-6 bg-[#D4AF37]/5 border border-[#D4AF37]/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="size-4 text-[#D4AF37] fill-[#D4AF37]" />
                  <span className="text-xs font-black uppercase tracking-tight">Redeem Experience Points</span>
                </div>
                <span className="text-[10px] font-bold text-muted-foreground">{points} pts available</span>
              </div>
              <div className="flex gap-4">
                <input className="flex-1 h-12 px-4 bg-white border border-border/10 rounded-none focus:outline-none focus:border-[#D4AF37]" placeholder="Enter points" value={pointsInput} onChange={e => setPointsInput(e.target.value)} />
                <Button className="h-12 bg-black text-white px-8 rounded-none font-black text-[10px] uppercase" onClick={handleApplyPoints}>Redeem</Button>
              </div>
              {usedPoints > 0 && <div className="text-[10px] font-bold text-green-600 flex items-center gap-2"><Check className="size-3" /> ₹{discount.toFixed(2)} savings applied</div>}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Payment Ritual</label>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-5 border cursor-pointer flex items-center gap-4 transition-all ${payType === 'offline' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'bg-white border-border/10'}`} onClick={() => setPayType('offline')}>
                  <Clock className="size-6 text-[#D4AF37]" />
                  <div>
                    <div className="font-black text-xs uppercase tracking-tight">In-Person</div>
                    <div className="text-[9px] font-bold opacity-60">Discuss at sanctuary</div>
                  </div>
                </div>
                <div className={`p-5 border cursor-pointer flex items-center gap-4 transition-all ${payType === 'online' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'bg-white border-border/10'}`} onClick={() => setPayType('online')}>
                  <Zap className="size-6 text-[#D4AF37]" />
                  <div>
                    <div className="font-black text-xs uppercase tracking-tight">Priority Booking</div>
                    <div className="text-[9px] font-bold opacity-60">Instant confirmation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-white border-t border-border/10">
            <Button className="w-full h-16 bg-[#D4AF37] hover:bg-[#B8962E] text-white font-black uppercase tracking-widest text-[11px]" onClick={handleConfirmBooking} disabled={loading}>
              {loading ? "Processing Request..." : `Request Ritual · ₹${finalTotal.toLocaleString()}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Gallery Modal */}
      <Dialog open={showGalleryModal} onOpenChange={setShowGalleryModal}>
        <DialogContent className="max-w-5xl p-0 bg-black border-none overflow-hidden rounded-none">
          <div className="relative aspect-video flex items-center justify-center">
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
          <div className="p-8 bg-black/95 text-white border-t border-white/10">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-widest mb-2 block">{GALLERY[galleryIndex].category}</span>
                <h3 className="text-2xl font-black serif uppercase tracking-tight">{GALLERY[galleryIndex].title}</h3>
              </div>
              <div className="text-[10px] font-black uppercase opacity-40">{galleryIndex + 1} / {GALLERY.length}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
