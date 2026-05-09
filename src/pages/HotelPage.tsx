  "use client";
  import { useState, useEffect } from "react";
  import { 
    MapPin, 
    Calendar as CalendarIcon, 
    Star, 
    Tv, 
    Wifi, 
    Coffee, 
    Utensils, 
    Wind, 
    Maximize,
    Sun,
    LocateFixed,
    RefreshCw,
    Eye,
    MessageSquare,
    ArrowRight,
    Plus,
    Minus,
    Map as MapIcon,
    Phone,
    Mail,
    Clock,
    Zap,
    Camera,
    Play,
    Pause,
    Volume2,
    VolumeX,
    ThumbsUp,
    X,
    Shield,
    Check,
    User,
    Lock
  } from "lucide-react";
  import { motion, AnimatePresence } from "framer-motion";
  import { format, differenceInDays } from "date-fns";
  import Swal from "sweetalert2";

  import { Button } from "@/components/ui/button";
  import { Calendar } from "@/components/ui/calendar";
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Badge } from "@/components/ui/badge";
  import { Header } from "@/components/header";
  import { Footer } from "@/components/footer";
  import {
    Dialog,
    DialogContent,
  } from "@/components/ui/dialog";
  import { LazyImage } from "@/components/ui/lazy-image";


  import { userService, bookingService, ROOMS } from "@/lib/data-service";

  import hotelImg from "@/assets/hotel.jpeg";
  import spaImg from "@/assets/spa.jpeg";
  import gymImg from "@/assets/gym.jpeg";
  import barberImg from "@/assets/barber.jpeg";

  import room1 from "@/assets/hotelImages/1.png";
  import room2 from "@/assets/hotelImages/2.png";
  import room3 from "@/assets/hotelImages/3.png";
  import room4 from "@/assets/hotelImages/4.png";

  // Removed duplicate useEffect import

  export default function HotelPage() {

    const [dateIn, setDateIn] = useState<Date>();
    const [dateOut, setDateOut] = useState<Date>();
    const [rooms, setRooms] = useState(1);
    const [guests, setGuests] = useState(2);
    const [showTour, setShowTour] = useState(false);
    const [showReviews, setShowReviews] = useState(false);
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
    const [purpose, setPurpose] = useState("");

    const [tourProgress, setTourProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const roomImages = [room1, room2, room3, room4];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveImageIndex((prev) => (prev + 1) % roomImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [roomImages.length]);

    const room = ROOMS[0];
    const pricePerNight = room.price;
    const nights = dateIn && dateOut ? differenceInDays(dateOut, dateIn) : 0;
    const baseTotal = rooms * pricePerNight * Math.max(nights, 1);
    const discount = usedPoints * 0.10;
    const finalTotal = baseTotal - discount;

    useEffect(() => {
      const savedUser = localStorage.getItem("loggedInUser");
      if (savedUser) {
          try {
              const u = JSON.parse(savedUser);
              if (u && u.user_id) {
                  setUser(u);
                  setPoints(userService.getPoints(u.user_id));
              }
          } catch (e) {
              console.error("Error parsing user data", e);
          }
      }
    }, []);

    useEffect(() => {
      let interval: any;
      if (showTour) {
        interval = setInterval(() => {
          setTourProgress(p => (p >= 100 ? 0 : p + 0.5));
        }, 50);
      } else {
        setTourProgress(0);
      }
      return () => clearInterval(interval);
    }, [showTour]);

    const handleBookingClick = () => {
      if (!dateIn || !dateOut) {
          Swal.fire({ icon: 'error', title: 'Selection Required', text: "Please select stay dates first" });
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
          Swal.fire({ icon: 'success', title: 'Success', text: "Welcome back, " + u.username });
      } catch (e) {
          Swal.fire({ icon: 'error', title: 'Login Failed', text: "Login failed" });
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
          Swal.fire({ icon: 'error', title: 'Error', text: "Signup failed" });
      } finally {
          setLoading(false);
      }
    };

    const handleApplyPoints = () => {
      const pts = parseInt(pointsInput);
      if (pts > points) {
          Swal.fire({ icon: 'error', title: 'Insufficient Points', text: "Not enough points" });
          return;
      }
      if (pts * 0.10 > baseTotal) {
          Swal.fire({ icon: 'error', title: 'Invalid Amount', text: "Points exceed total amount" });
          return;
      }
      setUsedPoints(pts);
      Swal.fire({ icon: 'success', title: 'Applied', text: "Points applied!" });
    };

    const handleConfirmBooking = async () => {
      setLoading(true);
      try {
          await bookingService.createHotelBooking({
              room_id: room.id,
              user_id: user.user_id,
              date_in: format(dateIn!, "yyyy-MM-dd"),
              date_out: format(dateOut!, "yyyy-MM-dd"),
              rooms,
              guests,
              total_amount: finalTotal,
              payment_type: payType,
              points_used: usedPoints,
              purpose
          });
          
          if (usedPoints > 0) {
              const newPoints = points - usedPoints;
              userService.updatePoints(user.user_id, newPoints);
              setPoints(newPoints);
          }

          setShowBookingModal(false);
          Swal.fire({ icon: 'success', title: 'Booking Confirmed!', text: "Check your email for details." });
      } catch (e) {
          Swal.fire({ icon: 'error', title: 'Error', text: "Booking failed. Please try again." });
      } finally {
          setLoading(false);
      }
    };

    const amenities = [
      { icon: Tv, label: "Smart TV" },
      { icon: Wifi, label: "High-Speed WiFi" },
      { icon: Coffee, label: "Mini Bar" },
      { icon: Utensils, label: "Room Service" },
      { icon: Maximize, label: "Balcony" },
      { icon: Wind, label: "Air Conditioning" },
    ];

    const nearby = [
      { name: "Ancient Temple", dist: "0.8km", rating: 4.7, icon: "🏛️" },
      { name: "Shopping Complex", dist: "1.2km", rating: 4.5, icon: "🛍️" },
      { name: "Nature Park", dist: "2.1km", rating: 4.9, icon: "🌳" },
      { name: "Local Market", dist: "0.5km", rating: 4.3, icon: "🏪" },
    ];

    const reviews = [
      { name: "Sarah Johnson", rating: 5, date: "2 days ago", comment: "Absolutely stunning room with amazing city views. The smart home features were impressive and the staff was incredibly helpful.", helpful: 12 },
      { name: "Michael Chen", rating: 4, date: "1 week ago", comment: "Great location and clean facilities. The eco-friendly initiatives are commendable. Would definitely stay again.", helpful: 8 },
      { name: "Emma Davis", rating: 5, date: "2 weeks ago", comment: "Perfect for business travel. The workspace was well-equipped and the WiFi was excellent throughout my stay.", helpful: 15 }
    ];

    return (
      <div className="min-h-screen bg-transparent overflow-x-hidden">
        <Header />
        
        <main className="pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto space-y-8 overflow-hidden">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold tracking-[0.2em] text-[10px] uppercase">
              <div className="size-1 bg-[#D4AF37]" />
              Gobichettipalayam - Tamil Nadu
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter serif">
              Find your perfect <span className="text-[#D4AF37] italic">retreat</span>
            </h1>
            <p className="text-muted-foreground font-medium text-lg">Curated stays with exceptional comfort</p>
          </div>

          {/* Search Bar Wrapper */}
          <div className="space-y-1">
              {/* Pricing Summary Row */}
              <AnimatePresence>
                  {dateIn && dateOut && (
                      <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                      >
                          <div className="bg-[#D4AF37] text-white px-4 md:px-8 py-4 md:py-3 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 font-black uppercase tracking-[0.1em] text-[10px] md:text-[11px] text-center md:text-left">
                              <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
                                  <span className="flex items-center gap-2"><CalendarIcon className="size-3" /> {format(dateIn, "EEE, dd MMM")} — {format(dateOut, "EEE, dd MMM")}</span>
                                  <span className="bg-black/20 px-3 py-1">{nights} Nights</span>
                              </div>
                              <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-8">
                                  <span>Rate: ₹{pricePerNight.toLocaleString()} / Night</span>
                                  <span className="text-base md:text-lg">Total Bill: <span className="text-white ml-2">₹{finalTotal.toLocaleString()}</span></span>
                              </div>
                          </div>
                      </motion.div>
                  )}
              </AnimatePresence>

              <div className="p-2 bg-card/40 backdrop-blur-xl border border-border/10 shadow-2xl relative">
                  <div className="absolute top-0 left-0 size-4 border-t border-l border-[#D4AF37]/40" />
                  <div className="absolute bottom-0 right-0 size-4 border-b border-r border-[#D4AF37]/40" />

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Location</label>
                          <div className="flex items-center gap-2 p-3 bg-background border border-border/10">
                              <MapPin className="size-4 text-[#D4AF37]" />
                              <span className="text-sm font-bold truncate">Gobichettipalayam, Erode India</span>
                          </div>
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Check-In</label>
                          <Popover>
                              <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left font-bold rounded-none border-border/10 h-12">
                                  <CalendarIcon className="mr-2 h-4 w-4 text-[#D4AF37]" />
                                  {dateIn ? format(dateIn, "PPP") : <span className="text-muted-foreground">Select date</span>}
                              </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 rounded-none border-[#D4AF37]/20" align="start">
                                  <Calendar mode="single" selected={dateIn} onSelect={setDateIn} initialFocus className="rounded-none" />
                              </PopoverContent>
                          </Popover>
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Check-Out</label>
                          <Popover>
                              <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left font-bold rounded-none border-border/10 h-12">
                                  <CalendarIcon className="mr-2 h-4 w-4 text-[#D4AF37]" />
                                  {dateOut ? format(dateOut, "PPP") : <span className="text-muted-foreground">Select date</span>}
                              </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 rounded-none border-[#D4AF37]/20" align="start">
                                  <Calendar mode="single" selected={dateOut} onSelect={setDateOut} initialFocus className="rounded-none" />
                              </PopoverContent>
                          </Popover>
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Room Type</label>
                          <Select defaultValue="deluxe">
                              <SelectTrigger className="w-full h-12 rounded-none border-border/10 font-bold">
                                  <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent className="rounded-none border-[#D4AF37]/20">
                                  <SelectItem value="deluxe">Deluxe Room</SelectItem>
                                  <SelectItem value="suite">Premium Suite</SelectItem>
                                  <SelectItem value="penthouse">Penthouse</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>
                  </div>
              </div>
          </div>

          {/* Status Bar */}
          {/* Status Bar - Super Ultimate Alignment Edition */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-1 lg:h-full lg:w-1 bg-[#D4AF37]" />
            
            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/10">
              {/* Weather */}
              <div className="flex-1 flex items-center gap-6 px-8 py-6 md:px-10">
                <div className="size-12 shrink-0 bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                  <Sun className="size-6 text-[#D4AF37]" />
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-black serif text-white leading-none">24°C</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">Clear Skies</div>
                </div>
              </div>

              {/* Nearby */}
              <div className="flex-1 flex items-center gap-6 px-8 py-6 md:px-10">
                <div className="size-12 shrink-0 bg-white/5 flex items-center justify-center border border-white/10">
                  <LocateFixed className="size-6 text-white/40" />
                </div>
                <div className="space-y-1">
                  <div className="text-base font-black text-white leading-none">4 NEARBY</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Attractions</div>
                </div>
              </div>

              {/* Updated */}
              <div className="flex-1 flex items-center gap-6 px-8 py-6 md:px-10">
                <div className="size-12 shrink-0 bg-white/5 flex items-center justify-center border border-white/10">
                  <RefreshCw className="size-6 text-white/40" />
                </div>
                <div className="space-y-1">
                  <div className="text-base font-black text-white leading-none">UPDATED</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">2 Min Ago</div>
                </div>
              </div>

              {/* Remaining Rooms - Integrated for Ultimate Balance */}
              <div className="bg-[#D4AF37] px-10 py-8 flex flex-col items-center justify-center gap-2 shadow-2xl relative min-w-[240px]">
                <div className="flex items-center gap-3">
                  <div className="size-2 rounded-full bg-white animate-pulse" />
                  <span className="text-white text-base font-black serif">10 ROOMS</span>
                </div>
                <span className="text-black/60 text-[9px] font-black uppercase tracking-[0.3em]">REMAINING TONIGHT</span>
              </div>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="w-full overflow-hidden bg-[#D4AF37]/10 border border-[#D4AF37]/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-px">
            {/* Left: Gallery */}
            <div className="w-full min-w-0 p-1 md:p-1.5 bg-background border-b lg:border-b-0 lg:border-r border-border/10">
              <div className="relative group overflow-hidden aspect-video md:aspect-[1.4/1] bg-muted/20">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImageIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 1 }}
                    className="size-full"
                  >
                    <LazyImage src={roomImages[activeImageIndex]} alt="Hotel Room" className="size-full object-cover" />
                  </motion.div>
                </AnimatePresence>
                
                <div className="absolute top-3 left-3 md:top-6 md:left-6 flex flex-col gap-2 md:gap-3">
                  <Badge className="bg-[#D4AF37] text-white rounded-none border-none text-[8px] md:text-[9px] uppercase font-black px-2 md:px-4 py-1 md:py-1.5 shadow-lg w-fit"><Zap className="size-2.5 md:size-3 mr-1.5 md:mr-2" /> Instant</Badge>
                  <Badge className="bg-white text-black rounded-none border-none text-[8px] md:text-[9px] uppercase font-black px-2 md:px-4 py-1 md:py-1.5 shadow-lg w-fit">Free Cancellation</Badge>
                </div>

                <div className="absolute bottom-3 left-3 md:bottom-10 md:left-10 space-y-0 md:space-y-1 bg-white/80 backdrop-blur-lg p-2 rounded-md">
                  <div className="text-2xl sm:text-3xl md:text-5xl font-black serif text-black drop-shadow-2xl">
                    ₹{pricePerNight.toLocaleString()}
                  </div>
                  <div className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.4em] text-black">Per Night · Deluxe</div>
                </div>

                <div className="absolute bottom-4 right-4 md:bottom-10 md:right-10 flex items-end gap-1">
                  <span className="text-2xl md:text-4xl font-black text-white/20 serif leading-none">{activeImageIndex + 1}</span>
                  <span className="text-[10px] font-bold text-white/10 pb-0.5 md:pb-1">/ {roomImages.length}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-1 md:gap-1.5 mt-1 md:mt-1.5">
                  {roomImages.map((img, i) => (
                      <div 
                        key={i} 
                        onClick={() => setActiveImageIndex(i)}
                        className={`aspect-video relative group cursor-pointer overflow-hidden transition-all duration-500 ${activeImageIndex === i ? 'border-2 border-[#D4AF37]' : 'border border-white/10 grayscale hover:grayscale-0'}`}
                      >
                          <LazyImage src={img} alt="Thumbnail" className="size-full object-cover" />
                      </div>
                  ))}
              </div>
            </div>

            {/* Right: Info & Booking */}
            <div className="w-full min-w-0 p-6 sm:p-8 md:p-12 bg-background flex flex-col justify-between">
              <div className="space-y-8">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight serif">{room.title}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold">
                      <MapPin className="size-3 text-[#D4AF37]" />
                      {room.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-[#D4AF37]/5 px-4 py-2 border border-[#D4AF37]/10">
                    <Star className="size-4 fill-[#D4AF37] text-[#D4AF37]" />
                    <span className="font-black text-sm">{room.rating}</span>
                    <span className="text-muted-foreground text-[10px] font-bold">({room.reviewCount})</span>
                  </div>
                </div>

                <div className="p-4 bg-muted/30 border-l-4 border-[#D4AF37] flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-3">
                    <Clock className="size-4 text-[#D4AF37]" />
                    Last booked {room.lastBooked}
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed font-medium">
                  {room.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {amenities.map((a) => (
                      <div key={a.label} className="flex items-center gap-3 p-3 bg-muted/20 border border-border/5">
                          <a.icon className="size-4 text-[#D4AF37]" />
                          <span className="text-[10px] font-bold uppercase tracking-tight">{a.label}</span>
                      </div>
                  ))}
                </div>

                {/* Selection Controls */}
                <div className="p-6 bg-muted/30 border border-border/10 grid grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">Rooms</label>
                      <div className="flex items-center gap-4">
                          <Button variant="outline" size="icon" className="size-8 rounded-none border-[#D4AF37]/20" onClick={() => setRooms(Math.max(1, rooms-1))}><Minus className="size-3"/></Button>
                          <span className="font-black text-xl serif w-4 text-center">{rooms}</span>
                          <Button variant="outline" size="icon" className="size-8 rounded-none border-[#D4AF37]/20" onClick={() => setRooms(rooms+1)}><Plus className="size-3"/></Button>
                      </div>
                  </div>
                  <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">Guests</label>
                      <div className="flex items-center gap-4">
                          <Button variant="outline" size="icon" className="size-8 rounded-none border-[#D4AF37]/20" onClick={() => setGuests(Math.max(1, guests-1))}><Minus className="size-3"/></Button>
                          <span className="font-black text-xl serif w-4 text-center">{guests}</span>
                          <Button variant="outline" size="icon" className="size-8 rounded-none border-[#D4AF37]/20" onClick={() => setGuests(guests+1)}><Plus className="size-3"/></Button>
                      </div>
                  </div>
                </div>

                {/* Action Bar - Re-engineered for Symmetry and Elegance */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 pt-10">
                  <Button 
                    variant="outline" 
                    className="h-16 md:h-20 rounded-none border-white/10 bg-white/5 backdrop-blur-xl font-black uppercase tracking-[0.2em] text-[9px] md:text-[10px] text-white hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition-all duration-500 group flex flex-col items-center justify-center gap-2" 
                    onClick={() => setShowTour(true)}
                  >
                    <Eye className="size-4 md:size-5 text-[#D4AF37] group-hover:scale-110 transition-transform duration-500" />
                    <span>360° Tour</span>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="h-16 md:h-20 rounded-none border-white/10 bg-white/5 backdrop-blur-xl font-black uppercase tracking-[0.2em] text-[9px] md:text-[10px] text-white hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition-all duration-500 group flex flex-col items-center justify-center gap-2" 
                    onClick={() => setShowReviews(true)}
                  >
                    <MessageSquare className="size-4 md:size-5 text-[#D4AF37] group-hover:scale-110 transition-transform duration-500" />
                    <span>Guest Reviews</span>
                  </Button>

                  <Button 
                    className="h-16 md:h-20 sm:col-span-2 lg:col-span-1 rounded-none bg-[#D4AF37] hover:bg-white text-white hover:text-[#D4AF37] font-black uppercase tracking-[0.2em] text-[9px] md:text-[10px] shadow-2xl transition-all duration-700 relative overflow-hidden group flex flex-col items-center justify-center gap-2" 
                    onClick={handleBookingClick}
                  >
                    <ArrowRight className="size-4 md:size-5 relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
                    <span className="relative z-10">Book Now</span>
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Nearby Attractions */}
          <section className="space-y-10">
              <div className="flex items-center gap-4">
                  <MapIcon className="size-6 text-[#D4AF37]" />
                  <h3 className="text-3xl font-black tracking-tight serif uppercase">Explore Nearby</h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {nearby.map((place) => (
                      <div key={place.name} className="p-8 bg-card border border-border/10 flex flex-col items-center text-center gap-4 group hover:bg-[#D4AF37]/5 transition-all duration-500 relative overflow-hidden">
                          <div className="absolute top-0 left-0 size-2 border-t border-l border-[#D4AF37]/0 group-hover:border-[#D4AF37] transition-all" />
                          <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">{place.icon}</div>
                          <div className="space-y-1">
                              <h4 className="font-black text-sm uppercase tracking-tight">{place.name}</h4>
                              <p className="text-[10px] font-bold text-muted-foreground">{place.dist}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                              <Star className="size-3 fill-[#D4AF37] text-[#D4AF37]" />
                              <span className="text-[10px] font-black">{place.rating}</span>
                          </div>
                      </div>
                  ))}
              </div>
          </section>

          {/* Map Section */}
          <div className="relative h-[600px] border border-[#D4AF37]/20 group overflow-hidden">
              <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d18554.56633963675!2d77.502998!3d11.442899!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba93fe75defff09%3A0x57385b9e1e3130cf!2sKOVAIS%20LODGE%20A%2Fc%20Rooms!5e1!3m2!1sen!2sus!4v1778110263590!5m2!1sen!2sus" width="100%" height="100%" style={{ border:0 }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="grayscale group-hover:grayscale-0 transition-all duration-1000"></iframe>
              <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 p-6 md:p-10 bg-black/80 backdrop-blur-xl border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 group-hover:border-[#D4AF37]/30 transition-all">
                  <div className="space-y-2 md:space-y-4 flex-1 text-center lg:text-left">
                      <h5 className="text-xl md:text-2xl font-black tracking-tight text-[#D4AF37] serif">Kovais (AC) Hotel</h5>
                      <p className="text-white/60 text-[10px] md:text-xs font-medium leading-relaxed max-w-sm mx-auto lg:mx-0">
                          097, SH 15, Otthekkuthirai, Gobichettipalayam, Tamil Nadu 638455
                      </p>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                      <div className="flex items-center gap-4 text-white">
                          <Phone className="size-4 text-[#D4AF37]" />
                          <span className="text-xs md:text-sm font-bold tracking-tight">9234567891</span>
                      </div>
                      <div className="flex items-center gap-4 text-white">
                          <Mail className="size-4 text-[#D4AF37]" />
                          <span className="text-xs md:text-sm font-bold tracking-tight">info@kovaisbeauty.com</span>
                      </div>
                      <Button variant="outline" className="w-full md:w-auto rounded-none border-white/20 text-white hover:bg-white/10 font-black uppercase tracking-widest text-[9px] md:text-[10px] h-10 px-6">
                          Open Maps
                      </Button>
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
                      <h2 className="text-3xl font-black tracking-tight serif uppercase">Welcome to Kovais</h2>
                      <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-2">{isNewUser ? "Create an account" : "Login to your account"}</p>
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
                          {loading ? "Processing..." : isNewUser ? "Create Account" : "Login"}
                      </Button>

                      <div className="text-center">
                          <button className="text-[10px] font-black uppercase text-[#D4AF37] hover:underline" onClick={() => setIsNewUser(!isNewUser)}>
                              {isNewUser ? "Already have an account? Login" : "Don't have an account? Sign up"}
                          </button>
                      </div>
                  </div>
              </div>
          </DialogContent>
        </Dialog>

        {/* --- Booking Modal --- */}
        <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
          <DialogContent className="max-w-2xl p-0 overflow-hidden bg-background border border-[#D4AF37]/20 rounded-none shadow-2xl">
              <div className="p-8 bg-white/40 border-b border-border/10">
                  <div className="flex items-center gap-3">
                      <Zap className="size-5 text-[#D4AF37]" />
                      <h2 className="text-2xl font-black tracking-tight serif uppercase">Complete Your Stay</h2>
                  </div>
              </div>
              
              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                  {/* Summary */}
                  <div className="p-6 bg-card border border-border/10 flex items-center justify-between">
                      <div>
                          <div className="font-black text-sm uppercase">{room.title}</div>
                          <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase mt-1">
                              <CalendarIcon className="size-3" /> {nights} Nights · <User className="size-3" /> {rooms} Room
                          </div>
                      </div>
                      <div className="text-xl font-black serif">₹{finalTotal.toLocaleString()}</div>
                  </div>

                  {/* Purpose */}
                  <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Purpose of Visit</label>
                      <input className="w-full h-12 px-4 bg-background border border-border/10 rounded-none" placeholder="Business, Leisure, Family..." value={purpose} onChange={e => setPurpose(e.target.value)} />
                  </div>

                  {/* Rewards */}
                  <div className="p-6 bg-[#D4AF37]/5 border border-[#D4AF37]/20 space-y-4">
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                              <Star className="size-4 text-[#D4AF37] fill-[#D4AF37]" />
                              <span className="text-xs font-black uppercase tracking-tight">Use Rewards</span>
                          </div>
                          <span className="text-[10px] font-bold text-muted-foreground">{points} pts available</span>
                      </div>
                      <div className="flex gap-4">
                          <input className="flex-1 h-12 px-4 bg-white border border-border/10 rounded-none" placeholder="Enter points" value={pointsInput} onChange={e => setPointsInput(e.target.value)} />
                          <Button className="h-12 bg-black text-white px-8 rounded-none font-black text-[10px] uppercase" onClick={handleApplyPoints}>Apply</Button>
                      </div>
                      {usedPoints > 0 && <div className="text-[10px] font-bold text-green-600 flex items-center gap-2"><Check className="size-3" /> ₹{discount} discount applied</div>}
                  </div>

                  {/* Payment */}
                  <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Payment Method</label>
                      <div className="grid grid-cols-2 gap-4">
                          <div className={`p-4 border cursor-pointer flex items-center gap-4 transition-all ${payType === 'offline' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'bg-white border-border/10'}`} onClick={() => setPayType('offline')}>
                              <Clock className="size-6 text-[#D4AF37]" />
                              <div>
                                  <div className="font-black text-xs">Pay at Hotel</div>
                                  <div className="text-[9px] font-bold opacity-60">Reserve now, pay later</div>
                              </div>
                          </div>
                          <div className={`p-4 border cursor-pointer flex items-center gap-4 transition-all ${payType === 'online' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'bg-white border-border/10'}`} onClick={() => setPayType('online')}>
                              <Zap className="size-6 text-[#D4AF37]" />
                              <div>
                                  <div className="font-black text-xs">Pay Now</div>
                                  <div className="text-[9px] font-bold opacity-60">Instant confirmation</div>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="flex items-center justify-center gap-8 opacity-40 grayscale py-4">
                      <div className="flex items-center gap-2 text-[10px] font-black"><Shield className="size-3" /> Secure</div>
                      <div className="flex items-center gap-2 text-[10px] font-black"><Clock className="size-3" /> Free Cancel</div>
                      <div className="flex items-center gap-2 text-[10px] font-black"><Check className="size-3" /> Verified</div>
                  </div>
              </div>

              <div className="p-8 bg-white border-t border-border/10">
                  <Button className="w-full h-14 bg-[#D4AF37] hover:bg-[#B8962E] text-white font-black uppercase tracking-widest text-[11px]" onClick={handleConfirmBooking} disabled={loading}>
                      {loading ? "Confirming..." : `Confirm Booking · ₹${finalTotal.toLocaleString()}`}
                  </Button>
              </div>
          </DialogContent>
        </Dialog>

        {/* --- Other Modals (Tour, Reviews) same as before --- */}
        <Dialog open={showTour} onOpenChange={setShowTour}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border border-[#D4AF37]/20 rounded-none shadow-2xl">
            <div className="p-6 flex items-center justify-between bg-transparent">
              <div className="flex items-center gap-3">
                <Camera className="size-5 text-[#B8962E]" />
                <span className="font-bold text-lg serif">360° Virtual Tour — {room.title}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowTour(false)} className="rounded-full">
                <X className="size-5" />
              </Button>
            </div>
            <div className="relative aspect-video mx-4">
              <LazyImage src={hotelImg} alt="Tour View" className="w-full h-full rounded-xl" />
              <div className="absolute bottom-6 left-6 flex gap-4">
                <Button size="icon" variant="secondary" className="rounded-full size-12 bg-white/80 backdrop-blur-md" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause className="size-6" /> : <Play className="size-6 ml-1" />}
                </Button>
                <Button size="icon" variant="secondary" className="rounded-full size-12 bg-white/80 backdrop-blur-md" onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <VolumeX className="size-6" /> : <Volume2 className="size-6" />}
                </Button>
              </div>
            </div>
            <div className="p-8 space-y-4">
              <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#B8962E] transition-all duration-300" style={{ width: `${tourProgress}%` }} />
              </div>
              <div className="flex items-center justify-between text-[13px] font-bold text-muted-foreground uppercase tracking-wider">
                <span>Tour Progress</span>
                <span>{Math.floor(tourProgress)}%</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showReviews} onOpenChange={setShowReviews}>
          <DialogContent className="max-w-3xl p-0 overflow-hidden bg-background border border-[#D4AF37]/20 rounded-none shadow-2xl">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="size-5 text-[#B8962E]" />
                <span className="font-bold text-lg serif">Guest Reviews</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowReviews(false)} className="rounded-full">
                <X className="size-5" />
              </Button>
            </div>
            <div className="px-8 pb-8 space-y-8 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center gap-12 p-8 bg-white/40 rounded-2xl">
                <div className="text-center space-y-2">
                  <div className="size-24 rounded-full bg-[#B8962E] flex flex-col items-center justify-center text-white">
                    <span className="text-3xl font-black serif">{room.rating}</span>
                    <div className="flex gap-0.5"><Star className="size-2 fill-white text-white" /></div>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-4">
                      <span className="text-sm font-black w-3">{rating}</span>
                      <Star className="size-3 fill-[#B8962E] text-[#B8962E]" />
                      <div className="flex-1 h-2 bg-black/5 rounded-full overflow-hidden"><div className="h-full bg-[#B8962E]" style={{ width: `${rating === 5 ? 85 : 10}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {reviews.map((rev, i) => (
                  <div key={i} className="p-6 bg-white/40 border border-white/20 rounded-2xl space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-full bg-[#B8962E]/10 flex items-center justify-center font-black text-[#B8962E]">{rev.name[0]}</div>
                        <div>
                          <div className="font-black text-sm">{rev.name}</div>
                          <div className="text-[10px] font-bold text-muted-foreground uppercase">{rev.date}</div>
                        </div>
                    </div>
                    <p className="text-sm font-medium leading-relaxed italic">"{rev.comment}"</p>
                    <Button variant="outline" size="sm" className="h-8 rounded-full border-[#B8962E]/20 text-[10px] font-black uppercase text-[#B8962E]">
                      <ThumbsUp className="size-3 mr-2" /> Helpful ({rev.helpful})
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
