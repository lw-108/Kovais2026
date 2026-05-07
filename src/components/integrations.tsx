import { cn } from "@/lib/utils";
import { 
  Scissors, 
  HeartPulse, 
  CalendarDays, 
  Hotel, 
  Sparkles, 
  Dumbbell 
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";

type Integration = {
	name: string;
	icon: React.ReactNode;
    href: string;
};

const data: Integration[] = [
	{
		name: "Master Grooming",
		icon: <Scissors className="size-5 md:size-6 text-[#D4AF37]" />,
        href: "/grooming"
	},
	{
		name: "Special Care",
		icon: <HeartPulse className="size-5 md:size-6 text-[#D4AF37]" />,
        href: "/special-care"
	},
	{
		name: "Function Services",
		icon: <CalendarDays className="size-5 md:size-6 text-[#D4AF37]" />,
        href: "/booking/function"
	},
	{
		name: "Luxury Hotel",
		icon: <Hotel className="size-5 md:size-6 text-[#D4AF37]" />,
        href: "/hotel"
	},
	{
		name: "Wellness Spa",
		icon: <Sparkles className="size-5 md:size-6 text-[#D4AF37]" />,
        href: "/spa"
	},
	{
		name: "Fitness Studio",
		icon: <Dumbbell className="size-5 md:size-6 text-[#D4AF37]" />,
        href: "/fitness"
	},
];

export function Integrations() {
	return (
		<div className="flex flex-col items-center justify-center gap-6 py-12 md:py-20">
			<div className="max-w-xl space-y-2 px-4 text-center">
				<h2 className="font-monster text-2xl uppercase tracking-widest text-foreground md:text-3xl">
					Our Core Services
				</h2>
				<p className="text-sm text-muted-foreground md:text-base font-medium italic">
					Excellence in every detail, tailored to your premium lifestyle.
				</p>
			</div>

            <TooltipProvider delayDuration={0}>
                <div className="flex flex-nowrap justify-center rounded-full bg-secondary/10 backdrop-blur-md p-1.5 md:p-2 border border-[#D4AF37]/10">
                    <div className="flex flex-nowrap items-center justify-center -space-x-3 sm:-space-x-4 md:-space-x-6 px-1">
                        {data.map((item) => (
                            <Tooltip key={item.name}>
                                <TooltipTrigger asChild>
                                    <a
                                        href={item.href}
                                        className={cn(
                                            "relative z-0 transition-all hover:z-10 hover:scale-115 active:scale-95",
                                            "flex size-10 sm:size-14 md:size-20 items-center justify-center overflow-hidden rounded-full border bg-card shadow-lg",
                                            "hover:border-[#D4AF37] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]",
                                            "border-border/40 shrink-0"
                                        )}
                                    >
                                        {item.icon}
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent className="bg-[#D4AF37] text-white border-none font-bold uppercase tracking-tighter text-[10px]">
                                    <p>{item.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                </div>
            </TooltipProvider>
		</div>
	);
}
