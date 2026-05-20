"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { DesktopNav } from "@/components/desktop-nav";
import { MobileNav } from "@/components/mobile-nav";
import { LogIn, LogOut, User as UserIcon, Lock, Phone, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { userService } from "@/lib/data-service";
import Swal from "sweetalert2";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function Header() {
	const scrolled = useScroll(10);
    const [user, setUser] = useState<any>(null);
    const [points, setPoints] = useState(0);

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);
    const [loginData, setLoginData] = useState({ username: "", password: "", phone: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let lastUserStr = "";
        const checkUser = () => {
            const savedUserStr = localStorage.getItem("loggedInUser") || "";
            if (savedUserStr === lastUserStr) return;
            lastUserStr = savedUserStr;

            if (savedUserStr) {
                try {
                    const u = JSON.parse(savedUserStr);
                    if (u && u.user_id) {
                        setUser(u);
                        setPoints(userService.getPoints(u.user_id));
                    } else {
                        setUser(null);
                    }
                } catch (e) {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        checkUser();
        
        window.addEventListener("storage", checkUser);
        window.addEventListener("auth-change", checkUser);
        
        return () => {
            window.removeEventListener("storage", checkUser);
            window.removeEventListener("auth-change", checkUser);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("loggedInUser");
        setUser(null);
    };

    const handleLogin = async () => {
        setLoading(true);
        try {
            const u = await userService.login(loginData.username, loginData.password);
            setUser(u);
            setPoints(u.points);
            setShowLoginModal(false);
            Swal.fire({ icon: 'success', title: 'Identity Verified', text: "Welcome back to your sanctuary" });
        } catch (e) {
            Swal.fire({ icon: 'error', title: 'Verification Failed', text: "Invalid credentials" });
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async () => {
        setLoading(true);
        try {
            await userService.signup(loginData.username, loginData.phone, loginData.password);
            setIsNewUser(false);
            Swal.fire({ icon: 'success', title: 'Profile Created', text: "Your wellness journey begins now" });
        } catch (e) {
            Swal.fire({ icon: 'error', title: 'Error', text: "Profile creation failed" });
        } finally {
            setLoading(false);
        }
    };

    const hoverGold = "hover:text-[#D4AF37] [&_svg]:hover:text-[#D4AF37] transition-all duration-200";

	return (
		<header
			className={cn("sticky top-0 z-[100] w-full border-transparent border-b transition-all duration-300", {
				"border-border bg-background/95 backdrop-blur-sm shadow-sm":
					scrolled,
			})}
		>
			<nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 sm:px-8">
				<div className="flex items-center gap-12">
					<a
						className={cn("flex items-center gap-3 rounded-2xl transition-all", hoverGold)}
						href="/"
					>
						<img src="/logo.png" alt="KovaisVite" className="max-w-72 h-28 w-auto object-contain lg:max-w-80 lg:h-32 xl:max-w-96 xl:h-36" />
					</a>
					<DesktopNav />
				</div>

				<div className="flex items-center gap-4">
					<ThemeToggle />
					{user && (
						<div className="hidden items-center gap-3 md:flex">
							<div className="flex items-center gap-2 pr-3 border-r border-[#D4AF37]/20">
								<div className="size-10 bg-[#D4AF37] p-0.5 shadow-lg rounded-none">
									<div className="flex size-full items-center justify-center bg-background">
										{user.emblem_url ? (
											<img src={user.emblem_url} alt="Avatar" className="size-full object-cover" />
										) : (
											<UserIcon className="size-5 text-[#D4AF37]" />
										)}
									</div>
								</div>
							</div>
							<div className="flex flex-col">
								<span className="text-sm font-bold text-foreground">{user.username}</span>
								<span className="text-xs text-[#D4AF37] font-black uppercase tracking-widest">{points.toLocaleString()} Points</span>
							</div>
							<Button 
								variant="ghost" 
								size="sm" 
								onClick={handleLogout}
								className="gap-2 px-4 py-2 bg-[#D4AF37] hover:bg-[#B8962E] text-white font-black uppercase tracking-widest text-[10px] rounded-none transition-all duration-300"
							>
								<LogOut className="size-4" />
								<span>Logout</span>
							</Button>
						</div>
					)}
					
					{!user && (
						<Button 
							variant="outline" 
							size="lg" 
							onClick={() => setShowLoginModal(true)}
							className="hidden md:flex gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#B8962E] text-white font-black uppercase tracking-widest text-[10px] rounded-none transition-all duration-300 border-none shadow-lg shadow-[#D4AF37]/20"
						>
							<LogIn className="size-4" />
							<span>Login</span>
						</Button>
					)}
					
					<MobileNav 
						isLoggedIn={!!user} 
						isHeaderScrolled={scrolled}
						onLoginClick={() => setShowLoginModal(true)}
					/>
				</div>
			</nav>

			{/* --- Unified Elegant Login Modal --- */}
			<Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
				<DialogContent className="w-[calc(100%-2rem)] md:max-w-md p-8 bg-black/80 backdrop-blur-sm border border-[#D4AF37]/20 rounded-none shadow-2xl overflow-hidden text-white">
					{/* Frame corner clips */}
					<div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37] pointer-events-none" />
					<div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37] pointer-events-none" />
					
					<div className="space-y-8 relative z-10">
						<div className="text-center">
							<DialogTitle className="text-3xl font-black tracking-tight serif uppercase text-white">
								Wellness Access
							</DialogTitle>
							<DialogDescription className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-2 block">
								{isNewUser ? "Join our wellness circle" : "Verify your identity"}
							</DialogDescription>
						</div>
						
						<div className="space-y-4">
							<div className="relative">
								<User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#D4AF37]" />
								<input 
									className="w-full h-12 pl-10 pr-4 bg-white/5 border border-white/10 rounded-none focus:outline-none focus:border-[#D4AF37] text-white placeholder:text-white/40" 
									placeholder="Username" 
									value={loginData.username} 
									onChange={e => setLoginData({...loginData, username: e.target.value})} 
								/>
							</div>
							{isNewUser && (
								<div className="relative">
									<Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#D4AF37]" />
									<input 
										className="w-full h-12 pl-10 pr-4 bg-white/5 border border-white/10 rounded-none focus:outline-none focus:border-[#D4AF37] text-white placeholder:text-white/40" 
										placeholder="Phone Number" 
										value={loginData.phone} 
										onChange={e => setLoginData({...loginData, phone: e.target.value})} 
									/>
								</div>
							)}
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#D4AF37]" />
								<input 
									type="password" 
									className="w-full h-12 pl-10 pr-4 bg-white/5 border border-white/10 rounded-none focus:outline-none focus:border-[#D4AF37] text-white placeholder:text-white/40" 
									placeholder="Password" 
									value={loginData.password} 
									onChange={e => setLoginData({...loginData, password: e.target.value})} 
								/>
							</div>
							
							<Button 
								className="w-full h-12 bg-[#D4AF37] hover:bg-[#B8962E] text-stone-950 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-none transition-all duration-300" 
								onClick={isNewUser ? handleSignup : handleLogin} 
								disabled={loading}
							>
								{loading ? "Processing..." : isNewUser ? "Create Profile" : "Authenticate"}
							</Button>

							<div className="text-center">
								<button 
									className="text-[10px] font-black uppercase text-[#D4AF37] hover:underline" 
									onClick={() => setIsNewUser(!isNewUser)}
								>
									{isNewUser ? "Member already? Login" : "New here? Begin journey"}
								</button>
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</header>
	);
}
