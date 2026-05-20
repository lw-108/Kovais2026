"use client";
import React, { useState } from "react";
import { 
  Globe, 
  Camera, 
  X, 
  MessageCircle, 
  ChevronRight, 
  Phone, 
  Mail, 
  MapPin,
  MessageSquare,
  Send
} from "lucide-react";

const footerLinks = {
  services: [
    { name: "Luxury Hotel & Suites", href: "/hotel" },
    { name: "Ancient Healing Spa", href: "/spa" },
    { name: "Elite Fitness Club", href: "/gym" },
    { name: "Master Barber Atelier", href: "/barber" },
    { name: "Graceful Remembrance", href: "/funeral" },
    { name: "Bespoke Event Estates", href: "/function" },
  ],
  company: [
    { name: "Our Heritage", href: "/about" },
    { name: "The Gallery Portfolio", href: "/#gallery" },
    { name: "Private Concierge (Contact)", href: "/#contact" },
    { name: "Kovais Journal", href: "/blog" },
    { name: "Careers in Luxury", href: "/careers" },
  ],
};

const socialLinks = [
  { icon: Globe, href: "#", name: "Website" },
  { icon: Camera, href: "#", name: "Instagram" },
  { icon: X, href: "#", name: "Twitter" },
  { icon: MessageCircle, href: "https://wa.me/919234567891", name: "WhatsApp" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="relative bg-[#070707] text-white pt-20 pb-12 border-t border-[#D4AF37]/20 overflow-hidden font-sans">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/3 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/2 blur-[120px] rounded-full -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* 1. Dedicated Logo & Branding Layout Band at the Top (Centered, Full Width) */}
        <div className="flex flex-col items-center justify-center text-center pb-16 border-b border-white/5">
          <a href="/" className="inline-block transition-transform hover:scale-[1.02] duration-300 mb-6">
            <img src="/logo.png" alt="Kovais Logo" className="h-16 md:h-20 w-auto object-contain brightness-105" />
          </a>
          <p className="text-white/60 leading-relaxed text-sm max-w-2xl font-medium tracking-wide">
            Coimbatore's premier destination for luxury hospitality, holistic wellness, and master grooming. Where ancient heritage meets contemporary comfort.
          </p>
          <div className="flex gap-4 mt-6">
            {socialLinks.map((social, i) => (
              <a
                key={i}
                href={social.href}
                aria-label={social.name}
                className="group relative size-10 flex items-center justify-center bg-white/5 border border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
              >
                <div className="absolute inset-0 bg-[#D4AF37]/10 scale-0 group-hover:scale-100 transition-transform duration-300 origin-center" />
                <social.icon className="size-4 relative z-10 text-white/70 group-hover:text-[#D4AF37] transition-colors" />
              </a>
            ))}
          </div>
        </div>

        {/* 2. Middle Section: Columns Grid (Services, Company, Get in Touch) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-16 pb-16 border-b border-white/5">
          {/* Services Links */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">
                Services
              </h3>
            </div>
            <ul className="space-y-4">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="flex items-center text-white/60 hover:text-[#D4AF37] transition-all duration-300 group translate-x-0 hover:translate-x-1.5"
                  >
                    <ChevronRight className="size-3.5 mr-2 text-[#D4AF37]/30 group-hover:text-[#D4AF37] transition-colors" />
                    <span className="text-sm font-medium tracking-wide">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">
                Company
              </h3>
            </div>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="flex items-center text-white/60 hover:text-[#D4AF37] transition-all duration-300 group translate-x-0 hover:translate-x-1.5"
                  >
                    <ChevronRight className="size-3.5 mr-2 text-[#D4AF37]/30 group-hover:text-[#D4AF37] transition-colors" />
                    <span className="text-sm font-medium tracking-wide">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">
                Get in Touch
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <a href="tel:+919234567891" className="group p-5 bg-white/[0.01] hover:bg-[#D4AF37]/5 border border-white/5 hover:border-[#D4AF37]/20 transition-all duration-300 flex items-start gap-4">
                <Phone className="size-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-[#D4AF37]/75 transition-colors">Call Direct</p>
                  <p className="text-white font-bold tracking-tight text-xs sm:text-sm transition-colors">+91 92345 67891</p>
                </div>
              </a>

              <a href="https://wa.me/919234567891" target="_blank" rel="noopener noreferrer" className="group p-5 bg-white/[0.01] hover:bg-[#D4AF37]/5 border border-white/5 hover:border-[#D4AF37]/20 transition-all duration-300 flex items-start gap-4">
                <MessageSquare className="size-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-[#D4AF37]/75 transition-colors">WhatsApp Concierge</p>
                  <p className="text-white font-bold tracking-tight text-xs sm:text-sm transition-colors">+91 92345 67891</p>
                </div>
              </a>

              <a href="mailto:info@kovaisbeauty.com" className="group p-5 bg-white/[0.01] hover:bg-[#D4AF37]/5 border border-white/5 hover:border-[#D4AF37]/20 transition-all duration-300 flex items-start gap-4">
                <Mail className="size-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-[#D4AF37]/75 transition-colors">Email Us</p>
                  <p className="text-white font-bold tracking-tight text-xs sm:text-sm transition-colors truncate max-w-[150px] lg:max-w-none">info@kovaisbeauty.com</p>
                </div>
              </a>

              <div className="group p-5 bg-white/[0.01] border border-white/5 flex items-start gap-4">
                <MapPin className="size-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Location</p>
                  <p className="text-white font-bold tracking-tight text-xs sm:text-sm">Coimbatore, Tamil Nadu</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Newsletter Section (Centered, full-width above bottom bar to avoid column collision) */}
        <div className="pt-16 pb-8 flex justify-center">
          <div className="w-full max-w-4xl p-8 md:p-10 bg-white/[0.02] backdrop-blur-md border border-white/5 hover:border-[#D4AF37]/20 transition-colors duration-500 relative">
            <div className="absolute top-0 left-0 size-3 border-t border-l border-[#D4AF37]/50" />
            <div className="absolute bottom-0 right-0 size-3 border-b border-r border-[#D4AF37]/50" />
            
            <div className="grid md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-2 space-y-2 text-left">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#D4AF37]">Newsletter</span>
                <h3 className="text-xl font-bold tracking-tight uppercase font-heading text-white">Join the Circle</h3>
                <p className="text-[11px] text-white/50 leading-relaxed font-medium">Subscribe for exclusive access to seasonal events, spa rituals, and member privileges.</p>
              </div>
              <div className="md:col-span-3">
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
                    className="flex-1 h-12 px-4 bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#D4AF37] text-sm text-white focus:outline-none transition-all duration-300"
                  />
                  <button 
                    type="submit"
                    className="h-12 px-6 bg-[#D4AF37] hover:bg-[#B8962E] text-stone-950 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all duration-300 flex items-center gap-2 group shrink-0"
                  >
                    <span>{subscribed ? "Subscribed" : "Subscribe"}</span>
                    {!subscribed && <Send className="size-3 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-6 relative z-20">
          <p className="text-xs text-white/50 font-medium text-center md:text-left tracking-wide">
            © 2026 <span className="text-[#D4AF37]">Kovais</span>. All rights reserved. Crafted with care in Coimbatore.
          </p>
          <div className="flex gap-8">
            <a href="/privacy" className="text-xs text-white/50 hover:text-[#D4AF37] transition-colors font-semibold tracking-wide uppercase">Privacy Policy</a>
            <div className="w-[1px] h-4 bg-white/10 hidden md:block" />
            <a href="/terms" className="text-xs text-white/50 hover:text-[#D4AF37] transition-colors font-semibold tracking-wide uppercase">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Massive Branding Background Text */}
      <div className="absolute -bottom-[12vw] left-0 right-0 flex justify-center pointer-events-none select-none z-0">
        <h1 className="text-[30vw] font-black uppercase tracking-tighter serif text-[#D4AF37]/3 leading-none translate-y-[10%]">
          Kovais
        </h1>
      </div>
    </footer>
  );
}
