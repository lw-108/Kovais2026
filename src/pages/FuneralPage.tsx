"use client";
import { useState, useEffect } from "react";
import { 
  Star, 
  Clock, 
  User, 
  Heart,
  Shield,
  Check,
  Lock,
  Phone,
  ArrowRight,
  Sparkles,
  Award,
  Home,
  CheckCircle,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { LazyImage } from "@/components/ui/lazy-image";

import { userService, bookingService } from "@/lib/data-service";

const HERO_SLIDES = [
  {
    image: "https://plus.unsplash.com/premium_photo-1661544108210-3a11648ecfd9?auto=format&fit=crop&q=80",
    title: "Respectful",
    titleHighlight: "Preparation",
    desc: "Memorial grooming services delivered with the utmost dignity and care for your loved ones."
  },
  {
    image: "https://images.unsplash.com/photo-1740457029931-ad544487454f?auto=format&fit=crop&q=80",
    title: "Master",
    titleHighlight: "Craftsmen",
    desc: "Our senior stylists specialize in final preparations, ensuring a peaceful and dignified appearance."
  },
  {
    image: "https://images.unsplash.com/photo-1740457026779-4c156694231c?auto=format&fit=crop&q=80",
    title: "Compassionate",
    titleHighlight: "Care",
    desc: "Providing comfort and support through meticulous attention to detail during difficult times."
  }
];

const FUNERAL_SERVICES = [
  {
    id: 'f1',
    category: 'Funeral',
    name: 'Memorial Grooming',
    description: 'Respectful final preparation service including hair and grooming.',
    price: 500,
    image: 'https://images.unsplash.com/photo-1675746435874-e72d846bdca5?auto=format&fit=crop&q=80',
    duration: '60 min'
  }
];

const SPECIALISTS = [
  {
    id: 'emp4',
    name: 'Isabella',
    speciality: 'Senior Stylist',
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
    categories: ['Funeral']
  }
];

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM', '06:00 PM',
];

const STATS = [
  { icon: <Star size={20} />, value: "4.9", label: "Rating" },
  { icon: <Clock size={20} />, value: "25+", label: "Years" },
  { icon: <Award size={20} />, value: "500+", label: "Families Served" },
];



export default function FuneralPage() {

  const [currentSlide, setCurrentSlide] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [points, setPoints] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "", phone: "" });

  // Booking Flow State
  const [currentStep, setCurrentStep] = useState(0);
  const [booking, setBooking] = useState({
    services: [] as any[],
    location: 'Door Step',
    employee: null as any,
    date: '',
    time: null as any,
    customerInfo: {
      name: '',
      phone: '',
      email: '',
      notes: ''
    }
  });

  const [pointsInput, setPointsInput] = useState("");
  const [usedPoints, setUsedPoints] = useState(0);
  const [payType, setPayType] = useState<"online" | "offline">("offline");

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

  const handleLogin = async () => {
    setLoading(true);
    try {
      const u = await userService.login(loginData.username, loginData.password);
      setUser(u);
      setPoints(u.points);
      setShowLogin(false);
      Swal.fire({ icon: 'success', title: 'Welcome', text: "Verification successful." });
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error', text: "Invalid credentials" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      await userService.signup(loginData.username, loginData.phone, loginData.password);
      setIsNewUser(false);
      Swal.fire({ icon: 'success', title: 'Success', text: "Account created! Please login." });
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error', text: "Signup failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (service: any) => {
    const isSelected = booking.services.find(s => s.id === service.id);
    if (isSelected) {
      setBooking(prev => ({
        ...prev,
        services: prev.services.filter(s => s.id !== service.id)
      }));
    } else {
      setBooking(prev => ({
        ...prev,
        services: [...prev.services, service]
      }));
    }
  };

  const calculateTotal = () => {
    const serviceTotal = booking.services.reduce((sum, s) => sum + s.price, 0);
    const doorstepCharge = booking.location === 'Door Step' ? 250 : 0;
    const discount = usedPoints * 0.10;
    return Math.max(0, serviceTotal + doorstepCharge - discount);
  };

  const handleApplyPoints = () => {
    const pts = parseInt(pointsInput);
    if (isNaN(pts) || pts <= 0) return;
    if (pts > points) {
      Swal.fire({ icon: 'error', title: 'Insufficient Points', text: `You have ${points} points.` });
      return;
    }
    setUsedPoints(pts);
    Swal.fire({ icon: 'success', title: 'Points Applied', text: `₹${(pts * 0.1).toFixed(2)} savings applied!` });
  };

  const handleConfirmBooking = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    setLoading(true);
    try {
      await bookingService.createFuneralBooking({
        user_id: user.user_id,
        services: booking.services.map(s => s.name).join(", "),
        amount: calculateTotal(),
        date: booking.date,
        time: booking.time,
        payment_type: payType,
        points_used: usedPoints,
        location: booking.location,
        specialist: booking.employee?.name,
        customer_phone: booking.customerInfo.phone
      });

      if (usedPoints > 0) {
        const newPoints = points - usedPoints;
        userService.updatePoints(user.user_id, newPoints);
        setPoints(newPoints);
      }

      Swal.fire({ 
        icon: 'success', 
        title: 'Booking Confirmed', 
        text: "Our team will contact you shortly to coordinate the service." 
      });
      setCurrentStep(0);
      setBooking({
        services: [],
        location: 'Door Step',
        employee: null,
        date: '',
        time: null,
        customerInfo: { name: '', phone: '', email: '', notes: '' }
      });
      setUsedPoints(0);
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error', text: "Booking failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = (step: number) => {
    switch(step) {
      case 0: return booking.services.length > 0;
      case 1: return booking.employee !== null;
      case 2: return booking.date !== '' && booking.time !== null;
      case 3: return booking.customerInfo.name && booking.customerInfo.phone;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Header />

      <main className="pt-20 pb-24">
        {/* Cinematic Hero */}
        <section className="relative h-[80vh] md:h-[90vh] overflow-hidden mx-6 rounded-3xl">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <LazyImage src={HERO_SLIDES[currentSlide].image} alt="Hero image" className="size-full brightness-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>

          <div className="relative h-full flex items-center justify-center text-center px-6">
            <div className="max-w-4xl space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-3 text-[#D4AF37] font-bold tracking-[0.4em] text-[10px] uppercase"
              >
                <div className="size-1.5 bg-[#D4AF37]" />
                Kovais Memorial Sanctuary
                <div className="size-1.5 bg-[#D4AF37]" />
              </motion.div>

              <motion.h1 className="text-4xl sm:text-6xl md:text-9xl font-black tracking-tight serif text-white leading-[0.9] sm:leading-[0.85]">
                {HERO_SLIDES[currentSlide].title} <br />
                <span className="text-[#D4AF37] italic font-light">{HERO_SLIDES[currentSlide].titleHighlight}</span>
              </motion.h1>

              <p className="text-white/60 font-medium text-lg md:text-xl max-w-xl mx-auto">
                {HERO_SLIDES[currentSlide].desc}
              </p>

              <div className="flex flex-wrap justify-center gap-6 pt-8">
                {STATS.map((stat, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 bg-white/5 backdrop-blur-md p-6 min-w-[140px] border border-white/10">
                    <span className="text-[#D4AF37]">{stat.icon}</span>
                    <span className="text-2xl font-black text-white">{stat.value}</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Booking System */}
        <section className="max-w-7xl mx-auto px-6 mt-24">
          <div className="grid lg:grid-cols-3 gap-16">
            {/* Left: Steps & Forms */}
            <div className="lg:col-span-2 space-y-12">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-8 gap-6">
                <h2 className="serif-font text-4xl sm:text-5xl font-black uppercase tracking-tight text-white">Memorial <span className="text-[#D4AF37]">Reservation</span></h2>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4].map(s => (
                    <div key={s} className={`h-1 rounded-full transition-all duration-500 ${s <= currentStep ? 'bg-[#D4AF37] w-8' : 'bg-white/10 w-4'}`} />
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {currentStep === 0 && (
                  <motion.div 
                    key="step0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">01. Select Service Type</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button 
                          onClick={() => setBooking({...booking, location: 'Door Step'})}
                          className={`group p-6 border transition-all cursor-pointer flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden ${booking.location === 'Door Step' ? 'border-[#D4AF37] bg-[#D4AF37]/10 backdrop-blur-xl' : 'bg-white/5 backdrop-blur-md border-white/10 hover:border-[#D4AF37]/30'}`}
                        >
                          <Home className="text-[#D4AF37] shrink-0" size={32} />
                          <div className="text-center sm:text-left space-y-1">
                            <div className="font-black text-xs uppercase tracking-widest text-white">Doorstep Service</div>
                            <div className="text-[9px] font-bold text-[#D4AF37]/60 uppercase tracking-tight">+ ₹250 Convenience Fee</div>
                          </div>
                        </button>
                        <button 
                          onClick={() => setBooking({...booking, location: 'Sanctuary'})}
                          className={`group p-6 border transition-all cursor-pointer flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden ${booking.location === 'Sanctuary' ? 'border-[#D4AF37] bg-[#D4AF37]/10 backdrop-blur-xl' : 'bg-white/5 backdrop-blur-md border-white/10 hover:border-[#D4AF37]/30'}`}
                        >
                          <MapPin className="text-[#D4AF37] shrink-0" size={32} />
                          <div className="text-center sm:text-left space-y-1">
                            <div className="font-black text-xs uppercase tracking-widest text-white">At Sanctuary</div>
                            <div className="text-[9px] font-bold text-[#D4AF37]/60 uppercase tracking-tight">No Extra Charge</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">02. Choose Services</h4>
                      <div className="grid gap-4">
                        {FUNERAL_SERVICES.map(service => (
                          <div 
                            key={service.id}
                            onClick={() => handleServiceSelect(service)}
                            className={`flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 border cursor-pointer transition-all ${booking.services.find(s => s.id === service.id) ? 'border-[#D4AF37] bg-[#D4AF37]/10 backdrop-blur-xl' : 'bg-white/5 backdrop-blur-md border-white/10 hover:border-[#D4AF37]/20'}`}
                          >
                            <div className="size-24 sm:size-20 shrink-0 border border-white/10 overflow-hidden">
                              <LazyImage src={service.image} alt={service.name} className="size-full object-cover" />
                            </div>
                            <div className="flex-1 text-center sm:text-left space-y-2">
                              <h5 className="font-black text-sm uppercase tracking-tight text-white">{service.name}</h5>
                              <p className="text-[10px] text-white/50 leading-relaxed uppercase tracking-tight">{service.description}</p>
                              <div className="flex justify-center sm:justify-start gap-4 pt-1">
                                <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest bg-[#D4AF37]/10 px-2 py-1">{service.duration}</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/80 py-1">₹{service.price}</span>
                              </div>
                            </div>
                            <div className={`size-6 border shrink-0 flex items-center justify-center transition-colors ${booking.services.find(s => s.id === service.id) ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-white/20'}`}>
                              {booking.services.find(s => s.id === service.id) && <Check size={14} className="text-white" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button 
                      disabled={!isStepValid(0)}
                      onClick={() => setCurrentStep(1)}
                      className="w-full h-16 bg-[#D4AF37] text-white font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white hover:text-black transition-all duration-500 rounded-none shadow-xl"
                    >
                      Continue to Specialist <ArrowRight className="ml-2" size={16} />
                    </Button>
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                  >
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">03. Select Senior Specialist</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      {SPECIALISTS.map(emp => (
                        <div 
                          key={emp.id}
                          onClick={() => setBooking({...booking, employee: emp})}
                          className={`p-6 border transition-all flex flex-col sm:flex-row items-center gap-6 cursor-pointer ${booking.employee?.id === emp.id ? 'border-[#D4AF37] bg-[#D4AF37]/10 backdrop-blur-xl' : 'bg-white/5 backdrop-blur-md border-white/10 hover:border-[#D4AF37]/30'}`}
                        >
                          <div className="relative size-24 shrink-0">
                            <LazyImage src={emp.image} alt={emp.name} className="size-full rounded-full grayscale hover:grayscale-0 transition-all duration-500" />
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-white text-[8px] font-black px-3 py-1 uppercase rounded-none flex items-center gap-1 shadow-lg">
                              <Star size={8} fill="white" /> {emp.rating}
                            </div>
                          </div>
                          <div className="text-center sm:text-left space-y-1">
                            <h5 className="font-black text-sm uppercase tracking-[0.2em] text-white">{emp.name}</h5>
                            <p className="text-[10px] font-bold text-[#D4AF37]/60 uppercase tracking-widest">{emp.speciality}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setCurrentStep(0)} className="flex-1 h-16 rounded-none uppercase font-black tracking-widest text-[10px]">Back</Button>
                      <Button 
                        disabled={!isStepValid(1)}
                        onClick={() => setCurrentStep(2)}
                        className="flex-[2] h-16 bg-black text-white font-black uppercase tracking-widest text-[11px] hover:bg-[#D4AF37]"
                      >
                        Choose Schedule
                      </Button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-12 bg-white/5 backdrop-blur-xl p-8 border border-white/10"
                  >
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">04. Select Date</h4>
                      <input 
                        type="date" 
                        value={booking.date}
                        onChange={e => setBooking({...booking, date: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full h-16 border-b border-white/20 focus:border-[#D4AF37] bg-transparent outline-none serif-font text-3xl font-black uppercase text-white transition-colors"
                      />
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">05. Select Time Slot</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {TIME_SLOTS.map(slot => (
                          <button 
                            key={slot}
                            onClick={() => setBooking({...booking, time: slot})}
                            className={`h-12 border text-[10px] font-black uppercase tracking-widest transition-all ${booking.time === slot ? 'bg-[#D4AF37] text-white border-[#D4AF37]' : 'border-white/10 text-white/60 hover:border-[#D4AF37]/50'}`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1 h-16 rounded-none uppercase font-black tracking-widest text-[10px] border-white/20 text-white hover:bg-white/10">Back</Button>
                      <Button 
                        disabled={!isStepValid(2)}
                        onClick={() => setCurrentStep(3)}
                        className="flex-[2] h-16 bg-[#D4AF37] text-white font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white hover:text-black rounded-none shadow-xl"
                      >
                        Your Details
                      </Button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8 bg-white/5 backdrop-blur-xl p-8 border border-white/10"
                  >
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">06. Contact Information</h4>
                    <div className="grid gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Full Name</label>
                        <input 
                          value={booking.customerInfo.name}
                          onChange={e => setBooking({...booking, customerInfo: {...booking.customerInfo, name: e.target.value}})}
                          className="w-full h-14 border-b border-white/20 focus:border-[#D4AF37] outline-none font-bold text-sm bg-transparent text-white placeholder:text-white/20" 
                          placeholder="Hon. Guest Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Phone Number</label>
                        <input 
                          value={booking.customerInfo.phone}
                          onChange={e => setBooking({...booking, customerInfo: {...booking.customerInfo, phone: e.target.value}})}
                          className="w-full h-14 border-b border-white/20 focus:border-[#D4AF37] outline-none font-bold text-sm bg-transparent text-white placeholder:text-white/20" 
                          placeholder="+91 00000 00000"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Email Address</label>
                        <input 
                          value={booking.customerInfo.email}
                          onChange={e => setBooking({...booking, customerInfo: {...booking.customerInfo, email: e.target.value}})}
                          className="w-full h-14 border-b border-white/20 focus:border-[#D4AF37] outline-none font-bold text-sm bg-transparent text-white placeholder:text-white/20" 
                          placeholder="care@example.com"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1 h-16 rounded-none uppercase font-black tracking-widest text-[10px] border-white/20 text-white hover:bg-white/10">Back</Button>
                      <Button 
                        disabled={!isStepValid(3)}
                        onClick={() => setCurrentStep(4)}
                        className="flex-[2] h-16 bg-[#D4AF37] text-white font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white hover:text-black rounded-none shadow-xl"
                      >
                        Review & Confirm
                      </Button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div 
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8 bg-white/5 backdrop-blur-xl p-8 border border-white/10"
                  >
                    <div className="p-8 bg-[#D4AF37]/10 space-y-6 relative border border-[#D4AF37]/20">
                      <div className="flex items-center gap-3 border-b border-white/10 pb-6">
                        <CheckCircle className="text-[#D4AF37]" size={24} />
                        <h4 className="serif-font text-2xl font-black uppercase tracking-tight text-white">Final Summary</h4>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                          <span>Specialist</span>
                          <span className="text-white">{booking.employee?.name}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                          <span>Schedule</span>
                          <span className="text-white">{booking.date} @ {booking.time}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                          <span>Location</span>
                          <span className="text-white">{booking.location}</span>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/10 p-8 space-y-8">
                        <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                          <span className="text-xs font-black uppercase tracking-widest text-white">Total Honorarium</span>
                          <span className="text-3xl serif-font font-black text-[#D4AF37]">₹{calculateTotal()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Payment Ritual</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div 
                          onClick={() => setPayType('offline')}
                          className={`p-6 border cursor-pointer transition-all ${payType === 'offline' ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'bg-white/5 backdrop-blur-md border-white/10 hover:border-[#D4AF37]/30'}`}
                        >
                          <div className="font-black text-[10px] uppercase tracking-widest text-white">Pay at Location</div>
                        </div>
                        <div 
                          onClick={() => setPayType('online')}
                          className={`p-6 border cursor-pointer transition-all ${payType === 'online' ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'bg-white/5 backdrop-blur-md border-white/10 hover:border-[#D4AF37]/30'}`}
                        >
                          <div className="font-black text-[10px] uppercase tracking-widest text-white">Online Payment</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button variant="outline" onClick={() => setCurrentStep(3)} className="flex-1 h-16 rounded-none uppercase font-black tracking-widest text-[10px] border-white/20 text-white hover:bg-white/10">Back</Button>
                      <Button 
                        onClick={handleConfirmBooking}
                        disabled={loading}
                        className="flex-[2] h-16 bg-[#D4AF37] text-white font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white hover:text-black rounded-none shadow-xl"
                      >
                        {loading ? "Processing..." : "Complete Reservation"}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Summary & Points */}
            <div className="lg:sticky lg:top-32 space-y-8">
              <div className="bg-white/5 backdrop-blur-xl border border-[#D4AF37]/20 p-8 sm:p-12 space-y-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 size-2 border-t border-l border-[#D4AF37]" />
                <div className="absolute bottom-0 right-0 size-2 border-b border-r border-[#D4AF37]" />
                
                <h5 className="font-black text-[10px] uppercase tracking-[0.4em] border-b border-white/10 pb-6 text-[#D4AF37]">Reservation Summary</h5>
                
                <div className="space-y-4">
                  {booking.services.map(s => (
                    <div key={s.id} className="flex justify-between items-center">
                      <div className="text-[10px] font-bold uppercase tracking-tight opacity-60">{s.name}</div>
                      <div className="text-xs font-black">₹{s.price}</div>
                    </div>
                  ))}
                  {booking.location === 'Door Step' && (
                    <div className="flex justify-between items-center text-red-500">
                      <div className="text-[10px] font-bold uppercase tracking-tight">Doorstep Fee</div>
                      <div className="text-xs font-black">₹250</div>
                    </div>
                  )}
                  {usedPoints > 0 && (
                    <div className="flex justify-between items-center text-green-600">
                      <div className="text-[10px] font-bold uppercase tracking-tight">Reward Discount</div>
                      <div className="text-xs font-black">-₹{(usedPoints * 0.1).toFixed(2)}</div>
                    </div>
                  )}
                </div>

                <div className="pt-8 border-t border-white/10 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Grand Total</span>
                  <span className="text-3xl serif-font font-black text-[#D4AF37]">₹{calculateTotal()}</span>
                </div>

                {user && (
                  <div className="mt-8 p-6 bg-black text-white space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Your Credits</span>
                      <span className="text-[#D4AF37] font-black">{points} Pts</span>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        placeholder="Points" 
                        value={pointsInput}
                        onChange={e => setPointsInput(e.target.value)}
                        className="flex-1 bg-white/10 border border-white/20 h-10 px-3 text-xs outline-none focus:border-[#D4AF37]" 
                      />
                      <Button onClick={handleApplyPoints} className="bg-[#D4AF37] hover:bg-white hover:text-black h-10 px-4 text-[9px] font-black uppercase tracking-widest">Apply</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="max-w-7xl mx-auto px-6 mt-32 space-y-16">
          <div className="text-center space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">OUR ETHOS</span>
            <h2 className="text-4xl md:text-6xl font-black serif uppercase tracking-tight">Dignity in <span className="text-[#D4AF37]">Farewell</span></h2>
            <p className="text-muted-foreground text-sm font-medium max-w-xl mx-auto">We provide empathetic support and meticulous grooming to honor your loved one's final journey with absolute grace.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Heart size={24} />, title: "Compassion", desc: "Respectful guidance during difficult times." },
              { icon: <Shield size={24} />, title: "Dignity", desc: "Honoring every legacy with absolute grace." },
              { icon: <Sparkles size={24} />, title: "Excellence", desc: "Meticulous preparation by senior specialists." }
            ].map((item, i) => (
              <div key={i} className="p-10 border border-[#D4AF37]/10 bg-white/5 backdrop-blur-xl text-center space-y-6 group hover:border-[#D4AF37]/40 transition-all duration-500">
                <div className="text-[#D4AF37] flex justify-center group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
                <h4 className="font-black text-xs uppercase tracking-[0.2em] text-white">{item.title}</h4>
                <p className="text-[10px] text-white/50 font-medium uppercase tracking-tight leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {/* Login Dialog */}
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="max-w-md p-8 bg-[#0A0A0A]/95 backdrop-blur-2xl border border-[#D4AF37]/20 rounded-none shadow-2xl">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-black tracking-tight serif uppercase text-white">Memorial Access</h2>
              <p className="text-[#D4AF37]/60 text-xs font-bold uppercase tracking-widest mt-2">
                {isNewUser ? "Register for assistance" : "Verify your identity"}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#D4AF37]" />
                <input className="w-full h-12 pl-10 pr-4 bg-white/5 border border-white/10 focus:border-[#D4AF37] outline-none text-sm font-bold text-white transition-all" placeholder="Username" value={loginData.username} onChange={e => setLoginData({...loginData, username: e.target.value})} />
              </div>
              {isNewUser && (
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#D4AF37]" />
                  <input className="w-full h-12 pl-10 pr-4 bg-white/5 border border-white/10 focus:border-[#D4AF37] outline-none text-sm font-bold text-white transition-all" placeholder="Phone Number" value={loginData.phone} onChange={e => setLoginData({...loginData, phone: e.target.value})} />
                </div>
              )}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#D4AF37]" />
                <input type="password" className="w-full h-12 pl-10 pr-4 bg-white/5 border border-white/10 focus:border-[#D4AF37] outline-none text-sm font-bold text-white transition-all" placeholder="Password" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} />
              </div>
              
              <Button className="w-full h-12 bg-[#D4AF37] text-white font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all rounded-none" onClick={isNewUser ? handleSignup : handleLogin} disabled={loading}>
                {loading ? "Processing..." : isNewUser ? "Create Profile" : "Authenticate"}
              </Button>

              <div className="text-center">
                <button className="text-[10px] font-black uppercase text-[#D4AF37] hover:underline" onClick={() => setIsNewUser(!isNewUser)}>
                  {isNewUser ? "Already have a profile? Login" : "New to Kovais? Register"}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
