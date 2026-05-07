import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, PhoneCall, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import images
import img1 from "@/assets/1.jpg";
import img2 from "@/assets/2.jpg";
import img3 from "@/assets/3.png";

const images = [img1, img2, img3];

export function HeroSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000); // Change image every 5 seconds
        return () => clearInterval(timer);
    }, []);

	return (
		<section className="mx-auto w-full max-w-5xl overflow-hidden pt-16">
			{/* Shades */}
			<div
				aria-hidden="true"
				className="absolute inset-0 size-full overflow-hidden"
			>
				<div
					className={cn(
						"absolute inset-0 isolate -z-10",
						"bg-[radial-gradient(20%_80%_at_20%_0%,--theme(--color-foreground/.1),transparent)]"
					)}
				/>
			</div>
			<div className="relative z-10 flex max-w-2xl flex-col gap-5 px-4">
				<div
					className={cn(
						"group flex w-fit items-center gap-3 rounded-full border bg-card p-1 pr-3 shadow-xs",
						"fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards transition-all delay-500 duration-500 ease-out"
					)}
				>
					<div className="rounded-full border bg-primary/10 px-2 py-0.5 shadow-sm">
						<p className="font-bold text-[10px] text-primary uppercase tracking-tighter">Kovais</p>
					</div>

					<span className="text-[10px] font-bold uppercase tracking-widest text-foreground/70">Est. 2014 · Coimbatore's Finest</span>

					<div className="pl-1">
						<Sparkles className="size-3 text-primary animate-pulse" />
					</div>
				</div>

				<h1
					className={cn(
						"text-balance font-instrument-serif text-6xl md:text-8xl text-foreground leading-[1.1] ",
						"fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-100 duration-500 ease-out"
					)}
				>
					Where Luxury Meets <span className="text-[#D4AF37] font-instrument-serif tracking-normal text-6xl md:text-9xl ">Wellness</span>

				</h1>

				<p
					className={cn(
						"text-muted-foreground text-sm tracking-wide sm:text-lg md:text-xl font-medium max-w-lg",
						"fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-200 duration-500 ease-out"
					)}
				>
					Premium hospitality, spa, grooming {"&"} fitness — all under one roof.
				</p>

				<div className="fade-in slide-in-from-bottom-10 flex w-fit animate-in items-center justify-center gap-3 fill-mode-backwards pt-4 delay-300 duration-500 ease-out">
					<Button className="items-center flex justify-center border-[#D4AF37] bg-[#D4AF37] hover:bg-[#B8962E] text-white px-8 py-6 rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-[#D4AF37]/20 transition-all hover:scale-105 active:scale-95">
						Book a Service{" "}
						<ArrowRight data-icon="inline-end" className="size-4 ml-2" />
					</Button>
				</div>
			</div>
			<div className="relative">
				<div
					className={cn(
						"absolute -inset-x-20 inset-y-0 -translate-y-1/3 scale-120 rounded-full",
						"bg-[radial-gradient(ellipse_at_center,theme(--color-foreground/.1),transparent,transparent)]",
						"blur-[50px]"
					)}
				/>
				<div
					className={cn(
						"relative mt-12 overflow-hidden px-2 sm:mt-16 md:mt-24",
						"fade-in slide-in-from-bottom-5 animate-in fill-mode-backwards delay-100 duration-1000 ease-out"
					)}
				>
					<div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl border bg-background/50 backdrop-blur-md p-2 shadow-2xl ring-1 ring-white/10">
                        <div className="relative aspect-[2.4/1] w-full overflow-hidden rounded-xl bg-black/5">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full w-full"
                                >
                                    <img
                                        src={images[currentIndex]}
                                        alt={`Slide ${currentIndex + 1}`}
                                        className="h-full w-full object-cover"
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Carousel Indicators */}
                            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3 z-20">
                                {images.map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "h-1 rounded-full transition-all duration-500",
                                            i === currentIndex ? "w-10 bg-[#D4AF37]" : "w-2 bg-white/30"
                                        )}
                                    />
                                ))}
                            </div>

                            {/* Vignette Overlay */}
                            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        </div>
					</div>
				</div>
			</div>
		</section>
	);
}
