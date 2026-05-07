import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Row, Col, Modal, Button, Tab, Tabs, Form } from 'react-bootstrap';
import { 
  FaStar, FaPhoneAlt, FaMapMarkerAlt,
  FaFacebook, FaInstagram, FaTwitter
} from 'react-icons/fa';
import { FaScissors } from "react-icons/fa6";
import Swal from "sweetalert2";
import {
  Menu, User, Check, MapPin, Home, X
} from "lucide-react";

import "./LuxuryBarber.css";
import { PaymentPage, ConfirmationPage } from "../components/Payment";
import { userService, bookingService } from "@/lib/data-service";

const LuxuryBarber = ({ setUser, points, setPoints }: any) => {
  // Navigation State
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDemoPayment, setShowDemoPayment] = useState(false);
  const [showDemoConfirmation, setShowDemoConfirmation] = useState(false);
  const [demoPaymentResult, setDemoPaymentResult] = useState<any>(null);
  
  const [userData, setUserData] = useState({
    username: "",
    phone_number: "",
    password: ""
  });
  
  const [booking, setBooking] = useState<any>({
    services: [],
    location: 'salon',
    employee: null,
    date: '',
    time: null,
    customerInfo: {
      name: '',
      phone: '',
      email: '',
      notes: ''
    }
  });
  const [currentStep, setCurrentStep] = useState(0);

  // Hero Slides
  const slides = [
    {
      title: "The Art of Perfection",
      subtitle: "Est. 1995",
      description: "Experience the pinnacle of grooming where tradition meets modern excellence. Our master barbers define the standard of luxury.",
      image: "https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg",
    },
    {
      title: "Master Craftsmen",
      subtitle: "Precision & Style",
      description: "Every cut is a masterpiece, every shave a ritual. Trust your image to the hands of seasoned experts.",
      image: "https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg",
    }
  ];

  const services = [
    { id: 'm1', category: 'Men', name: 'Royal Gentleman Cut', description: 'Precision scissor cut with signature hot towel finish', price: 1200, image: 'https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg', duration: '45 min' },
    { id: 'm2', category: 'Men', name: 'Imperial Beard Ritual', description: 'Traditional straight razor shave and sculpt', price: 800, image: 'https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg', duration: '40 min' },
    { id: 'm3', category: 'Men', name: 'The Executive Package', description: 'Full haircut, beard trim, and facial massage', price: 2500, image: 'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg', duration: '90 min' },
    { id: 'w1', category: 'Women', name: 'Signature Sculpt', description: 'Premium cut and luxury styling', price: 3500, image: 'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg', duration: '90 min' },
  ];

  const employees = [
    { id: 'emp1', name: 'Julian Rossi', speciality: 'Master Barber', rating: 4.9, categories: ['Men'] },
    { id: 'emp2', name: 'Elena Vance', speciality: 'Senior Stylist', rating: 4.8, categories: ['Women'] },
  ];

  const timeSlots = ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM'];

  // Logic Handlers
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleServiceSelect = (service: any) => {
    if (!selectedCategory) setSelectedCategory(service.category);
    const isSelected = booking.services.some((s: any) => s.id === service.id);
    if (isSelected) {
      setBooking((prev: any) => ({ ...prev, services: prev.services.filter((s: any) => s.id !== service.id) }));
    } else {
      setBooking((prev: any) => ({ ...prev, services: [...prev.services, service] }));
    }
  };

  const calculateTotal = () => {
    const serviceTotal = booking.services.reduce((sum: number, service: any) => sum + service.price, 0);
    const doorstepCharge = booking.location === 'doorstep' ? 500 : 0;
    return serviceTotal + doorstepCharge;
  };

  useEffect(() => {
    setAmount(calculateTotal());
  }, [booking.services, booking.location]);

  const handlePayment = () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      setShowLoginModal(true);
      return;
    }
    setShowDemoPayment(true);
  };

  const handleDemoPaymentSuccess = async (result: any) => {
    setDemoPaymentResult(result);
    setShowDemoPayment(false);
    
    // Create static booking
    await bookingService.createBarberBooking({
        ...booking,
        amount: amount,
        transactionId: result.transactionId
    });

    setTimeout(() => setShowDemoConfirmation(true), 500);
  };

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (isNewUser) {
        await userService.signup(userData.username, userData.phone_number, userData.password);
        setIsNewUser(false);
        Swal.fire({ icon: "success", title: "Account Created!", text: "Please sign in to continue.", timer: 2000, showConfirmButton: false });
      } else {
        const user = await userService.login(userData.username, userData.password);
        setUser(user);
        setPoints(user.points);
        setShowLoginModal(false);
        Swal.fire({ icon: "success", title: "Welcome back!", timer: 1500, showConfirmButton: false });
        setShowDemoPayment(true);
      }
    } catch (e) {
      Swal.fire({ icon: "error", title: "Authentication Failed", text: "Please check your credentials." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="luxury-barber-page">
      {/* Navbar */}
      <nav className={`fixed-top px-4 py-3 transition-all duration-500 ${scrolled ? 'bg-onyx shadow-2xl border-b border-glass-border' : 'bg-transparent'}`}>
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <FaScissors className="text-gold h4 mb-0" />
            <span className="serif-font h3 mb-0 tracking-widest text-gold uppercase">BARBERCRAFT</span>
          </div>
          
          <div className="d-none d-lg-flex gap-5 align-items-center">
            {['Home', 'Services', 'Booking', 'About'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="nav-link-custom">{item}</a>
            ))}
            <button onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })} className="btn-luxury">Book Appointment</button>
          </div>

          <button className="d-lg-none text-gold border-0 bg-transparent" onClick={() => setIsNavOpen(!isNavOpen)}>
            <Menu size={24} />
          </button>
        </div>

        <AnimatePresence>
          {isNavOpen && (
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              className="fixed inset-0 bg-onyx z-50 p-5 d-flex flex-column gap-4 justify-content-center align-items-center"
              style={{ top: 0, height: '100vh' }}
            >
              <button className="absolute top-10 right-10 text-gold border-0 bg-transparent" onClick={() => setIsNavOpen(false)}>
                <X size={32} />
              </button>
              {['Home', 'Services', 'Booking', 'About'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="h2 serif-font text-gold text-decoration-none" onClick={() => setIsNavOpen(false)}>{item}</a>
              ))}
              <button onClick={() => { setIsNavOpen(false); document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }); }} className="btn-luxury mt-4">Book Now</button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <header id="home" className="hero-section">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="hero-bg"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          />
        </AnimatePresence>
        <div className="hero-overlay" />
        <div className="hero-content container">
          <motion.span initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} className="hero-tagline">{slides[currentSlide].subtitle}</motion.span>
          <motion.h1 initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="hero-title serif-font">{slides[currentSlide].title}</motion.h1>
          <motion.p initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="hero-description">{slides[currentSlide].description}</motion.p>
          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <button onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })} className="btn-luxury">Reserve Your Spot</button>
            <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="btn-outline-luxury">View Services</button>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section id="services" className="section-padding">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-gold uppercase tracking-widest text-xs mb-3 d-block">Curated Grooming</span>
            <h2 className="display-4 serif-font mb-0">Our Signature Rituals</h2>
            <div className="divider" />
          </div>

          <div className="d-flex justify-content-center gap-3 mb-5 flex-wrap">
            {['salon', 'doorstep'].map(loc => (
              <button key={loc} onClick={() => setBooking({...booking, location: loc})} className={`px-4 py-3 border transition-all uppercase tracking-widest text-xs font-bold ${booking.location === loc ? 'border-gold bg-gold text-onyx' : 'border-glass-border text-gold hover:border-gold'}`}>
                {loc === 'salon' ? <MapPin className="inline mr-2" size={14} /> : <Home className="inline mr-2" size={14} />}
                {loc} Service
              </button>
            ))}
          </div>

          <Row className="g-4">
            {services.map((service) => (
              <Col lg={4} md={6} key={service.id}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`luxury-card ${booking.services.some((s:any) => s.id === service.id) ? 'border-gold' : ''}`}>
                  <div className="overflow-hidden"><img src={service.image} className="card-img-top" alt={service.name} /></div>
                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <h4 className="serif-font mb-2">{service.name}</h4>
                    <p className="text-muted small mb-4">{service.description}</p>
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <div>
                        <span className="h4 text-gold mb-0">₹{service.price}</span>
                        <div className="text-xs text-muted mt-1 uppercase tracking-tighter">{service.duration}</div>
                      </div>
                      <button onClick={() => handleServiceSelect(service)} className={`btn-luxury ${booking.services.some((s:any) => s.id === service.id) ? '' : 'btn-outline-luxury'}`} style={{ padding: '8px 20px', fontSize: '9px' }}>
                        {booking.services.some((s:any) => s.id === service.id) ? 'Added' : 'Add to Ritual'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Booking Stepper */}
      <section id="booking" className="section-padding bg-charcoal">
        <div className="container">
          <div className="text-center mb-5"><h2 className="display-4 serif-font">Secure Your Ritual</h2><div className="divider" /></div>
          <div className="max-w-4xl mx-auto bg-onyx border border-glass-border p-4 p-md-5 shadow-2xl">
            <div className="booking-stepper">
              {['Service', 'Specialist', 'Schedule', 'Confirm'].map((step, i) => (
                <div key={step} className={`step-item ${currentStep >= i ? 'active' : ''}`}>
                  <div className="step-dot">{currentStep > i ? <Check size={14} /> : i + 1}</div>
                  <span className="d-none d-md-block text-[10px] uppercase tracking-widest font-bold mt-2">{step}</span>
                </div>
              ))}
            </div>

            <div className="mt-5">
              {currentStep === 0 && (
                <div className="text-center fade-in">
                  <h3 className="serif-font mb-4 text-gold">Selected Services ({booking.services.length})</h3>
                  {booking.services.length > 0 ? (
                    <div className="bg-charcoal p-4 mb-4 text-start">
                      {booking.services.map((s:any) => (
                        <div key={s.id} className="d-flex justify-content-between py-2 border-b border-glass-border"><span className="small">{s.name}</span><span className="text-gold font-bold">₹{s.price}</span></div>
                      ))}
                      <div className="d-flex justify-content-between pt-4 mt-2"><span className="serif-font h5">Current Total</span><span className="text-gold h5">₹{amount}</span></div>
                    </div>
                  ) : <p className="text-muted mb-5">Please select at least one service above to proceed.</p>}
                  <div className="d-flex justify-content-end"><button disabled={booking.services.length === 0} onClick={() => setCurrentStep(1)} className="btn-luxury">Next Step</button></div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="fade-in">
                  <h3 className="serif-font mb-5 text-center text-gold">Choose Your Artisan</h3>
                  <Row className="g-4">
                    {employees.map(emp => (
                      <Col md={6} key={emp.id}>
                        <div onClick={() => setBooking({...booking, employee: emp})} className={`p-4 border cursor-pointer transition-all h-100 ${booking.employee?.id === emp.id ? 'border-gold bg-gold/5' : 'border-glass-border hover:border-gold/50'}`}>
                          <div className="d-flex align-items-center gap-4">
                            <div className="w-16 h-16 bg-charcoal border border-glass-border d-flex items-center justify-center rounded-full text-gold"><User size={32} /></div>
                            <div>
                                <h5 className="mb-0 serif-font text-gold">{emp.name}</h5>
                                <p className="text-xs text-muted mb-2">{emp.speciality}</p>
                                <div className="d-flex align-items-center gap-1 text-gold text-xs"><FaStar /> {emp.rating}</div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                  <div className="mt-5 d-flex justify-content-between">
                    <button onClick={() => setCurrentStep(0)} className="btn-outline-luxury">Back</button>
                    <button disabled={!booking.employee} onClick={() => setCurrentStep(2)} className="btn-luxury">Continue</button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="fade-in">
                  <h3 className="serif-font mb-5 text-center text-gold">Date & Time</h3>
                  <Row className="g-4">
                    <Col md={6}>
                        <Form.Label className="text-[10px] uppercase tracking-widest text-muted mb-2">Select Date</Form.Label>
                        <Form.Control type="date" className="bg-charcoal border-glass-border text-ivory p-3 rounded-none mb-4 focus:border-gold" value={booking.date} onChange={(e) => setBooking({...booking, date: e.target.value})} />
                    </Col>
                    <Col md={6}>
                        <Form.Label className="text-[10px] uppercase tracking-widest text-muted mb-2">Available Slots</Form.Label>
                        <div className="grid grid-cols-2 gap-2">
                            {timeSlots.map(t => (
                                <button key={t} onClick={() => setBooking({...booking, time: t})} className={`p-3 border text-[10px] uppercase tracking-widest font-bold transition-all ${booking.time === t ? 'border-gold bg-gold text-onyx' : 'border-glass-border text-gold hover:border-gold'}`}>{t}</button>
                            ))}
                        </div>
                    </Col>
                  </Row>
                  <div className="mt-5 d-flex justify-content-between">
                    <button onClick={() => setCurrentStep(1)} className="btn-outline-luxury">Back</button>
                    <button disabled={!booking.date || !booking.time} onClick={() => setCurrentStep(3)} className="btn-luxury">Review Appointment</button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="text-center fade-in">
                  <h3 className="serif-font mb-5 text-gold">Ritual Confirmation</h3>
                  <div className="bg-charcoal p-4 p-md-5 text-start border border-glass-border mb-5">
                    <div className="row g-4">
                      <div className="col-md-6 border-e border-glass-border">
                        <h6 className="text-gold uppercase tracking-widest text-xs mb-3">Service Details</h6>
                        {booking.services.map((s:any) => (<div key={s.id} className="d-flex justify-content-between mb-2"><span className="small">{s.name}</span><span className="small text-gold">₹{s.price}</span></div>))}
                        <div className="d-flex justify-content-between mt-4 pt-3 border-t border-glass-border"><span className="serif-font h4 text-gold">Total</span><span className="serif-font h4 text-gold">₹{amount}</span></div>
                      </div>
                      <div className="col-md-6 ps-md-5">
                        <h6 className="text-gold uppercase tracking-widest text-xs mb-3">Appointment Info</h6>
                        <div className="mb-3"><p className="text-muted small mb-0 uppercase tracking-tighter">Artisan</p><p className="serif-font h5">{booking.employee?.name}</p></div>
                        <div className="mb-3"><p className="text-muted small mb-0 uppercase tracking-tighter">Schedule</p><p className="serif-font h5">{booking.date} at {booking.time}</p></div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <button onClick={() => setCurrentStep(2)} className="btn-outline-luxury">Change Schedule</button>
                    <button onClick={handlePayment} className="btn-luxury px-5">Confirm Ritual</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-onyx pt-20 pb-10 border-t border-glass-border">
        <div className="container">
          <Row className="g-5">
            <Col lg={4}>
              <div className="d-flex align-items-center gap-2 mb-4"><FaScissors className="text-gold h4 mb-0" /><span className="serif-font h3 mb-0 tracking-widest text-gold uppercase">BARBERCRAFT</span></div>
              <p className="text-muted small leading-relaxed">Defining the standards of male grooming since 1995.</p>
              <div className="d-flex gap-3 mt-4"><FaInstagram className="text-gold cursor-pointer h5" /><FaFacebook className="text-gold cursor-pointer h5" /><FaTwitter className="text-gold cursor-pointer h5" /></div>
            </Col>
            <Col lg={4}>
              <h5 className="serif-font mb-4 text-gold uppercase tracking-widest">Visit Our Sanctuary</h5>
              <p className="small text-muted mb-2 d-flex align-items-center gap-3"><FaMapMarkerAlt className="text-gold" /> 123 Heritage Row, Downtown District</p>
              <p className="small text-muted d-flex align-items-center gap-3"><FaPhoneAlt className="text-gold" /> +1 (555) 010-BARBER</p>
            </Col>
          </Row>
        </div>
      </footer>

      {/* Modals */}
      <PaymentPage 
        show={showDemoPayment} 
        onHide={() => setShowDemoPayment(false)} 
        bookingSummary={{ services: booking.services, date: booking.date, time: booking.time, amount }} 
        onPaymentSuccess={handleDemoPaymentSuccess} 
        onBookNowPayLater={() => { setShowDemoPayment(false); setShowDemoConfirmation(true); }} 
        points={points} 
        onUsePoints={(d:any) => setAmount(a => a - d)} 
      />

      <ConfirmationPage show={showDemoConfirmation} onHide={() => setShowDemoConfirmation(false)} transactionId={demoPaymentResult?.transactionId} amount={amount} onDone={() => setShowDemoConfirmation(false)} />

      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered className="luxury-modal">
        <Modal.Body className="bg-charcoal text-ivory p-4 p-md-5">
          <div className="text-center mb-5"><h2 className="serif-font text-gold display-5 mb-2">Member Access</h2></div>
          <Tabs activeKey={isNewUser ? 'signup' : 'login'} onSelect={(k:any) => setIsNewUser(k === 'signup')} className="mb-4 luxury-tabs border-0 justify-content-center">
            <Tab eventKey="login" title="SIGN IN" /><Tab eventKey="signup" title="CREATE ACCOUNT" />
          </Tabs>
          <Form className="space-y-4">
            <Form.Control className="bg-onyx border-glass-border text-ivory p-3 rounded-none" placeholder="Username" value={userData.username} onChange={e => setUserData({...userData, username: e.target.value})} />
            <Form.Control type="password" className="bg-onyx border-glass-border text-ivory p-3 rounded-none" placeholder="Password" value={userData.password} onChange={e => setUserData({...userData, password: e.target.value})} />
            <Button onClick={handleAuth} className="btn-luxury w-100 py-3 mt-4" disabled={loading}>{loading ? 'Processing...' : (isNewUser ? 'Begin Membership' : 'Enter Sanctuary')}</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LuxuryBarber;
