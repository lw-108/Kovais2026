"use client";
import { useState, useEffect } from "react";
import { 
  Star, 
  Clock, 
  Home, 
  User, 
  Calendar as CalendarIcon, 
  ArrowRight,
  Award,
  Phone,
  Zap,
  Check,
  Lock,
  Flower2,
  Droplets,
  Leaf,
  Sparkles,
  Building,
  Heart,
  Shield,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import Swal from "sweetalert2";

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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LazyImage } from "@/components/ui/lazy-image";

import { userService, bookingService } from "@/lib/data-service";

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80",
    title: "Discover Your",
    titleHighlight: "Inner Peace",
    desc: "Experience ancient wellness rituals redefined for the modern soul."
  },
  {
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80",
    title: "Premium",
    titleHighlight: "Wellness Care",
    desc: "Dermatologically tested organic elixirs for your ultimate rejuvenation."
  },
  {
    image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80",
    title: "Expert",
    titleHighlight: "Ritual Masters",
    desc: "Our therapists bring decades of mastery in holistic healing arts."
  }
];

const SPA_SERVICES = {
  Women: [
    { 
      id: "w1", 
      name: "Signature Glow Facial", 
      description: "Deep cleansing with organic botanical extracts for radiant skin.",
      fullDescription: "Our Signature Glow Facial uses high-altitude organic botanicals and cold-pressed elixirs. This 7-step ritual includes deep pore cleansing, enzymatic exfoliation, and a revitalizing gold-infused mask to restore your natural luminosity.",
      price: 2500, 
      duration: "60 min", 
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80",
      features: ["Botanical Cleansing", "Enzymatic Exfoliation", "Gold-Infused Mask", "Deep Hydration", "Lymphatic Drainage Massage"]
    },
    { 
      id: "w2", 
      name: "Aromatherapy Ritual", 
      description: "Full body relaxation with essential oils and hot stone therapy.",
      fullDescription: "A sensory journey tailored to your emotional and physical needs. We blend rare essential oils with rhythmic massage techniques and heated basalt stones to dissolve tension and align your energy centers.",
      price: 3000, 
      duration: "90 min", 
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80",
      features: ["Custom Oil Blending", "Hot Stone Therapy", "Full Body Massage", "Pressure Point Release", "Aromatic Steam Session"]
    },
    { 
      id: "w3", 
      name: "Traditional Thai Healing", 
      description: "Ancient stretching and pressure point therapy for flexibility.",
      fullDescription: "Known as 'lazy yoga', this ancient healing art involves assisted stretching and deep compression along energy lines. Performed on a traditional mat, it improves circulation and restores skeletal alignment.",
      price: 2800, 
      duration: "90 min", 
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80",
      features: ["Assisted Yoga Stretching", "Sen Line Compression", "Joint Mobilization", "Circulatory Boost", "Traditional Mat Setting"]
    },
  ],
  Men: [
    { 
      id: "m1", 
      name: "Deep Tissue Release", 
      description: "Intense muscle therapy for active lifestyles and chronic tension.",
      fullDescription: "Focused on the deeper layers of muscle tissue. Our therapists use slow, firm pressure to release chronic muscle knots and tension. Ideal for athletes or those with high-stress desk environments.",
      price: 2500, 
      duration: "60 min", 
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1519824141121-b97674389913?auto=format&fit=crop&q=80",
      features: ["Deep Muscle Compression", "Trigger Point Therapy", "Myofascial Release", "Sports Alignment", "Tension Dissolve"]
    },
    { 
      id: "m2", 
      name: "Executive Stress Relief", 
      description: "Focus on neck, shoulders, and head tension for mental clarity.",
      fullDescription: "Specifically designed for the modern professional. This concentrated ritual targets the areas where stress accumulates most—the cervical spine, trapezius, and scalp. Includes a cooling peppermint oil treatment.",
      price: 1800, 
      duration: "45 min", 
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1511424326902-d3dd5c39c5ac?auto=format&fit=crop&q=80",
      features: ["Cervical Tension Release", "Scalp Invigoration", "Peppermint Oil Therapy", "Mental Clarity Focus", "Shoulder De-stressing"]
    },
    { 
      id: "m3", 
      name: "Swedish Relaxation", 
      description: "Gentle rhythmic strokes for total calm and improved circulation.",
      fullDescription: "The classic relaxation massage. Long, gliding strokes towards the heart promote blood flow and induce a state of profound physiological rest. Perfect for a first-time spa experience.",
      price: 2200, 
      duration: "75 min", 
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80",
      features: ["Long Gliding Strokes", "Effleurage Techniques", "Circulation Improvement", "Gentle Pressure", "Total Calm Inducement"]
    },
  ],
  Couples: [
    { 
      id: "c1", 
      name: "Eternal Bond Ritual", 
      description: "Side-by-side aromatherapy for two in a private sanctuary suite.",
      fullDescription: "Reconnect in our signature couples' suite. You and your partner will enjoy synchronized aromatherapy massages followed by a private relaxation session with herbal infusions and dark chocolate.",
      price: 5500, 
      duration: "120 min", 
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80",
      features: ["Synchronized Massage", "Private Sanctuary Suite", "Herbal Infusion Service", "Artisanal Chocolates", "Shared Wellness Journey"]
    },
    { 
      id: "c2", 
      name: "Sanctuary Escape", 
      description: "Massage followed by a luxury floral bath experience for two.",
      fullDescription: "The ultimate romantic retreat. After a rejuvenating full-body massage, immerse yourselves in a hand-drawn floral bath infused with sandalwood and rose petals. Includes chilled refreshments and fruit platter.",
      price: 7500, 
      duration: "150 min", 
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80",
      features: ["Full Body Rejuvenation", "Floral Bath Ritual", "Sandalwood Immersion", "Chilled Refreshments", "Luxury Fruit Platter"]
    },
  ]
};

const THERAPISTS = [
  { id: 't1', name: 'Maya Sharma', speciality: 'Ayurvedic Master', rating: 4.9 },
  { id: 't2', name: 'Liam Chen', speciality: 'Deep Tissue Expert', rating: 4.8 },
  { id: 't3', name: 'Sarah Wilson', speciality: 'Aesthetician', rating: 4.9 }
];

const TIME_SLOTS = [
  '09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM', '08:00 PM'
];

const WHY_CHOOSE_SPA = [
  { icon: <Sparkles size={24} />, title: 'Premium Elixirs', desc: 'We only use internationally acclaimed, organic botanical products.' },
  { icon: <Star size={24} />, title: 'Wellness Experts', desc: 'Our certified therapists have 10+ years of mastery in holistic arts.' },
  { icon: <Heart size={24} />, title: 'Bespoke Rituals', desc: 'Every journey is tailored to your unique energy and physical needs.' },
  { icon: <Shield size={24} />, title: 'Sanctity of Space', desc: 'Pristine environments, sterilized tools, and meditative calm — always.' },
];

// Removed duplicate useEffect import

export default function SpaPage() {

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<"salon" | "doorstep">("salon");
  const [selectedCategory, setSelectedCategory] = useState<string>("Women");
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [selectedDetailService, setSelectedDetailService] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  const [user, setUser] = useState<any>(null);
  const [points, setPoints] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);

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
      Swal.fire({ icon: 'error', title: 'Ritual Required', text: "Please select at least one spa ritual" });
      return;
    }
    if (!selectedTherapist) {
      Swal.fire({ icon: 'error', title: 'Therapist Required', text: "Please select a wellness therapist" });
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
      Swal.fire({ icon: 'success', title: 'Identity Verified', text: "Welcome back to your sanctuary" });
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Verification Failed', text: "Invalid credentials" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      await userService.signup(loginData.username, loginData.phone, loginData.password);
      setIsNewUser(false);
      Swal.fire({ icon: 'success', title: 'Profile Created', text: "Your wellness journey begins now" });
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error', text: "Profile creation failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPoints = () => {
    const pts = parseInt(pointsInput);
    if (isNaN(pts) || pts <= 0) return;
    if (pts > points) {
      Swal.fire({ icon: 'error', title: 'Insufficient Rewards', text: "You don't have enough reward points" });
      return;
    }
    setUsedPoints(pts);
    Swal.fire({ icon: 'success', title: 'Applied', text: `₹${(pts * 0.1).toFixed(2)} reward applied!` });
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      await bookingService.createSpaBooking({
        user_id: user.user_id,
        services: selectedServices.map(s => s.name).join(", "),
        location: selectedLocation,
        therapist_id: selectedTherapist.id,
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
      Swal.fire({ icon: 'success', title: 'Ritual Confirmed', text: "Your wellness journey is scheduled." });
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error', text: "Booking failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const currentServices = (SPA_SERVICES as any)[selectedCategory] || [];

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
              <LazyImage src={HERO_SLIDES[currentSlide].image} alt="Hero image" className="size-full grayscale brightness-50" />
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
                Kovais Wellness Sanctuary
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
                  Explore Rituals
                </Button>
                <Button 
                  className="h-16 px-12 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white hover:text-black text-white font-black uppercase tracking-widest text-[11px] rounded-none transition-all duration-500"
                >
                  View Wellness Menu
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
                {['AYURVEDIC HEALING', 'AROMATHERAPY', 'DEEP TISSUE', 'FLORAL BATHS', 'MINDFULNESS', 'ORGANIC ELIXIRS'].map((item, i) => (
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
                    <Building className="size-3" /> Spa Salon
                  </button>
                  <button 
                    onClick={() => setSelectedLocation("doorstep")}
                    className={`flex items-center justify-center gap-2 h-11 text-[10px] font-black uppercase transition-all ${selectedLocation === 'doorstep' ? 'bg-[#D4AF37] text-white' : 'hover:bg-[#D4AF37]/5 text-muted-foreground'}`}
                  >
                    <Home className="size-3" /> Home Spa
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Target Category</label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-background border border-border/5">
                  {['Women', 'Men', 'Couples'].map(cat => (
                    <button 
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSelectedServices([]);
                      }}
                      className={`h-11 text-[10px] font-black uppercase transition-all ${selectedCategory === cat ? 'bg-[#D4AF37] text-white' : 'hover:bg-[#D4AF37]/5 text-muted-foreground'}`}
                    >
                      {cat}
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
                <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Therapist Preference</label>
                <div className="flex items-center gap-2 p-3 bg-background border border-border/5 h-11 font-bold text-sm">
                  <User className="size-4 text-[#D4AF37]" />
                  {selectedTherapist ? selectedTherapist.name : "Choose below"}
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
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-2 block">OUR COLLECTION</span>
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
                      <LazyImage src={service.image} alt={service.name} className="size-full transition-transform duration-700 group-hover:scale-110" />
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
                          <Eye className="size-3" /> View Ritual
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
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">I. Select Wellness Therapist</h3>
                <div className="grid grid-cols-1 gap-4">
                  {THERAPISTS.map((therapist) => (
                    <button 
                      key={therapist.id}
                      onClick={() => setSelectedTherapist(therapist)}
                      className={`p-5 border transition-all flex items-center justify-between ${selectedTherapist?.id === therapist.id ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'bg-background border-border/10 hover:border-[#D4AF37]/30'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                          <User className="size-6 text-[#D4AF37]" />
                        </div>
                        <div className="text-left">
                          <div className="font-black text-xs uppercase tracking-tight">{therapist.name}</div>
                          <div className="text-[9px] font-bold text-muted-foreground uppercase">{therapist.speciality}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-black text-[#D4AF37]">
                        <Star className="size-3 fill-[#D4AF37]" /> {therapist.rating}
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
                  Schedule Your Escape <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <section className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">WHY KOVAIS SPA</span>
            <h2 className="text-4xl md:text-6xl font-black serif uppercase tracking-tight">The Mastery of <span className="text-[#D4AF37]">Healing</span></h2>
            <p className="text-muted-foreground text-sm font-medium max-w-xl mx-auto">We combine expertise, premium organic products, and personalized care to deliver results that exceed expectations.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {WHY_CHOOSE_SPA.map((item, i) => (
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

        {/* Featured Amenities Section */}
        <div className="max-w-7xl mx-auto px-6 py-24 border-t border-[#D4AF37]/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="text-center space-y-4 group">
              <div className="size-24 mx-auto rounded-full border border-[#D4AF37]/20 flex items-center justify-center group-hover:bg-[#D4AF37]/5 transition-all">
                <Droplets className="size-10 text-[#D4AF37]" />
              </div>
              <h4 className="font-black text-xs uppercase tracking-widest">Organic Oils</h4>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Pure Botanical Essences</p>
            </div>
            <div className="text-center space-y-4 group">
              <div className="size-24 mx-auto rounded-full border border-[#D4AF37]/20 flex items-center justify-center group-hover:bg-[#D4AF37]/5 transition-all">
                <Leaf className="size-10 text-[#D4AF37]" />
              </div>
              <h4 className="font-black text-xs uppercase tracking-widest">Natural Care</h4>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Eco-Certified Products</p>
            </div>
            <div className="text-center space-y-4 group">
              <div className="size-24 mx-auto rounded-full border border-[#D4AF37]/20 flex items-center justify-center group-hover:bg-[#D4AF37]/5 transition-all">
                <Sparkles className="size-10 text-[#D4AF37]" />
              </div>
              <h4 className="font-black text-xs uppercase tracking-widest">Zen Spaces</h4>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Meditative Ambiance</p>
            </div>
            <div className="text-center space-y-4 group">
              <div className="size-24 mx-auto rounded-full border border-[#D4AF37]/20 flex items-center justify-center group-hover:bg-[#D4AF37]/5 transition-all">
                <Award className="size-10 text-[#D4AF37]" />
              </div>
              <h4 className="font-black text-xs uppercase tracking-widest">Mastery</h4>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Expert Wellness Artisans</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* --- Service Detail Modal --- */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-[#FDFBF7] border-none rounded-2xl shadow-2xl">
          {selectedDetailService && (
            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-1/2 relative h-64 md:h-auto">
                <LazyImage src={selectedDetailService.image} alt={selectedDetailService.name} className="size-full" />
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
                  {selectedServices.find(s => s.id === selectedDetailService.id) ? "Remove from Journey" : "Add to Journey Ritual"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* --- Login Modal --- */}
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="max-w-md p-8 bg-[#FDFBF7] border-none rounded-2xl shadow-2xl">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-black tracking-tight serif uppercase">Wellness Access</h2>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-2">
                {isNewUser ? "Join our wellness circle" : "Verify your identity"}
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
                  {isNewUser ? "Member already? Login" : "New here? Begin journey"}
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
              <Flower2 className="size-5 text-[#D4AF37]" />
              <h2 className="text-2xl font-black tracking-tight serif uppercase">Confirm Ritual Journey</h2>
            </div>
          </div>
          
          <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
            <div className="p-6 bg-white border border-border/5 space-y-4">
              {selectedServices.map(s => (
                <div key={s.id} className="flex justify-between items-center border-b border-border/5 pb-2 last:border-0 last:pb-0">
                  <div className="font-black text-[10px] uppercase tracking-tight">{s.name}</div>
                  <div className="font-black text-sm serif">₹{s.price}</div>
                </div>
              ))}
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <CalendarIcon className="size-3" /> {selectedDate ? format(selectedDate, "EEE, dd MMM") : "Select date"} · {selectedTime}
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
                    <div className="font-black text-xs uppercase tracking-tight">At Sanctuary</div>
                    <div className="text-[9px] font-bold opacity-60">Pay after ritual</div>
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

          <div className="p-8 bg-white border-t border-border/10">
            <Button className="w-full h-16 bg-[#D4AF37] hover:bg-[#B8962E] text-white font-black uppercase tracking-widest text-[11px]" onClick={handleConfirmBooking} disabled={loading}>
              {loading ? "Registering Journey..." : `Confirm Journey · ₹${finalTotal.toLocaleString()}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}