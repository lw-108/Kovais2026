"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { DesktopNav } from "@/components/desktop-nav";
import { MobileNav } from "@/components/mobile-nav";
import { Trophy, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { userService } from "@/lib/data-service";

export function Header() {
	const scrolled = useScroll(10);
    const [user, setUser] = useState<any>(null);
    const [points, setPoints] = useState(0);

    useEffect(() => {
        const checkUser = () => {
            const savedUser = localStorage.getItem("loggedInUser");
            if (savedUser) {
                try {
                    const u = JSON.parse(savedUser);
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
        // Check for updates every second to keep header synced
        const interval = setInterval(checkUser, 1000);
        return () => clearInterval(interval);
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
			<nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
				<div className="flex items-center gap-8">
					<a
						className={cn("flex items-center gap-2 rounded-2xl transition-all", hoverGold)}
						href="/"
					>
						<Logo className="h-5" />
                        <span className="font-bold text-lg hidden sm:block">KovaisVite</span>
					</a>
					<DesktopNav />
				</div>

				<div className="flex items-center gap-3">
                    {user && (
                        <Button variant="ghost" size="sm" className={cn("gap-2 text-[#D4AF37] hover:bg-[#D4AF37]/10", hoverGold)}>
                            <Trophy className="size-4" />
                            <span className="hidden md:block font-medium">{points.toLocaleString()} Pts</span>
                        </Button>
                    )}

                    <div className="h-6 w-px bg-border hidden md:block mx-1" />

                    <div className="flex items-center gap-3">
                        {user ? (
                            <div className="hidden items-center gap-3 md:flex">
                                <div className="flex items-center gap-2 pr-2">
                                    <div className="size-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-amber-200 p-0.5 shadow-sm">
                                        <div className="flex size-full items-center justify-center rounded-full bg-background">
                                            {user.emblem_url ? (
                                                <img src={user.emblem_url} alt="Avatar" className="size-full rounded-full" />
                                            ) : (
                                                <UserIcon className="size-4 text-[#D4AF37]" />
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium">{user.username}</span>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={handleLogout}
                                    className={cn("gap-2", hoverGold)}
                                >
                                    <LogOut className="size-4" />
                                    <span>Logout</span>
                                </Button>
                            </div>
                        ) : (
                            <div className="hidden md:block">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => window.location.href = '/hotel'} // Redirect to booking page to login
                                    className={cn("gap-2", hoverGold)}
                                >
                                    <LogIn className="size-4" />
                                    <span>Login</span>
                                </Button>
                            </div>
                        )}
                        <MobileNav 
                            isLoggedIn={!!user} 
                            setIsLoggedIn={() => {}} 
                            isHeaderScrolled={scrolled}
                        />
                    </div>
                </div>
			</nav>
		</header>
	);
}
