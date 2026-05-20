"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu as MenuIcon, 
  X as XIcon, 
  ChevronDown, 
  User, 
  Calendar, 
  Clock, 
  LogOut, 
  LogIn,
  Scissors,
  Sparkles,
  Dumbbell,
  Hotel,
  Heart,
  Phone,
  Shield,
  FileText,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Portal, PortalBackdrop } from "@/components/ui/portal";
import { cn } from "@/lib/utils";

interface MobileNavProps {
    isLoggedIn: boolean;
    isHeaderScrolled?: boolean;
    onLoginClick?: () => void;
}

export function MobileNav({ isLoggedIn, onLoginClick }: MobileNavProps) {
	const [open, setOpen] = useState(false);
    const [bookingOpen, setBookingOpen] = useState(true); // Default open for better visibility


	const toggleMenu = () => setOpen(!open);

    const hoverGold = "hover:text-[#D4AF37] [&_svg]:hover:text-[#D4AF37] transition-all duration-200";

    const bookingLinks = [
        { label: "Hotel", desc: "Book luxury stays.", href: "/hotel", icon: Hotel },
        { label: "Barber Shop", desc: "Professional grooming.", href: "/barber", icon: Scissors },
        { label: "Spa Center", desc: "Relax and rejuvenate.", href: "/spa", icon: Sparkles },
        { label: "Parlour", desc: "Beauty treatments.", href: "/parlour", icon: Heart },
        { label: "Gym", desc: "Personal training.", href: "/gym", icon: Dumbbell },
        { label: "Function", desc: "Events and celebrations.", href: "/function", icon: Calendar },
        { label: "Funeral", desc: "Respectful services.", href: "/funeral", icon: Clock },
    ];

    const footerLinks = [
        { label: "Contact Us", desc: "Get in touch.", href: "/contact", icon: Phone },
        { label: "Privacy", desc: "Our privacy policy.", href: "/privacy", icon: Shield },
        { label: "Terms", desc: "Usage terms.", href: "/terms", icon: FileText },
        { label: "Refunds", desc: "Refund information.", href: "/refunds", icon: RotateCcw },
    ];

	return (
		<div className="md:hidden">
			<Button
				aria-label="Toggle menu"
				className={cn(
                    "relative z-[110] rounded-none p-2 border border-border bg-background hover:bg-muted transition-colors flex items-center justify-center w-10 h-10",
                    open && "opacity-0 pointer-events-none"
                )}
				onClick={toggleMenu}
				size="icon"
				variant="ghost"
				disabled={open}
			>
				<MenuIcon className="size-5 text-foreground" />
			</Button>

			<AnimatePresence>
                {open && (
                    <Portal className="z-[90]">
                        <PortalBackdrop 
                            className="bg-background/60 backdrop-blur-xl"
                            onClick={() => setOpen(false)} 
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-background border-l shadow-2xl overflow-y-auto pt-6 pb-10 flex flex-col"
                        >
                            {/* Explicit Close Button Inside Panel */}
                            <div className="absolute top-4 right-4 z-[150]">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => setOpen(false)}
                                    className="size-12 bg-[#D4AF37] hover:bg-[#B8962E] text-white rounded-none shadow-2xl transition-all duration-300"
                                >
                                    <XIcon className="size-6" />
                                </Button>
                            </div>

                            <div className="flex flex-col gap-y-6 px-6">
                                {/* Brand Identity */}
                                <div className="flex items-center justify-center py-6 border-b border-white/5 mb-6">
                                    <img 
                                        src="/logo.png" 
                                        alt="Kovais" 
                                        className="h-32 w-auto object-contain drop-shadow-2xl" 
                                    />
                                </div>

                                {/* User Info if logged in */}
                                {isLoggedIn && (
                                    <div className="flex items-center gap-3 p-4 bg-[#D4AF37] shadow-lg border-2 border-[#D4AF37] rounded-none">
                                        <div className="size-10 bg-background p-0.5 rounded-none">
                                            <div className="flex size-full items-center justify-center">
                                                <User className="size-5 text-[#D4AF37]" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col text-left flex-1">
                                            <span className="font-bold text-sm text-white">Lingen</span>
                                            <span className="text-[10px] text-white/80 uppercase tracking-widest font-black">Premium Member</span>
                                        </div>
                                        <div className="text-white text-xs font-black uppercase tracking-widest">
                                            2.5K Points
                                        </div>
                                    </div>
                                )}

                                {/* Main Sections */}
                                <div className="flex flex-col gap-4">
                                    {/* Booking Accordion */}
                                    <div className="flex flex-col border rounded-none overflow-hidden bg-muted/5">
                                        <button 
                                            onClick={() => setBookingOpen(!bookingOpen)}
                                            className="flex items-center justify-between p-4 w-full text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Calendar className="size-4 text-[#D4AF37]" />
                                                <span className="text-xs font-black uppercase tracking-[0.15em] text-foreground">Services & Booking</span>
                                            </div>
                                            <ChevronDown className={cn("size-4 text-[#D4AF37] transition-transform duration-300", bookingOpen && "rotate-180")} />
                                        </button>
                                        <AnimatePresence>
                                            {bookingOpen && (
                                                <motion.div 
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden bg-background/50 border-t"
                                                >
                                                    <div className="p-2 flex flex-col gap-1">
                                                        {bookingLinks.map((link) => (
                                                            <a
                                                                key={link.label}
                                                                href={link.href}
                                                                className={cn("flex items-center gap-4 p-4 text-sm font-medium rounded-none hover:bg-muted/30 group transition-all", hoverGold)}
                                                                onClick={() => setOpen(false)}
                                                            >
                                                                <div className="p-2 rounded-none bg-muted/50 group-hover:bg-[#D4AF37]/10 transition-colors">
                                                                    <link.icon className="size-4 text-[#D4AF37]" />
                                                                </div>
                                                                <div className="flex flex-col text-left">
                                                                    <span className="font-bold text-foreground">{link.label}</span>
                                                                    <span className="text-[10px] text-muted-foreground">{link.desc}</span>
                                                                </div>
                                                            </a>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Footer/Policy Section */}
                                    <div className="grid grid-cols-2 gap-2">
                                        {footerLinks.map((link) => (
                                            <a
                                                key={link.label}
                                                href={link.href}
                                                className="flex flex-col items-start gap-2 p-4 rounded-none border bg-muted/5 hover:bg-muted/10 transition-all group"
                                                onClick={() => setOpen(false)}
                                            >
                                                <link.icon className="size-4 text-[#D4AF37]" />
                                                <div className="flex flex-col text-left">
                                                    <span className="text-[11px] font-bold text-foreground">{link.label}</span>
                                                    <span className="text-[9px] text-muted-foreground line-clamp-1">{link.desc}</span>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                {/* Auth Action */}
                                 <div className="mt-auto pt-6 flex flex-col gap-3">
                                     {isLoggedIn ? (
                                         <Button 
                                             className="w-full h-14 gap-3 bg-[#D4AF37] hover:bg-[#B8962E] text-white font-black uppercase tracking-widest text-[10px] rounded-none shadow-lg shadow-[#D4AF37]/20" 
                                             variant="ghost"
                                             onClick={() => {
                                                 localStorage.removeItem("loggedInUser");
                                                 window.dispatchEvent(new Event("auth-change"));
                                                 setOpen(false);
                                             }}
                                         >
                                             <LogOut className="size-5" />
                                             <span>Logout</span>
                                         </Button>
                                     ) : (
                                         <Button 
                                             className="w-full h-14 gap-3 bg-[#D4AF37] hover:bg-[#B8962E] text-white font-black uppercase tracking-widest text-[10px] rounded-none shadow-lg shadow-[#D4AF37]/20"
                                             onClick={() => {
                                                 if (onLoginClick) {
                                                     onLoginClick();
                                                 } else {
                                                     window.location.href = '/hotel';
                                                 }
                                                 setOpen(false);
                                             }}
                                         >
                                             <LogIn className="size-5" />
                                             <span>Login to Kovais</span>
                                         </Button>
                                     )}
                                 </div>
                            </div>
                        </motion.div>
                    </Portal>
                )}
            </AnimatePresence>
		</div>
	);
}
