import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LazyImage } from "@/components/ui/lazy-image";

import { Link } from "react-router-dom";

// Import images
import img1 from "@/assets/1.jpg";
import img2 from "@/assets/2.jpg";
import img3 from "@/assets/3.png";

const images = [img1, img2, img3];

export function HeroSection() {
	return (
		<section className="relative w-full h-[60vh] min-h-[500px] flex items-center overflow-hidden">
			{/* Subtle Background Effect */}
			{/* <div className="absolute inset-0 z-0">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(212,175,55,0.05),transparent)]" />
				<div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
			</div> */}

			{/* Overlaid Content */}
			<div className="relative z-20 container mx-auto px-4 flex flex-col gap-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className={cn(
						"group flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md p-1 pr-3"
					)}
				>
					<div className="rounded-full bg-primary/20 px-2 py-0.5">
						<p className="font-bold text-[10px] text-primary uppercase tracking-tighter">Kovais</p>
					</div>
					<span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Est. 2014 · Coimbatore's Finest</span>
					<Sparkles className="size-3 text-primary animate-pulse" />
				</motion.div>

				<motion.h1
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, delay: 0.2 }}
					className="max-w-4xl font-instrument-serif text-5xl md:text-8xl text-white leading-[1.1]"
				>
					Where Luxury Meets <span className="text-primary tracking-normal italic">Wellness</span>
				</motion.h1>

				<motion.p
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, delay: 0.4 }}
					className="text-white/70 text-sm tracking-wide sm:text-lg md:text-xl font-medium max-w-2xl"
				>
					Premium hospitality, spa, grooming {"&"} fitness — all under one roof.
				</motion.p>

				<motion.div 
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, delay: 0.6 }}
					className="flex flex-wrap gap-4 pt-4"
				>
					<Link to="/services">
						<Button className="rounded-none border-primary bg-primary hover:bg-primary/90 text-white px-10 py-8 text-2xl font-instrument-serif shadow-2xl transition-all hover:scale-105 active:scale-95">
							Book a Service
							<ArrowRight className="size-5 ml-3" />
						</Button>
					</Link>
				</motion.div>
			</div>
		</section>
	);
}


