import { useState } from "react";
import { motion } from "framer-motion";
import { Row, Col } from 'react-bootstrap';
import { Gem, Music, MapPin, Wine } from "lucide-react";

import { HALLS, bookingService } from "@/lib/data-service";
import { PaymentPage, ConfirmationPage } from "../components/Payment";

const FunctionPage = ({ points }: any) => {
  const [selectedHall, setSelectedHall] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [amount, setAmount] = useState(0);

  const amenities = [
    { icon: <Music />, title: "Acoustic Excellence", desc: "Premium sound systems for every event." },
    { icon: <Wine />, title: "Catering Suites", desc: "Five-star culinary facilities available." },
    { icon: <MapPin />, title: "Prime Location", desc: "Easy access with valet parking service." },
    { icon: <Gem />, title: "Regal Decor", desc: "Hand-crafted aesthetics for every occasion." }
  ];

  const handleSelectHall = (hall: any) => {
    setSelectedHall(hall);
    setAmount(hall.price);
    setShowPayment(true);
  };

  return (
    <div className="function-page bg-onyx text-ivory min-h-screen pt-24 pb-20">
      {/* Grand Hero */}
      <section className="container mb-32">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                <span className="text-gold uppercase tracking-[0.4em] text-xs mb-4 block">Event Sanctuaries</span>
                <h1 className="text-7xl md:text-8xl serif-font mb-10 leading-tight">GRAND <br /><span className="text-gold italic">CELEBRATIONS</span></h1>
                <p className="text-muted text-lg leading-relaxed mb-12">From intimate soirées to majestic galas, our halls provide the perfect canvas for your most significant moments. Experience the hallmark of Kovais hospitality.</p>
                
                <div className="flex gap-10">
                    <div className="text-center">
                        <div className="text-3xl serif-font text-gold mb-1">1,200</div>
                        <div className="text-[10px] uppercase tracking-widest opacity-40">Max Guests</div>
                    </div>
                    <div className="h-10 w-px bg-glass-border" />
                    <div className="text-center">
                        <div className="text-3xl serif-font text-gold mb-1">04</div>
                        <div className="text-[10px] uppercase tracking-widest opacity-40">Venues</div>
                    </div>
                </div>
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}
                className="relative aspect-[4/5] bg-charcoal border border-glass-border p-4"
            >
                <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80" alt="Hall" className="w-full h-full object-cover grayscale brightness-75" />
                <div className="absolute inset-0 border-[20px] border-onyx/20 m-8 pointer-events-none" />
            </motion.div>
        </div>
      </section>

      {/* Hall Selection */}
      <section className="container mb-32">
        <h2 className="serif-font text-5xl mb-20 text-center">Available <span className="text-gold italic">Venues</span></h2>
        
        <div className="space-y-12">
            {HALLS.filter(h => h.id === 'h1').map((hall) => (
                <motion.div 
                    key={hall.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group flex flex-column lg:flex-row border border-glass-border hover:border-gold/30 transition-all duration-700 overflow-hidden"
                >
                    <div className="lg:w-1/2 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={hall.type} />
                    </div>
                    <div className="lg:w-1/2 p-12 lg:p-20 flex flex-column">
                        <h3 className="serif-font text-4xl mb-6">{hall.type}</h3>
                        <p className="text-muted leading-relaxed mb-10">{hall.description}</p>
                        
                        <div className="grid grid-cols-2 gap-8 mb-12">
                            <div>
                                <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-2">Capacity</span>
                                <span className="text-xl serif-font text-gold">{hall.capacity} Guests</span>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-2">Investment</span>
                                <span className="text-xl serif-font text-gold">₹{hall.price.toLocaleString()}</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => handleSelectHall(hall)}
                            className="btn-luxury py-5 w-full mt-auto"
                        >
                            Request Reservation
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>
      </section>

      {/* Amenities Grid */}
      <section className="container py-32 border-t border-glass-border">
        <Row className="g-5">
            {amenities.map((item, i) => (
                <Col md={3} key={i}>
                    <motion.div 
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                        className="text-center group"
                    >
                        <div className="text-gold mb-6 flex justify-center text-3xl group-hover:scale-110 transition-transform">{item.icon}</div>
                        <h4 className="serif-font text-xl mb-3">{item.title}</h4>
                        <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
                    </motion.div>
                </Col>
            ))}
        </Row>
      </section>

      {/* Modals */}
      <PaymentPage 
        show={showPayment} 
        onHide={() => setShowPayment(false)} 
        bookingSummary={{ services: [{ name: selectedHall?.type }], date: "Requested", time: "Evening", amount }} 
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

export default FunctionPage;
