import { useState } from "react";
import { motion } from "framer-motion";
import { Row, Col } from 'react-bootstrap';
import { Heart, Shield, Anchor } from "lucide-react";

import { HALLS, bookingService } from "@/lib/data-service";
import { PaymentPage, ConfirmationPage } from "../components/Payment";

const FuneralPage = ({ points }: any) => {
  const [selectedHall, setSelectedHall] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [amount, setAmount] = useState(0);

  const values = [
    { icon: <Heart size={24} />, title: "Compassion", desc: "Respectful guidance during difficult times." },
    { icon: <Shield size={24} />, title: "Dignity", desc: "Honoring every legacy with absolute grace." },
    { icon: <Anchor size={24} />, title: "Support", desc: "Comprehensive care for every detail." }
  ];

  const handleSelect = (hall: any) => {
    setSelectedHall(hall);
    setAmount(hall.price);
    setShowPayment(true);
  };

  return (
    <div className="funeral-page bg-onyx text-ivory min-h-screen pt-24 pb-20">
      {/* Serene Hero */}
      <section className="container mb-32 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
            <span className="text-gold/50 uppercase tracking-[0.5em] text-xs mb-6 block">Kovais Memorial Services</span>
            <h1 className="text-6xl md:text-8xl serif-font mb-10 font-light italic">Serenity & <span className="text-gold">Legacy</span></h1>
            <div className="max-w-2xl mx-auto h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-12" />
            <p className="text-muted text-lg leading-relaxed max-w-xl mx-auto mb-20 font-light">Honoring lives with the utmost dignity. Our memorial halls provide a peaceful sanctuary for reflection, remembrance, and the celebration of cherished legacies.</p>
        </motion.div>
        
        <motion.div 
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }}
            className="aspect-[21/9] w-full bg-charcoal border border-glass-border overflow-hidden"
        >
            <img src="https://images.unsplash.com/photo-1518116518337-14e9185a5369?auto=format&fit=crop&q=80" alt="Serenity" className="w-full h-full object-cover grayscale brightness-50" />
        </motion.div>
      </section>

      {/* Memorial Hall Selection */}
      <section className="container mb-32">
        <Row className="justify-content-center">
            {HALLS.filter(h => h.id === 'h2').map((hall) => (
                <Col lg={8} key={hall.id}>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-charcoal border border-glass-border p-12 md:p-20 text-center relative overflow-hidden group"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gold/20" />
                        <h2 className="serif-font text-4xl mb-8">{hall.type}</h2>
                        <p className="text-muted leading-relaxed mb-12 max-w-lg mx-auto">{hall.description}</p>
                        
                        <div className="flex justify-center gap-16 mb-16 border-y border-glass-border py-8">
                            <div className="text-center">
                                <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-2">Capacity</span>
                                <span className="text-xl serif-font text-gold">{hall.capacity} People</span>
                            </div>
                            <div className="text-center">
                                <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-2">Formal Setting</span>
                                <span className="text-xl serif-font text-gold">Premium</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => handleSelect(hall)}
                            className="px-12 py-4 border border-gold/30 text-gold text-xs uppercase tracking-widest hover:bg-gold hover:text-onyx transition-all duration-700"
                        >
                            Inquire for Reservation
                        </button>
                    </motion.div>
                </Col>
            ))}
        </Row>
      </section>

      {/* Values Section */}
      <section className="container py-20">
        <Row className="g-5">
            {values.map((v, i) => (
                <Col md={4} key={i}>
                    <motion.div 
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.2 }}
                        className="text-center p-10 border border-glass-border/30 hover:border-gold/20 transition-all"
                    >
                        <div className="text-gold/60 mb-6 flex justify-center">{v.icon}</div>
                        <h4 className="serif-font text-2xl mb-4">{v.title}</h4>
                        <p className="text-xs text-muted leading-relaxed">{v.desc}</p>
                    </motion.div>
                </Col>
            ))}
        </Row>
      </section>

      {/* Modals */}
      <PaymentPage 
        show={showPayment} 
        onHide={() => setShowPayment(false)} 
        bookingSummary={{ services: [{ name: selectedHall?.type }], date: "On Demand", time: "Flexible", amount }} 
        onPaymentSuccess={async (result: any) => {
            setShowPayment(false);
            await bookingService.createHallBooking({ hall: selectedHall, amount, transactionId: result.transactionId });
            setShowConfirmation(true);
        }} 
        onBookNowPayLater={() => { setShowPayment(false); setShowConfirmation(true); }} 
        points={points} 
        onUsePoints={(d:any) => setAmount(a => a - d)} 
      />

      <ConfirmationPage show={showConfirmation} onHide={() => setShowConfirmation(false)} amount={amount} onDone={() => setShowConfirmation(false)} />
    </div>
  );
};

export default FuneralPage;
