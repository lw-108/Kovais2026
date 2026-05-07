import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Row, Col, Modal, Form } from 'react-bootstrap';
import { FaLeaf, FaWind, FaCrown, FaStar } from 'react-icons/fa';
import { Check } from "lucide-react";
import Swal from "sweetalert2";

import { SPA_SERVICES, userService, bookingService } from "@/lib/data-service";
import { PaymentPage, ConfirmationPage } from "../components/Payment";

const SpaPage = ({ setUser, points, setPoints }: any) => {
  const [selectedGender, setSelectedGender] = useState<"Men" | "Women">("Men");
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [amount, setAmount] = useState(0);
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({ username: "", password: "" });
  
  const [showPayment, setShowPayment] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const timeSlots = ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM", "07:00 PM"];

  useEffect(() => {
    const total = selectedServices.reduce((sum, s) => sum + s.amount, 0);
    setAmount(total);
  }, [selectedServices]);

  const toggleService = (service: any) => {
    setSelectedServices(prev => 
      prev.find(s => s.id === service.id) 
        ? prev.filter(s => s.id !== service.id)
        : [...prev, service]
    );
  };

  const handleBooking = () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      setShowLoginModal(true);
      return;
    }
    setShowPayment(true);
  };

  const handleAuth = async () => {
    setLoading(true);
    try {
      const user = await userService.login(userData.username, userData.password);
      setUser(user);
      setPoints(user.points);
      setShowLoginModal(false);
      setShowPayment(true);
    } catch (e) {
      Swal.fire({ icon: "error", title: "Login Failed" });
    } finally {
      setLoading(false);
    }
  };

  const onPaymentSuccess = async (result: any) => {
    setTransactionId(result.transactionId);
    setShowPayment(false);
    await bookingService.createSpaBooking({
        services: selectedServices,
        date: selectedDate,
        time: selectedTime,
        amount,
        transactionId: result.transactionId
    });
    setShowConfirmation(true);
  };

  return (
    <div className="spa-page bg-onyx text-ivory min-h-screen pt-20">
      {/* Hero Banner */}
      <section className="relative h-[60vh] overflow-hidden">
        <motion.div 
            initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-onyx/40 to-onyx" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-gold uppercase tracking-[0.5em] text-sm mb-4 block">Temple of Tranquility</motion.span>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-5xl md:text-7xl serif-font mb-6">REJUVENATE</motion.h1>
            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="max-w-xl mx-auto text-muted leading-relaxed">Experience a sanctuary where time stands still. Our signature spa rituals are designed to restore balance to your body, mind, and spirit.</motion.p>
          </div>
        </div>
      </section>

      <div className="container py-20">
        {/* Gender Toggle */}
        <div className="flex justify-center mb-20">
            <div className="bg-charcoal p-1 rounded-none flex border border-glass-border">
                {["Men", "Women"].map((g: any) => (
                    <button 
                        key={g} 
                        onClick={() => { setSelectedGender(g); setSelectedServices([]); }}
                        className={`px-10 py-3 text-xs uppercase tracking-widest transition-all ${selectedGender === g ? 'bg-gold text-onyx' : 'text-gold hover:bg-gold/10'}`}
                    >
                        {g} Rituals
                    </button>
                ))}
            </div>
        </div>

        <Row className="g-5">
          {/* Service Grid */}
          <Col lg={8}>
            <h2 className="serif-font text-3xl mb-10 border-l-4 border-gold pl-6">Curated Treatments</h2>
            <Row className="g-4">
              {SPA_SERVICES[selectedGender].map((service: any) => (
                <Col md={6} key={service.id}>
                  <motion.div 
                    whileHover={{ y: -10 }}
                    onClick={() => toggleService(service)}
                    className={`group relative overflow-hidden border transition-all cursor-pointer ${selectedServices.find(s => s.id === service.id) ? 'border-gold' : 'border-glass-border hover:border-gold/50'}`}
                  >
                    <div className="aspect-[4/5] overflow-hidden">
                        <img src={service.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={service.name} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/20 to-transparent p-6 flex flex-column justify-end">
                        <h4 className="serif-font text-2xl mb-2">{service.name}</h4>
                        <p className="text-xs text-muted mb-4 line-clamp-2">{service.description}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-gold font-bold">₹{service.amount}</span>
                            <div className={`size-6 border flex items-center justify-center ${selectedServices.find(s => s.id === service.id) ? 'bg-gold border-gold' : 'border-gold/30'}`}>
                                {selectedServices.find(s => s.id === service.id) && <Check size={14} className="text-onyx" />}
                            </div>
                        </div>
                    </div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </Col>

          {/* Booking Sidebar */}
          <Col lg={4}>
            <div className="sticky top-32">
                <div className="bg-charcoal border border-glass-border p-8">
                    <h3 className="serif-font text-2xl mb-8 border-b border-glass-border pb-4">Your Ritual</h3>
                    
                    {selectedServices.length === 0 ? (
                        <div className="text-center py-10 opacity-30">
                            <FaLeaf size={40} className="mx-auto mb-4" />
                            <p className="text-xs uppercase tracking-widest">No services selected</p>
                        </div>
                    ) : (
                        <div className="space-y-4 mb-10">
                            {selectedServices.map(s => (
                                <div key={s.id} className="flex justify-between items-center text-sm">
                                    <span className="text-muted">{s.name}</span>
                                    <span className="text-gold">₹{s.amount}</span>
                                </div>
                            ))}
                            <div className="pt-4 border-t border-glass-border flex justify-between items-end">
                                <span className="text-xs uppercase tracking-widest">Total Ritual Amount</span>
                                <span className="text-3xl serif-font text-gold">₹{amount}</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] uppercase tracking-[0.2em] text-muted mb-3 block">Preferred Date</label>
                            <input type="date" className="w-full bg-onyx border border-glass-border p-3 text-sm focus:border-gold outline-none" onChange={(e) => setSelectedDate(e.target.value)} />
                        </div>

                        <div>
                            <label className="text-[10px] uppercase tracking-[0.2em] text-muted mb-3 block">Available Slots</label>
                            <div className="grid grid-cols-3 gap-2">
                                {timeSlots.map(t => (
                                    <button 
                                        key={t} 
                                        onClick={() => setSelectedTime(t)}
                                        className={`py-2 text-[10px] border transition-all ${selectedTime === t ? 'bg-gold text-onyx border-gold' : 'border-glass-border text-gold hover:border-gold'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            disabled={selectedServices.length === 0 || !selectedDate || !selectedTime}
                            onClick={handleBooking}
                            className="w-full btn-luxury py-4 mt-6"
                        >
                            Begin Journey
                        </button>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-4">
                    {[
                        { icon: <FaWind />, label: 'Aroma' },
                        { icon: <FaCrown />, label: 'Royal' },
                        { icon: <FaStar />, label: 'VIP' }
                    ].map(item => (
                        <div key={item.label} className="text-center p-4 bg-charcoal border border-glass-border">
                            <div className="text-gold mb-2 flex justify-center">{item.icon}</div>
                            <span className="text-[10px] uppercase tracking-tighter opacity-50">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Modals */}
      <PaymentPage 
        show={showPayment} 
        onHide={() => setShowPayment(false)} 
        bookingSummary={{ services: selectedServices, date: selectedDate, time: selectedTime, amount }} 
        onPaymentSuccess={onPaymentSuccess} 
        onBookNowPayLater={() => { setShowPayment(false); setShowConfirmation(true); }} 
        points={points} 
        onUsePoints={(d:any) => setAmount(a => a - d)} 
      />

      <ConfirmationPage 
        show={showConfirmation} 
        onHide={() => setShowConfirmation(false)} 
        transactionId={transactionId} 
        amount={amount} 
        onDone={() => setShowConfirmation(true)} 
      />

      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered className="luxury-modal">
        <Modal.Body className="bg-charcoal text-ivory p-5 border border-gold/20 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="serif-font text-3xl text-gold mb-2">Sanctuary Access</h2>
            <p className="text-xs uppercase tracking-widest opacity-50">Join the Kovais Elite Circle</p>
          </div>
          <Form className="space-y-6">
            <div>
                <label className="text-[10px] uppercase tracking-widest text-muted mb-2 block">Username</label>
                <input className="w-full bg-onyx border border-glass-border p-4 text-sm focus:border-gold outline-none" value={userData.username} onChange={e => setUserData({...userData, username: e.target.value})} />
            </div>
            <div>
                <label className="text-[10px] uppercase tracking-widest text-muted mb-2 block">Secret Key</label>
                <input type="password" className="w-full bg-onyx border border-glass-border p-4 text-sm focus:border-gold outline-none" value={userData.password} onChange={e => setUserData({...userData, password: e.target.value})} />
            </div>
            <button onClick={handleAuth} className="w-full btn-luxury py-4 mt-4" disabled={loading}>{loading ? 'Syncing...' : 'Enter Sanctuary'}</button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SpaPage;
