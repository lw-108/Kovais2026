"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { DesktopNav } from "@/components/desktop-nav";
import { MobileNav } from "@/components/mobile-nav";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { userService } from "@/lib/data-service";

export function Header() {
	const scrolled = useScroll(10);
    const [user, setUser] = useState<any>(null);
    const [points, setPoints] = useState(0);

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
								<div className="size-10 bg-[#D4AF37] p-0.5 shadow-lg">
									<div className="flex size-full items-center justify-center bg-white">
										{user.emblem_url ? (
											<img src={user.emblem_url} alt="Avatar" className="size-full object-cover" />
										) : (
											<UserIcon className="size-5 text-[#D4AF37]" />
										)}
									</div>
								</div>
							</div>
							<div className="flex flex-col">
								<span className="text-sm font-bold text-black">{user.username}</span>
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
							onClick={() => window.location.href = '/hotel'}
							className="hidden md:flex gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#B8962E] text-white font-black uppercase tracking-widest text-[10px] rounded-none transition-all duration-300 border-none shadow-lg shadow-[#D4AF37]/20"
						>
							<LogIn className="size-4" />
							<span>Login</span>
						</Button>
					)}
					
					<MobileNav 
						isLoggedIn={!!user} 
						setIsLoggedIn={() => {}} 
						isHeaderScrolled={scrolled}
					/>
				</div>
			</nav>
		</header>
	);
}
