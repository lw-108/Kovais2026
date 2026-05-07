import { useState } from "react";
import { motion } from "framer-motion";
import { Row, Col } from 'react-bootstrap';
import { FaDumbbell, FaUsers, FaClock, FaAward, FaCheckCircle } from 'react-icons/fa';
import { Zap, ArrowRight } from "lucide-react";
import Swal from "sweetalert2";

import { GYM_PLANS, bookingService } from "@/lib/data-service";
import { PaymentPage, ConfirmationPage } from "../components/Payment";

const GymPage = ({ points }: any) => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [amount, setAmount] = useState(0);

  const stats = [
    { icon: <FaDumbbell />, value: "50+", label: "Advanced Machines" },
    { icon: <FaUsers />, value: "12", label: "Master Trainers" },
    { icon: <FaClock />, value: "24/7", label: "Access Ritual" },
    { icon: <FaAward />, value: "Gold", label: "Standard" }
  ];

  const handleSelectPlan = (plan: any) => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      Swal.fire({
        title: 'Kovais Membership',
        text: 'Please log in to purchase a membership plan.',
        icon: 'info',
        confirmButtonColor: '#D4AF37'
      });
      return;
    }
    setSelectedPlan(plan);
    setAmount(plan.price);
    setShowPayment(true);
  };

  return (
    <div className="gym-page bg-onyx text-ivory min-h-screen pt-24 pb-20">
      {/* High-Energy Hero */}
      <section className="container mb-32 relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80" alt="Gym" className="w-full h-full object-cover grayscale" />
        </div>
        
        <div className="relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-6">
                <div className="h-px w-20 bg-gold" />
                <span className="text-gold uppercase tracking-[0.4em] text-xs">Forging Greatness</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-7xl md:text-9xl serif-font mb-10 leading-tight">ASCEND <br /><span className="text-gold">PERFORMANCE</span></motion.h1>
            
            <Row className="g-4 mb-16">
                {stats.map((stat, i) => (
                    <Col key={stat.label} xs={6} md={3}>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.1 }}
                            className="bg-charcoal border border-glass-border p-6 text-center hover:border-gold/30 transition-all"
                        >
                            <div className="text-gold mb-3 flex justify-center text-xl">{stat.icon}</div>
                            <div className="text-2xl font-bold mb-1">{stat.value}</div>
                            <div className="text-[10px] uppercase tracking-widest opacity-50">{stat.label}</div>
                        </motion.div>
                    </Col>
                ))}
            </Row>
        </div>
      </section>

      {/* Membership Plans */}
      <section className="container mb-32">
        <div className="text-center mb-20">
            <h2 className="serif-font text-5xl mb-4">Select Your <span className="text-gold">Commitment</span></h2>
            <p className="text-muted max-w-2xl mx-auto">Luxury is the discipline of self-improvement. Choose the tier that matches your ambition.</p>
        </div>

        <Row className="g-5 justify-content-center">
            {GYM_PLANS.map((plan, idx) => (
                <Col lg={4} md={6} key={plan.id}>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className={`group relative bg-charcoal border ${idx === 1 ? 'border-gold p-10 -translate-y-4' : 'border-glass-border p-8 hover:border-gold/40'} transition-all duration-500`}
                    >
                        {idx === 1 && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-onyx px-6 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">Most Prestigious</div>}
                        
                        <div className="mb-10">
                            <span className="text-xs uppercase tracking-[0.3em] opacity-50 block mb-2">{plan.duration} Ritual</span>
                            <h3 className="serif-font text-3xl mb-4">{plan.duration} Access</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl serif-font text-gold">₹{plan.price}</span>
                                <span className="text-xs opacity-30 uppercase">Total Commitment</span>
                            </div>
                        </div>

                        <div className="space-y-6 mb-12">
                            {plan.features.map((f: string) => (
                                <div key={f} className="flex items-start gap-4 text-sm">
                                    <FaCheckCircle className="text-gold mt-1 shrink-0" size={14} />
                                    <span className="opacity-70">{f}</span>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={() => handleSelectPlan(plan)}
                            className={`w-full py-4 text-[10px] uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 ${idx === 1 ? 'bg-gold text-onyx' : 'border border-gold text-gold hover:bg-gold hover:text-onyx'}`}
                        >
                            Acquire Membership <ArrowRight size={14} />
                        </button>
                    </motion.div>
                </Col>
            ))}
        </Row>
      </section>

      {/* Philosophy Section */}
      <section className="bg-charcoal py-32 border-y border-glass-border">
        <div className="container text-center max-w-4xl mx-auto">
            <Zap size={40} className="text-gold mx-auto mb-10" />
            <h2 className="serif-font text-4xl mb-8">"Excellence is not an act, but a habit."</h2>
            <p className="text-muted text-lg leading-relaxed italic">Our gym is more than a facility; it is a dedicated chamber of transformation. Every piece of equipment is curated for optimal biomechanics, and every corner is maintained for total focus. This is where your new self begins.</p>
        </div>
      </section>

      {/* Modals */}
      <PaymentPage 
        show={showPayment} 
        onHide={() => setShowPayment(false)} 
        bookingSummary={{ services: [{ name: `${selectedPlan?.duration} Gym Access` }], date: "Immediate", time: "24/7", amount }} 
        onPaymentSuccess={async (result: any) => {
            setShowPayment(false);
            await bookingService.createGymBooking({ plan: selectedPlan, amount, transactionId: result.transactionId });
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

export default GymPage;
