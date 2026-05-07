import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Row, Col, Modal } from 'react-bootstrap';
import { Sparkles, Clock, Filter } from "lucide-react";
import Swal from "sweetalert2";

import { PARLOUR_PRODUCTS, bookingService } from "@/lib/data-service";
import { PaymentPage, ConfirmationPage } from "../components/Payment";

const ParlourPage = ({ points }: any) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const [showPayment, setShowPayment] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [amount, setAmount] = useState(0);
  
  const categories = ["All", "Hair Care", "Skin Care", "Makeup"];

  const filteredProducts = activeFilter === "All" 
    ? PARLOUR_PRODUCTS 
    : PARLOUR_PRODUCTS.filter(p => p.category === activeFilter);

  const handleBook = (product: any) => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    setSelectedProduct(product);
    setAmount(product.price);
    
    if (!loggedInUser) {
      Swal.fire({
        title: 'Member Access Required',
        text: 'Please log in via the Hotel or Spa page to access member booking.',
        icon: 'info',
        confirmButtonColor: '#D4AF37'
      });
      return;
    }
    setShowDetailModal(false);
    setShowPayment(true);
  };

  return (
    <div className="parlour-page bg-onyx text-ivory min-h-screen pt-24 pb-20">
      {/* Cinematic Header */}
      <div className="container mb-20">
        <div className="max-w-3xl">
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gold uppercase tracking-[0.4em] text-xs mb-4 block">Aesthetic Excellence</motion.span>
            <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="text-6xl md:text-8xl serif-font mb-8">PARLOUR <br /><span className="text-gold italic">DE LUXE</span></motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-muted text-lg leading-relaxed">Where high-fashion aesthetics meet professional care. Our artisans specialize in transforming your vision into reality with premium products and precision techniques.</motion.p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-[4rem] z-40 bg-onyx/80 backdrop-blur-xl border-y border-glass-border py-4 mb-16">
        <div className="container flex items-center justify-between">
            <div className="flex gap-8 overflow-x-auto no-scrollbar">
                {categories.map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => setActiveFilter(cat)}
                        className={`text-xs uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === cat ? 'text-gold border-b border-gold pb-1' : 'text-muted hover:text-gold'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="hidden md:flex items-center gap-2 text-gold/50 text-xs uppercase tracking-widest">
                <Filter size={14} />
                <span>Refine Selection</span>
            </div>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="container">
        <Row className="g-4">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, idx) => (
              <Col lg={4} md={6} key={product.id}>
                <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-charcoal border border-glass-border overflow-hidden hover:border-gold/40 transition-all duration-500"
                >
                    <div className="aspect-square relative overflow-hidden">
                        <img src={product.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={product.name} />
                        <div className="absolute inset-0 bg-onyx/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={() => { setSelectedProduct(product); setShowDetailModal(true); }} className="bg-gold text-onyx px-8 py-3 text-xs uppercase tracking-widest font-bold translate-y-10 group-hover:translate-y-0 transition-transform duration-500">View Ritual Details</button>
                        </div>
                        <div className="absolute top-6 left-6 bg-gold/90 text-onyx px-3 py-1 text-[10px] uppercase font-bold tracking-widest">
                            {product.category}
                        </div>
                    </div>
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="serif-font text-2xl">{product.name}</h3>
                            <span className="text-gold font-bold">₹{product.price}</span>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-muted uppercase tracking-widest mb-6">
                            <span className="flex items-center gap-1"><Clock size={12} className="text-gold" /> {product.duration}</span>
                            <span className="flex items-center gap-1"><Sparkles size={12} className="text-gold" /> Premium Care</span>
                        </div>
                        <button onClick={() => handleBook(product)} className="w-full border border-gold/20 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-gold hover:text-onyx transition-all duration-500">Instant Reserve</button>
                    </div>
                </motion.div>
              </Col>
            ))}
          </AnimatePresence>
        </Row>
      </div>

      {/* Modals */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered size="lg" className="luxury-modal">
        <Modal.Body className="bg-charcoal text-ivory p-0 border border-gold/20 overflow-hidden">
          {selectedProduct && (
            <Row className="g-0">
                <Col md={6}>
                    <img src={selectedProduct.image} className="w-full h-full object-cover min-h-[400px]" alt={selectedProduct.name} />
                </Col>
                <Col md={6} className="p-10 flex flex-column">
                    <span className="text-gold text-xs uppercase tracking-[0.3em] mb-4 block">{selectedProduct.category}</span>
                    <h2 className="serif-font text-4xl mb-6">{selectedProduct.name}</h2>
                    <p className="text-muted leading-relaxed mb-8">{selectedProduct.description}</p>
                    
                    <div className="space-y-4 mb-auto">
                        <div className="flex justify-between py-3 border-b border-glass-border">
                            <span className="text-xs uppercase opacity-50">Artisan Level</span>
                            <span className="text-xs uppercase text-gold">Master Stylist</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-glass-border">
                            <span className="text-xs uppercase opacity-50">Duration</span>
                            <span className="text-xs uppercase text-gold">{selectedProduct.duration}</span>
                        </div>
                        <div className="flex justify-between py-3">
                            <span className="text-xs uppercase opacity-50">Premium Pricing</span>
                            <span className="text-xl serif-font text-gold">₹{selectedProduct.price}</span>
                        </div>
                    </div>

                    <button onClick={() => handleBook(selectedProduct)} className="btn-luxury w-full py-4 mt-10">Reserve This Experience</button>
                </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>

      <PaymentPage 
        show={showPayment} 
        onHide={() => setShowPayment(false)} 
        bookingSummary={{ services: [selectedProduct], date: new Date().toLocaleDateString(), time: "Scheduled", amount }} 
        onPaymentSuccess={async (result: any) => {
            setShowPayment(false);
            await bookingService.createParlourBooking({ product: selectedProduct, amount, transactionId: result.transactionId });
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

export default ParlourPage;
