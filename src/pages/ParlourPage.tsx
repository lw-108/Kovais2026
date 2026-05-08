"use client";
import { useState, useEffect } from "react";
import { 
  Star, 
  Clock, 
  User, 
  Calendar as CalendarIcon,
  Phone,
  Zap,
  Check,
  Lock,
  Sparkles,
  Filter,
  Heart,
  Shield,
  Eye,
  ChevronRight,
  ArrowRight,
  Building,
  Home
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { userService, bookingService } from "@/lib/data-service";

const HERO_SLIDES = [
  {
    image: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    title: "Discover Your",
    titleHighlight: "True Beauty",
    desc: "Premium beauty services tailored to your unique style. From hair transformations to bridal perfection."
  },
  {
    image: "https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    title: "Premium",
    titleHighlight: "Care & Style",
    desc: "Experience luxury redefined with our master artisans and internationally acclaimed products."
  },
  {
    image: "https://images.pexels.com/photos/3738355/pexels-photo-3738355.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    title: "Expert",
    titleHighlight: "Beauty Rituals",
    desc: "Every treatment is customized to your skin type, hair texture, and individual preferences."
  }
];

const PARLOUR_SERVICES = [
  { 
    id: 'p1', 
    category: 'Hair Care', 
    name: 'Luxury Hair Spa', 
    price: 1500, 
    duration: '90 min', 
    rating: 4.9,
    description: 'Deep conditioning treatment with premium cold-pressed oils and steam ritual.',
    fullDescription: 'Our Luxury Hair Spa combines the power of Argan oil, Keratin proteins, and gentle steam therapy. Your hair will be cleansed, deeply conditioned, and styled to perfection. Includes scalp massage and hot towel wrap.',
    image: 'https://images.pexels.com/photos/3993467/pexels-photo-3993467.jpeg?auto=compress&cs=tinysrgb&w=1200',
    features: ['Deep Conditioning', 'Scalp Massage', 'Hot Towel Therapy', 'Argan Oil Treatment', 'Style & Blow Dry', 'Split End Repair']
  },
  { 
    id: 'p2', 
    category: 'Skin Care', 
    name: '24K Gold Facial', 
    price: 3500, 
    duration: '75 min', 
    rating: 4.9,
    description: 'Luxurious brightening treatment using genuine gold leaves for radiant skin.',
    fullDescription: 'Experience the ultimate luxury with our 24K Gold Facial. Gold particles penetrate deep into the skin to boost collagen production, reduce wrinkles, and give you a luminous, youthful glow. Includes face massage and gold mask.',
    image: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=1200',
    features: ['24K Gold Particles', 'Collagen Boost', 'Anti-Wrinkle', 'Face Massage', 'Gold Mask', 'Sun Protection']
  },
  { 
    id: 'p3', 
    category: 'Makeup', 
    name: 'Bridal Perfection', 
    price: 15000, 
    duration: '240 min', 
    rating: 5.0,
    description: 'HD finish and customized aesthetic for your most significant life milestone.',
    fullDescription: 'Your wedding day deserves perfection. Our expert bridal makeup artists use high-definition, long-lasting products to create a flawless look. Includes trial session, day-of makeup, hairstyling, and touch-up kit.',
    image: 'https://images.pexels.com/photos/2442900/pexels-photo-2442900.jpeg?auto=compress&cs=tinysrgb&w=1200',
    features: ['HD Finish', 'Trial Session', 'Hairstyling', 'Draping Assist', 'Touch-up Kit', 'Long-Lasting']
  },
  { 
    id: 'p4', 
    category: 'Hair Care', 
    name: 'Artisan Cut & Color', 
    price: 4500, 
    duration: '120 min', 
    rating: 4.8,
    description: 'Precision styling and customized palette by our master artisans.',
    fullDescription: 'Transform your look with our master artisans. We use only premium ammonia-free products to deliver beautiful, long-lasting results. Includes a color consultation and aftercare kit.',
    image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80',
    features: ['Precision Cut', 'Ammonia-Free Color', 'Consultation', 'Aftercare Kit', 'Heat Protection', 'Styling']
  },
  { 
    id: 'p5', 
    category: 'Skin Care', 
    name: 'Hydra-Infusion Ritual', 
    price: 2800, 
    duration: '60 min', 
    rating: 4.7,
    description: 'Molecular hydration for deep cellular rejuvenation and lasting glow.',
    fullDescription: 'Start your aesthetic journey with deep cellular hydration. Our Hydra-Infusion ritual uses botanical extracts and advanced proteins to repair and restore skin elasticity. Includes intensive moisture mask.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80',
    features: ['Moisture Repair', 'Botanical Extracts', 'Steam Therapy', 'Skin Firming', 'Hyaluronic Acid', 'UV Protection']
  },
];

const ARTISANS = [
  { id: 'a1', name: 'Ananya Iyer', speciality: 'Bridal Artisan', rating: 4.9 },
  { id: 'a2', name: 'Priya Sharma', speciality: 'Skin Specialist', rating: 4.8 },
  { id: 'a3', name: 'Rohan Mehra', speciality: 'Hair Master', rating: 4.9 }
];

const TIME_SLOTS = [
  '09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM', '08:00 PM'
];

const CATEGORIES = ["Hair Care", "Skin Care", "Makeup"];

const WHY_CHOOSE_PARLOUR = [
  { icon: <Sparkles size={24} />, title: 'Premium Products', desc: 'We only use internationally acclaimed, dermatologically tested products.' },
  { icon: <Star size={24} />, title: 'Expert Stylists', desc: 'Our certified professionals have 10+ years of mastery in beauty arts.' },
  { icon: <Heart size={24} />, title: 'Personalized Care', desc: 'Every treatment is customized to your skin type, hair texture, and preferences.' },
  { icon: <Shield size={24} />, title: 'Hygiene First', desc: 'Sterilized tools, disposable supplies, and sanitized workstations — always.' },
];

export default function ParlourPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<"salon" | "doorstep">("salon");
  const [selectedCategory, setSelectedCategory] = useState<string>("Hair Care");
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [selectedArtisan, setSelectedArtisan] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [selectedDetailService, setSelectedDetailService] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const [user, setUser] = useState<any>(null);
  const [points, setPoints] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "", phone: "" });

  const [payType, setPayType] = useState<"online" | "offline">("offline");
  const [usedPoints, setUsedPoints] = useState(0);
  const [pointsInput, setPointsInput] = useState("");

  const serviceTotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const doorstepCharge = selectedLocation === "doorstep" ? 300 : 0;
  const baseTotal = serviceTotal + doorstepCharge;
  const discount = usedPoints * 0.10;
  const finalTotal = Math.max(0, baseTotal - discount);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
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
      Swal.fire({ icon: 'error', title: 'Ritual Required', text: "Please select at least one beauty ritual" });
      return;
    }
    if (!selectedArtisan) {
      Swal.fire({ icon: 'error', title: 'Artisan Required', text: "Please select a beauty artisan" });
      return;
    }
    if (!selectedDate || !selectedTime) {
      Swal.fire({ icon: 'error', title: 'Time Required', text: "Please select your preferred ritual time" });
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
      Swal.fire({ icon: 'success', title: 'Authenticity Confirmed', text: "Welcome back to Parlour De Luxe" });
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
      Swal.fire({ icon: 'success', title: 'Aesthetic Profile Created', text: "Your transformation journey begins now." });
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error', text: "Registration failed." });
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
    setUsedPoints(pts);
    Swal.fire({ icon: 'success', title: 'Applied', text: `₹${(pts * 0.1).toFixed(2)} savings applied!` });
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      await bookingService.createParlourBooking({
        user_id: user.user_id,
        services: selectedServices.map(s => s.name).join(", "),
        location: selectedLocation,
        artisan_id: selectedArtisan.id,
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
      Swal.fire({ icon: 'success', title: 'Ritual Reserved', text: "Your aesthetic transformation is scheduled." });
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error', text: "Reservation failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const currentServices = PARLOUR_SERVICES.filter(s => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-transparent">
      <Header />

      <main className="pt-32 pb-24 space-y-24">
        {/* Animated Hero Section */}
        <section className="relative h-[80vh] md:h-[90vh] overflow-hidden mx-6">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <img src={HERO_SLIDES[currentSlide].image} className="size-full object-cover grayscale brightness-50" />
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
                Kovais Beauty Parlour
                <div className="size-1.5 bg-[#D4AF37]" />
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-6xl md:text-9xl font-black tracking-tight serif text-white leading-[0.85]">
                    {HERO_SLIDES[currentSlide].title} <br />
                    <span className="text-[#D4AF37] italic font-light">{HERO_SLIDES[currentSlide].titleHighlight}</span>
                  </h1>
                  <p className="text-white/60 font-medium text-lg md:text-xl max-w-xl mx-auto mt-8">
                    {HERO_SLIDES[currentSlide].desc}
                  </p>
                </motion.div>
              </AnimatePresence>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap justify-center gap-8 pt-8"
              >
                <Button 
                  onClick={() => document.getElementById('ritual-menu')?.scrollIntoView({ behavior: 'smooth' })}
                  className="h-16 px-12 bg-[#D4AF37] hover:bg-white hover:text-black text-white font-black uppercase tracking-widest text-[11px] rounded-none transition-all duration-500"
                >
                  Explore Catalog
                </Button>
                <Button 
                  className="h-16 px-12 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white hover:text-black text-white font-black uppercase tracking-widest text-[11px] rounded-none transition-all duration-500"
                >
                  Book Transformation
                </Button>
              </motion.div>
            </div>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4">
            {HERO_SLIDES.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentSlide(i)}
                className={`h-1 transition-all duration-700 ${i === currentSlide ? 'w-12 bg-[#D4AF37]' : 'w-4 bg-white/30'}`} 
              />
            ))}
          </div>
        </section>

        {/* Marquee Track */}
        <div className="py-8 bg-black overflow-hidden border-y border-[#D4AF37]/20">
          <div className="flex animate-marquee whitespace-nowrap gap-16 items-center">
            {[...Array(2)].map((_, ri) => (
              <div key={ri} className="flex gap-16 items-center">
                {['HAIR CARE', 'SKIN CARE', 'MAKEUP', 'NAIL ART', 'BRIDAL PACKAGES', 'PREMIUM PRODUCTS'].map((item, i) => (
                  <span key={i} className="text-white/40 text-[10px] font-black tracking-[0.5em] flex items-center gap-4 uppercase">
                    <span className="text-[#D4AF37]">◆</span> {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Ritual Configuration */}
        <div className="max-w-7xl mx-auto px-6 space-y-1">
          <div className="p-4 bg-background border border-[#D4AF37]/10 shadow-2xl relative">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Service Type</label>
                <div className="grid grid-cols-2 gap-1 p-1 bg-background border border-border/5">
                  <button 
                    onClick={() => setSelectedLocation("salon")}
                    className={`flex items-center justify-center gap-2 h-11 text-[10px] font-black uppercase transition-all ${selectedLocation === 'salon' ? 'bg-[#D4AF37] text-white' : 'hover:bg-[#D4AF37]/5 text-muted-foreground'}`}
                  >
                    <Building className="size-3" /> Parlour
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
                <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Target Category</label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-background border border-border/5">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSelectedServices([]);
                      }}
                      className={`h-11 text-[10px] font-black uppercase transition-all ${selectedCategory === cat ? 'bg-[#D4AF37] text-white' : 'hover:bg-[#D4AF37]/5 text-muted-foreground'}`}
                    >
                      {cat.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Preferred Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-bold rounded-none border-[#D4AF37]/10 h-11 bg-background">
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
                <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Artisan Preference</label>
                <div className="flex items-center gap-2 p-3 bg-background border border-border/5 h-11 font-bold text-sm">
                  <User className="size-4 text-[#D4AF37]" />
                  {selectedArtisan ? selectedArtisan.name : "Choose below"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services & Booking Grid */}
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-px bg-[#D4AF37]/10 border border-[#D4AF37]/20" id="ritual-menu">
          {/* Left: Ritual Menu */}
          <div className="p-8 md:p-12 bg-background space-y-10">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-2 block">AESTHETIC MENU</span>
                <h2 className="text-3xl font-black serif uppercase tracking-tight">Ritual Menu</h2>
              </div>
              <Badge variant="outline" className="border-[#D4AF37]/30 text-[#D4AF37] rounded-none">{selectedCategory}</Badge>
            </div>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              {currentServices.map((service: any) => {
                const isSelected = selectedServices.find(s => s.id === service.id);
                return (
                  <motion.div 
                    key={service.id}
                    className={`group p-5 border transition-all cursor-pointer flex items-center gap-6 ${isSelected ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-border/5 hover:border-[#D4AF37]/30 bg-muted/5'}`}
                  >
                    <div className="size-24 overflow-hidden border border-[#D4AF37]/10 shrink-0" onClick={() => handleServiceToggle(service)}>
                      <img src={service.image} alt={service.name} className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-sm uppercase tracking-tight" onClick={() => handleServiceToggle(service)}>{service.name}</h4>
                        <span className="font-black text-[#D4AF37]">₹{service.price}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-medium leading-relaxed" onClick={() => handleServiceToggle(service)}>{service.description}</p>
                      <div className="flex items-center gap-6 text-[9px] font-black uppercase text-[#D4AF37]/60">
                        <span className="flex items-center gap-1"><Clock className="size-3" /> {service.duration}</span>
                        <span className="flex items-center gap-1"><Star className="size-3 fill-[#D4AF37]/60" /> {service.rating}</span>
                        <button 
                          onClick={() => { setSelectedDetailService(service); setShowDetailModal(true); }}
                          className="flex items-center gap-1 text-black hover:text-[#D4AF37] transition-colors"
                        >
                          <Eye className="size-3" /> View Detail
                        </button>
                      </div>
                    </div>
                    <div 
                      onClick={() => handleServiceToggle(service)}
                      className={`size-5 border flex items-center justify-center transition-all ${isSelected ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-border/20 group-hover:border-[#D4AF37]/50'}`}
                    >
                      {isSelected && <Check className="size-3 text-white" />}
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
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">I. Select Beauty Artisan</h3>
                <div className="grid grid-cols-1 gap-4">
                  {ARTISANS.map((artisan) => (
                    <button 
                      key={artisan.id}
                      onClick={() => setSelectedArtisan(artisan)}
                      className={`p-5 border transition-all flex items-center justify-between ${selectedArtisan?.id === artisan.id ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'bg-white border-border/10 hover:border-[#D4AF37]/30'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                          <User className="size-6 text-[#D4AF37]" />
                        </div>
                        <div className="text-left">
                          <div className="font-black text-xs uppercase tracking-tight">{artisan.name}</div>
                          <div className="text-[9px] font-bold text-muted-foreground uppercase">{artisan.speciality}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-black text-[#D4AF37]">
                        <Star className="size-3 fill-[#D4AF37]" /> {artisan.rating}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">II. Select Ritual Time</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {TIME_SLOTS.map((time) => (
                    <button 
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`h-11 text-[10px] font-black border transition-all ${selectedTime === time ? 'bg-black text-white border-black' : 'bg-white border-border/10 hover:border-[#D4AF37]/50 text-muted-foreground'}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-12 border-t border-[#D4AF37]/20">
                <div className="flex justify-between items-end mb-8">
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Estimated Investment</div>
                    <div className="text-4xl font-black serif">₹{finalTotal.toLocaleString()}</div>
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                    {selectedServices.length} Rituals Selected
                  </div>
                </div>
                <Button 
                  className="w-full h-16 rounded-none bg-[#D4AF37] hover:bg-[#B8962E] text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-[#D4AF37]/20"
                  onClick={handleBookingClick}
                >
                  Schedule Transformation <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <section className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">AESTHETIC MASTERY</span>
            <h2 className="text-4xl md:text-6xl font-black serif uppercase tracking-tight">The Art of <span className="text-[#D4AF37]">Perfection</span></h2>
            <p className="text-muted-foreground text-sm font-medium max-w-xl mx-auto">We combine expertise, premium products, and personalized care to deliver transformations that exceed expectations.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {WHY_CHOOSE_PARLOUR.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-10 border border-[#D4AF37]/10 bg-background hover:border-[#D4AF37]/30 transition-all duration-500 text-center space-y-6"
              >
                <div className="text-[#D4AF37] flex justify-center scale-125">{item.icon}</div>
                <div className="space-y-3">
                  <h4 className="font-black text-xs uppercase tracking-widest">{item.title}</h4>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats Strip */}
        <div className="bg-[#D4AF37] py-16 mx-6">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-white">
            <div className="text-center space-y-2">
              <div className="text-4xl font-black serif">500+</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Bridal Creations</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-black serif">24K</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Gold Standards</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-black serif">15</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Expert Artisans</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-black serif">100%</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Satisfaction</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* --- Service Detail Modal --- */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-background border border-[#D4AF37]/20 rounded-none shadow-2xl">
          {selectedDetailService && (
            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-1/2 relative h-64 md:h-auto">
                <img src={selectedDetailService.image} className="size-full object-cover" />
                <div className="absolute top-6 left-6 bg-[#D4AF37] text-white px-4 py-1.5 text-[9px] font-black uppercase tracking-widest">
                  {selectedCategory} Ritual
                </div>
              </div>
              <div className="md:w-1/2 p-10 space-y-8">
                <DialogHeader className="space-y-2">
                  <div className="flex items-center justify-between text-[#D4AF37]">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < Math.floor(selectedDetailService.rating) ? "currentColor" : "none"} />
                      ))}
                    </div>
                    <span className="text-[10px] font-black">{selectedDetailService.rating}/5.0</span>
                  </div>
                  <DialogTitle className="text-3xl font-black serif uppercase tracking-tight">{selectedDetailService.name}</DialogTitle>
                  <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">{selectedDetailService.fullDescription}</p>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 border-y border-[#D4AF37]/10 py-6">
                  <div>
                    <div className="text-[9px] font-black uppercase opacity-40 mb-1">Investment</div>
                    <div className="text-xl font-black serif text-[#D4AF37]">₹{selectedDetailService.price}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-black uppercase opacity-40 mb-1">Ritual Duration</div>
                    <div className="text-xl font-black serif text-[#D4AF37]">{selectedDetailService.duration}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h6 className="text-[10px] font-black uppercase tracking-widest">What's Included</h6>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedDetailService.features.map((f: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                        <Check className="size-3 text-[#D4AF37]" /> {f}
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    handleServiceToggle(selectedDetailService);
                    setShowDetailModal(false);
                  }}
                  className="w-full h-14 bg-black hover:bg-[#D4AF37] text-white font-black uppercase tracking-widest text-[10px] rounded-none transition-all duration-500"
                >
                  {selectedServices.find(s => s.id === selectedDetailService.id) ? "Remove from Journey" : "Add to Transformation Ritual"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* --- Login Modal --- */}
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="max-w-md p-8 bg-background border border-[#D4AF37]/20 rounded-none shadow-2xl">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-black tracking-tight serif uppercase">Aesthetic Access</h2>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-2">
                {isNewUser ? "Join our inner circle" : "Verify your identity"}
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
                {loading ? "Processing..." : isNewUser ? "Create Profile" : "Authenticate"}
              </Button>

              <div className="text-center">
                <button className="text-[10px] font-black uppercase text-[#D4AF37] hover:underline" onClick={() => setIsNewUser(!isNewUser)}>
                  {isNewUser ? "Member already? Login" : "New here? Begin transformation"}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- Booking Modal --- */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-background border border-[#D4AF37]/20 rounded-none shadow-2xl">
          <div className="p-8 bg-white border-b border-[#D4AF37]/10">
            <div className="flex items-center gap-3">
              <Sparkles className="size-5 text-[#D4AF37]" />
              <h2 className="text-2xl font-black tracking-tight serif uppercase">Confirm Transformation</h2>
            </div>
          </div>
          
          <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
            <div className="p-6 bg-card border border-border/5 space-y-4">
              {selectedServices.map(s => (
                <div key={s.id} className="flex justify-between items-center border-b border-border/5 pb-2 last:border-0 last:pb-0">
                  <div className="font-black text-[10px] uppercase tracking-tight">{s.name}</div>
                  <div className="font-black text-sm serif">₹{s.price}</div>
                </div>
              ))}
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <CalendarIcon className="size-3" /> {selectedDate ? format(selectedDate, "EEE, dd MMM") : "Scheduled"} · {selectedTime}
                </div>
                <div className="text-xl font-black serif text-[#D4AF37]">₹{finalTotal.toLocaleString()}</div>
              </div>
            </div>

            <div className="p-6 bg-[#D4AF37]/5 border border-[#D4AF37]/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="size-4 text-[#D4AF37] fill-[#D4AF37]" />
                  <span className="text-xs font-black uppercase tracking-tight">Redeem Rewards</span>
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
                    <div className="font-black text-xs uppercase tracking-tight">At Parlour</div>
                    <div className="text-[9px] font-bold opacity-60">Pay after transformation</div>
                  </div>
                </div>
                <div className={`p-5 border cursor-pointer flex items-center gap-4 transition-all ${payType === 'online' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'bg-white border-border/10'}`} onClick={() => setPayType('online')}>
                  <Zap className="size-6 text-[#D4AF37]" />
                  <div>
                    <div className="font-black text-xs uppercase tracking-tight">Instant Pay</div>
                    <div className="text-[9px] font-bold opacity-60">Priority confirmation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-background border-t border-border/10">
            <Button className="w-full h-16 bg-[#D4AF37] hover:bg-[#B8962E] text-white font-black uppercase tracking-widest text-[11px]" onClick={handleConfirmBooking} disabled={loading}>
              {loading ? "Registering Ritual..." : `Confirm Transformation · ₹${finalTotal.toLocaleString()}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
