"use client";
import { 
  Globe, 
  Camera, 
  X, 
  MessageCircle, 
  ChevronRight, 
  Phone, 
  Mail, 
  MapPin,
  MessageSquare
} from "lucide-react";


const footerLinks = {
  services: [
    { name: "Hotel", href: "/hotel" },
    { name: "Spa", href: "/spa" },
    { name: "Gym", href: "/gym" },
    { name: "Barber", href: "/barber" },
    { name: "Funeral", href: "/funeral" },
    { name: "Function", href: "/function" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Gallery", href: "/#gallery" },
    { name: "Contact", href: "/#contact" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
  ],
};

const socialLinks = [
  { icon: Globe, href: "#" },
  { icon: Camera, href: "#" },
  { icon: X, href: "#" },
  { icon: MessageCircle, href: "https://wa.me/919234567891" },
];

export function Footer() {
  return (
    <footer className="bg-background pt-24 pb-12 border-t border-[#D4AF37]/10 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
        <div className="absolute bottom-0 left-1/4 size-[500px] bg-[#D4AF37]/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Info */}
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-[#D4AF37] serif tracking-tighter">
              Kovais
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-xs font-medium">
              Coimbatore's premier destination for luxury hospitality, holistic wellness, and expert grooming. Where every visit becomes a memory.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="size-10 flex items-center justify-center bg-card border border-border/10 text-muted-foreground hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all duration-300"
                >
                  <social.icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-10">
              Services
            </h3>
            <ul className="space-y-4">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="flex items-center text-muted-foreground hover:text-[#D4AF37] transition-colors group"
                  >
                    <ChevronRight className="size-4 mr-2 text-[#D4AF37]/40 group-hover:text-[#D4AF37] transition-colors" />
                    <span className="font-medium tracking-tight">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-10">
              Company
            </h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="flex items-center text-muted-foreground hover:text-[#D4AF37] transition-colors group"
                  >
                    <ChevronRight className="size-4 mr-2 text-[#D4AF37]/40 group-hover:text-[#D4AF37] transition-colors" />
                    <span className="font-medium tracking-tight">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-10">
              Contact Us
            </h3>
            <div className="space-y-8">
              <div className="flex gap-4">
                <Phone className="size-5 text-[#D4AF37] shrink-0" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone</p>
                  <p className="text-foreground font-bold tracking-tight text-sm">+91 92345 67891</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <MessageSquare className="size-5 text-[#D4AF37] shrink-0" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">WhatsApp</p>
                  <p className="text-foreground font-bold tracking-tight text-sm">+91 92345 67891</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail className="size-5 text-[#D4AF37] shrink-0" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email</p>
                  <p className="text-foreground font-bold tracking-tight text-sm">info@kovaisbeauty.com</p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="size-5 text-[#D4AF37] shrink-0" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Location</p>
                  <p className="text-foreground font-bold tracking-tight text-sm">Coimbatore, Tamil Nadu</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-[#D4AF37]/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground font-medium text-center md:text-left">
            © 2026 <span className="text-[#D4AF37]">Kovais</span>. All rights reserved. Crafted with care in Coimbatore.
          </p>
          <div className="flex gap-8">
            <a href="/privacy" className="text-sm text-muted-foreground hover:text-[#D4AF37] transition-colors font-medium">Privacy Policy</a>
            <a href="/terms" className="text-sm text-muted-foreground hover:text-[#D4AF37] transition-colors font-medium">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Massive Branding Background Text */}
      <div className="absolute -bottom-[12vw] left-0 right-0 flex justify-center pointer-events-none select-none">
        <h1 className="text-[30vw] font-black uppercase tracking-tighter serif text-[#D4AF37]/5 leading-none translate-y-[10%]">
          Kovais
        </h1>
      </div>
    </footer>
  );
}
