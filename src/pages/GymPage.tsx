"use client";
import { useState, useEffect } from "react";
import { 
  Star, 
  Clock, 
  User, 
  ArrowRight,
  Users,
  Zap,
  Check,
  Lock,
  Phone,
  Dumbbell,
  Shield,
  Trophy,
  Activity,
  Heart,
  Sparkles,
  Award,
  Calendar as CalendarIcon,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { format } from "date-fns";

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

import { userService, bookingService, GYM_PLANS } from "@/lib/data-service";

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80",
    title: "Forge Your",
    titleHighlight: "Ultimate Self",
    desc: "Luxury is the discipline of self-improvement. Our sanctuary of strength provides the elite environment for your transformation."
  },
  {
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80",
    title: "Precision",
    titleHighlight: "Performance Lab",
    desc: "World-class biomechanics meet premium amenities. Every rep counts in our meticulously curated space."
  },
  {
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80",
    title: "Mastery in",
    titleHighlight: "Every Movement",
    desc: "Guided by elite trainers, powered by high-end technology. Achieve results that redefine your personal standards."
  }
];

const STATS = [
  { icon: <Users className="size-6" />, value: "500+", label: "Happy Members" },
  { icon: <Trophy className="size-6" />, value: "3+", label: "Years Experience" },
  { icon: <Activity className="size-6" />, value: "24/7", label: "Support" },
  { icon: <Dumbbell className="size-6" />, value: "Gold", label: "Global Standard" }
];

const WHY_CHOOSE_GYM = [
  { icon: <Dumbbell size={24} />, title: 'Modern Equipment', desc: 'State-of-the-art fitness equipment for all your workout needs.' },
  { icon: <Users size={24} />, title: 'Expert Trainers', desc: 'Certified personal trainers to guide your fitness journey.' },
  { icon: <Clock size={24} />, title: 'Flexible Hours', desc: 'Extended operating hours to fit your busy schedule.' },
  { icon: <Award size={24} />, title: 'Premium Quality', desc: 'Top-notch facilities with attention to hygiene and safety.' },
];

const SUCCESS_STORIES = [
  {
    name: "Rajesh Kumar",
    achievement: "Lost 25kg in 6 months",
    image: "https://img.freepik.com/free-photo/portrait-handsome-smiling-stylish-young-man-model-dressed-red-checkered-shirt-fashion-man-posing_158538-4909.jpg",
    testimonial: "KOVAIS Gym transformed my life completely. The trainers are amazing!"
  },
  {
    name: "Priya Sharma",
    achievement: "Built muscle & strength",
    image: "https://img.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg",
    testimonial: "Best gym in town! Great equipment and supportive environment."
  },
  {
    name: "Arjun Patel",
    achievement: "Marathon runner now",
    image: "https://img.freepik.com/free-photo/handsome-confident-smiling-man-with-hands-hips_176420-18743.jpg",
    testimonial: "Started from zero fitness level, now I'm running marathons!"
  }
];

const TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM",
];

const GENDERS = [
  { id: 'Men', label: 'Men', image: 'https://img.freepik.com/free-photo/strong-man-training-gym_23-2148108576.jpg' },
  { id: 'Women', label: 'Women', image: 'https://img.freepik.com/premium-photo/girl-red-shirt-stands-front-window-with-sun-shining-through-window_427757-32950.jpg' }
];

const AGE_GROUPS = [
  { id: 'Under 18', label: 'Under 18', image: 'https://img.freepik.com/free-photo/children-sport_23-2148108576.jpg' },
  { id: 'Above 20', label: 'Above 20', image: 'https://img.freepik.com/free-photo/medium-shot-people-training-with-kettlebells_23-2149307721.jpg' },
  { id: 'Above 30', label: 'Above 30', image: 'https://img.freepik.com/free-photo/group-happy-people-standing-against-wall-gym_23-2147949689.jpg' }
];

export default function GymPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

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

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    if (!selectedGender || !selectedAge || !selectedDate || !selectedTime) {
      Swal.fire({ 
        icon: 'warning', 
        title: 'Incomplete Selection', 
        text: 'Please select gender, age group, date, and time slot first.',
        confirmButtonColor: '#D4AF37'
      });
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
      Swal.fire({ icon: 'success', title: 'Athletic Verification', text: "Your path to performance is ready" });
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
      Swal.fire({ icon: 'success', title: 'Athlete Profile Created', text: "Begin your training journey today." });
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
      Swal.fire({ icon: 'error', title: 'Insufficient Rewards', text: "You don't have enough reward points" });
      return;
    }
    setUsedPoints(pts);
    Swal.fire({ icon: 'success', title: 'Applied', text: `₹${(pts * 0.1).toFixed(2)} savings applied!` });
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const discount = usedPoints * 0.10;
      const finalTotal = Math.max(0, selectedPlan.price - discount);
      
      await bookingService.createGymBooking({
        user_id: user.user_id,
        plan: selectedPlan.duration,
        gender: selectedGender,
        age: selectedAge,
        date: format(selectedDate!, "yyyy-MM-dd"),
        time: selectedTime,
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
      Swal.fire({ icon: 'success', title: 'Membership Acquired', text: "Your journey to greatness begins today." });
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error', text: "Membership acquisition failed." });
    } finally {
      setLoading(false);
    }
  };

  const discount = usedPoints * 0.10;
  const finalTotal = selectedPlan ? Math.max(0, selectedPlan.price - discount) : 0;

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
                Kovais Performance Lab
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
                  onClick={() => document.getElementById('gender-selection')?.scrollIntoView({ behavior: 'smooth' })}
                  className="h-16 px-12 bg-[#D4AF37] hover:bg-white hover:text-black text-white font-black uppercase tracking-widest text-[11px] rounded-none transition-all duration-500"
                >
                  Start Your Journey
                </Button>
                <Button 
                  onClick={() => document.getElementById('success-stories')?.scrollIntoView({ behavior: 'smooth' })}
                  className="h-16 px-12 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white hover:text-black text-white font-black uppercase tracking-widest text-[11px] rounded-none transition-all duration-500"
                >
                  View Success Stories
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
                {['BIOMECHANICS', 'HYPERTROPHY', 'STRENGTH LAB', 'RECOVERY SUITE', 'NUTRITION BAR', 'ELITE COACHING'].map((item, i) => (
                  <span key={i} className="text-white/40 text-[10px] font-black tracking-[0.5em] flex items-center gap-4 uppercase">
                    <span className="text-[#D4AF37]">◆</span> {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Stats Strip */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-background border border-[#D4AF37]/10 p-10 text-center hover:border-[#D4AF37]/30 transition-all shadow-sm"
            >
              <div className="text-[#D4AF37] mb-6 flex justify-center scale-125">{stat.icon}</div>
              <div className="text-4xl font-black serif mb-2">{stat.value}</div>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-40">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Essential Content: Gender Selection */}
        <section className="max-w-7xl mx-auto px-6 space-y-16" id="gender-selection">
          <div className="text-center space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">STEP ONE</span>
            <h2 className="serif-font text-4xl md:text-6xl font-black uppercase tracking-tight">Select Your <span className="text-[#D4AF37] italic">Category</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {GENDERS.map((g) => (
              <motion.div 
                key={g.id}
                whileHover={{ y: -10 }}
                onClick={() => {
                  setSelectedGender(g.id);
                  document.getElementById('age-selection')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`relative aspect-[16/10] overflow-hidden border cursor-pointer transition-all duration-500 ${selectedGender === g.id ? 'border-[#D4AF37] shadow-2xl' : 'border-[#D4AF37]/10 grayscale hover:grayscale-0'}`}
              >
                <img src={g.image} alt={g.label} className="size-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight">{g.label}</h3>
                  {selectedGender === g.id && <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-widest">SELECTED CATEGORY</span>}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Essential Content: Age Selection */}
        <section className="max-w-7xl mx-auto px-6 space-y-16" id="age-selection">
          <div className="text-center space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">STEP TWO</span>
            <h2 className="serif-font text-4xl md:text-6xl font-black uppercase tracking-tight">Your <span className="text-[#D4AF37] italic">Age Group</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {AGE_GROUPS.map((a) => (
              <motion.div 
                key={a.id}
                whileHover={{ y: -10 }}
                onClick={() => {
                  setSelectedAge(a.id);
                  document.getElementById('schedule-selection')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`relative aspect-square overflow-hidden border cursor-pointer transition-all duration-500 ${selectedAge === a.id ? 'border-[#D4AF37] shadow-2xl' : 'border-[#D4AF37]/10 grayscale hover:grayscale-0'}`}
              >
                <img src={a.image} alt={a.label} className="size-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">{a.label}</h3>
                  {selectedAge === a.id && <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-widest">SELECTED GROUP</span>}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Essential Content: Schedule (Date/Time) */}
        <section className="max-w-7xl mx-auto px-6 space-y-16" id="schedule-selection">
          <div className="text-center space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">STEP THREE</span>
            <h2 className="serif-font text-4xl md:text-6xl font-black uppercase tracking-tight">Choose Your <span className="text-[#D4AF37] italic">Schedule</span></h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 bg-background border border-[#D4AF37]/10 p-12">
            <div className="space-y-8">
              <h4 className="text-xl font-black serif uppercase tracking-tight border-b border-[#D4AF37]/20 pb-4">1. Select Start Date</h4>
              <Calendar 
                mode="single" 
                selected={selectedDate} 
                onSelect={setSelectedDate} 
                className="rounded-none border-none scale-110 origin-top-left"
                disabled={(date) => date < new Date()}
              />
            </div>
            <div className="space-y-8">
              <h4 className="text-xl font-black serif uppercase tracking-tight border-b border-[#D4AF37]/20 pb-4">2. Preferred Training Window</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {TIME_SLOTS.map((slot) => (
                  <button 
                    key={slot}
                    onClick={() => {
                      setSelectedTime(slot);
                      document.getElementById('membership-plans')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`h-14 text-[10px] font-black border transition-all ${selectedTime === slot ? 'bg-[#D4AF37] text-white border-[#D4AF37]' : 'border-[#D4AF37]/10 hover:border-[#D4AF37]/50 text-muted-foreground'}`}
                  >
                    <Clock size={12} className="inline mr-2" /> {slot}
                  </button>
                ))}
              </div>
              <div className="p-6 bg-[#D4AF37]/5 border border-[#D4AF37]/20">
                <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed opacity-60">
                  <Activity size={12} className="inline mr-2 text-[#D4AF37]" /> Note: Time slots help us manage gym capacity. You have 24/7 access with any premium membership, but we recommend scheduling for peak support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Membership Plans */}
        <section className="max-w-7xl mx-auto px-6 space-y-24" id="membership-plans">
          <div className="text-center space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">FINAL STEP</span>
            <h2 className="serif-font text-4xl md:text-6xl font-black tracking-tight uppercase leading-tight">Choose Your <span className="text-[#D4AF37] italic">Membership Plan</span></h2>
            <p className="text-muted-foreground font-medium max-w-2xl mx-auto">Choose the commitment that aligns with your performance goals.</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {GYM_PLANS.map((plan, idx) => (
              <motion.div 
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`group relative bg-background border ${idx === 3 ? 'border-[#D4AF37] scale-105 z-10 p-10 shadow-2xl' : 'border-[#D4AF37]/10 p-8 hover:border-[#D4AF37]/30'} transition-all duration-500 flex flex-col`}
              >
                {idx === 3 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-white px-6 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] shadow-lg">
                    BEST VALUE
                  </div>
                )}
                
                <div className="mb-10 space-y-3">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 block">{plan.duration} Commitment</span>
                  <h3 className="serif-font text-3xl font-black">{plan.duration} Access</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl serif-font font-black text-[#D4AF37]">₹{plan.price}</span>
                    <span className="text-[9px] font-black opacity-30 uppercase tracking-widest">Global Status</span>
                  </div>
                </div>

                <div className="space-y-4 mb-12 flex-grow">
                  {plan.features.map((f: string) => (
                    <div key={f} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-tight">
                      <Check className="text-[#D4AF37] size-3 shrink-0" />
                      <span className="opacity-80 leading-tight">{f}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full h-14 rounded-none font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500 flex items-center justify-center gap-3 ${idx === 3 ? 'bg-black text-white hover:bg-[#D4AF37]' : 'bg-white border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white'}`}
                >
                  {selectedPlan?.id === plan.id ? 'Selected' : 'Choose Plan'} <ArrowRight size={14} />
                </Button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">THE MASTERY</span>
            <h2 className="text-4xl md:text-6xl font-black serif uppercase tracking-tight">Why Choose <span className="text-[#D4AF37]">KOVAIS Gym?</span></h2>
            <p className="text-muted-foreground text-sm font-medium max-w-xl mx-auto">Experience fitness like never before with our premium facilities and expert guidance.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {WHY_CHOOSE_GYM.map((item, i) => (
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

        {/* Essential Content: Success Stories */}
        <section className="max-w-7xl mx-auto px-6 space-y-16" id="success-stories">
          <div className="text-center space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">TESTIMONIALS</span>
            <h2 className="serif-font text-4xl md:text-6xl font-black uppercase tracking-tight">Success <span className="text-[#D4AF37] italic">Stories</span></h2>
            <p className="text-muted-foreground font-medium max-w-2xl mx-auto">Real transformations from our amazing members.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {SUCCESS_STORIES.map((story, i) => (
              <motion.div 
                key={story.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background border border-[#D4AF37]/10 p-10 space-y-6 hover:shadow-2xl transition-all"
              >
                <div className="relative aspect-square overflow-hidden mb-6">
                  <img src={story.image} alt={story.name} className="size-full object-cover grayscale brightness-75" />
                  <div className="absolute top-4 right-4 bg-[#D4AF37] text-white px-3 py-1 text-[8px] font-black uppercase tracking-widest">{story.achievement}</div>
                </div>
                <div className="space-y-4 text-center">
                  <div className="flex justify-center gap-1 text-[#D4AF37]">
                    {[...Array(5)].map((_, j) => <Star key={j} size={10} fill="#D4AF37" />)}
                  </div>
                  <p className="text-[11px] font-medium italic opacity-60 leading-relaxed">"{story.testimonial}"</p>
                  <h4 className="font-black text-xs uppercase tracking-widest">— {story.name}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Philosophy Strip */}
        <section className="bg-black py-40 overflow-hidden relative mx-6">
          <div className="absolute top-0 right-0 size-[600px] bg-[#D4AF37]/5 blur-[120px] rounded-full -mr-64 -mt-64" />
          <div className="max-w-4xl mx-auto px-6 text-center space-y-12 relative z-10">
            <Zap size={48} className="text-[#D4AF37] mx-auto opacity-50" />
            <h2 className="serif-font text-5xl md:text-7xl text-white font-black leading-tight uppercase tracking-tighter">"Ready to Transform <br />Your Life?"</h2>
            <p className="text-white/60 text-lg font-medium leading-relaxed italic">
              Join hundreds of satisfied members who have achieved their fitness goals at KOVAIS Gym.
            </p>
            <div className="flex justify-center gap-12 pt-6">
              <Button 
                onClick={() => document.getElementById('membership-plans')?.scrollIntoView({ behavior: 'smooth' })}
                className="h-16 px-16 bg-[#D4AF37] hover:bg-white hover:text-black text-white font-black uppercase tracking-widest text-[11px] rounded-none transition-all duration-500"
              >
                Proceed to Join
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* --- Login Modal --- */}
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="max-w-md p-8 bg-[#F7F7F7] border-none rounded-2xl shadow-2xl">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-black tracking-tight serif uppercase">Athlete Verification</h2>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-2">
                {isNewUser ? "Join the ranks of elite" : "Identify your status"}
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
                  {isNewUser ? "Athlete already? Login" : "New here? Begin training"}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- Booking Modal --- */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-[#F7F7F7] border-none rounded-2xl shadow-2xl">
          <div className="p-8 bg-white border-b border-[#D4AF37]/10">
            <div className="flex items-center gap-3">
              <Trophy className="size-5 text-[#D4AF37]" />
              <h2 className="text-2xl font-black tracking-tight serif uppercase">Confirm Membership</h2>
            </div>
          </div>
          
          <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
            <div className="p-6 bg-white border border-border/5 space-y-4">
              <div className="flex justify-between items-center border-b border-border/5 pb-2">
                <div className="font-black text-[10px] uppercase tracking-tight">{selectedPlan?.duration} Unlimited Access</div>
                <div className="font-black text-sm serif">₹{selectedPlan?.price}</div>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <Activity className="size-3" /> Start: {selectedDate ? format(selectedDate, "PPP") : 'Today'} · {selectedTime}
                </div>
                <div className="text-xl font-black serif text-[#D4AF37]">₹{finalTotal.toLocaleString()}</div>
              </div>
              <div className="pt-2 grid grid-cols-2 gap-4">
                <div className="text-[9px] font-black uppercase opacity-40">Category: {selectedGender}</div>
                <div className="text-[9px] font-black uppercase opacity-40">Age Group: {selectedAge}</div>
              </div>
            </div>

            <div className="p-6 bg-[#D4AF37]/5 border border-[#D4AF37]/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="size-4 text-[#D4AF37] fill-[#D4AF37]" />
                  <span className="text-xs font-black uppercase tracking-tight">Apply Reward Points</span>
                </div>
                <span className="text-[10px] font-bold text-muted-foreground">{points} pts available</span>
              </div>
              <div className="flex gap-4">
                <input className="flex-1 h-12 px-4 bg-white border border-border/10 rounded-none focus:outline-none focus:border-[#D4AF37]" placeholder="Enter points" value={pointsInput} onChange={e => setPointsInput(e.target.value)} />
                <Button className="h-12 bg-black text-white px-8 rounded-none font-black text-[10px] uppercase" onClick={handleApplyPoints}>Apply</Button>
              </div>
              {usedPoints > 0 && <div className="text-[10px] font-bold text-green-600 flex items-center gap-2"><Check className="size-3" /> ₹{discount.toFixed(2)} savings applied</div>}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Payment Ritual</label>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-5 border cursor-pointer flex items-center gap-4 transition-all ${payType === 'offline' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'bg-white border-border/10'}`} onClick={() => setPayType('offline')}>
                  <Clock className="size-6 text-[#D4AF37]" />
                  <div>
                    <div className="font-black text-xs uppercase tracking-tight">At Front Desk</div>
                    <div className="text-[9px] font-bold opacity-60">Pay on first visit</div>
                  </div>
                </div>
                <div className={`p-5 border cursor-pointer flex items-center gap-4 transition-all ${payType === 'online' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'bg-white border-border/10'}`} onClick={() => setPayType('online')}>
                  <Zap className="size-6 text-[#D4AF37]" />
                  <div>
                    <div className="font-black text-xs uppercase tracking-tight">Pay Online</div>
                    <div className="text-[9px] font-bold opacity-60">Priority activation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-white border-t border-border/10">
            <Button className="w-full h-16 bg-[#D4AF37] hover:bg-[#B8962E] text-white font-black uppercase tracking-widest text-[11px]" onClick={handleConfirmBooking} disabled={loading}>
              {loading ? "Activating Plan..." : `Acquire Membership · ₹${finalTotal.toLocaleString()}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
