import { cn } from "@/lib/utils";
import type React from "react";

export type LinkItemType = {
	label: string;
	href: string;
	icon: React.ReactNode;
	description?: string;
};

export function LinkItem({
	label,
	description,
	icon,
	className,
	href,
	...props
}: React.ComponentProps<"a"> & LinkItemType) {
	return (
		<a
			className={cn(
				"group flex items-center gap-x-2 rounded-lg p-2 transition-colors",
				className
			)}
			href={href}
			{...props}
		>
			<div
				className={cn(
					"flex aspect-square size-10 items-center justify-center rounded-md border bg-card text-sm shadow-sm",
					"transition-colors group-hover:border-[#D4AF37]/50 group-hover:bg-[#D4AF37]/5",
					"[&_svg]:size-5 [&_svg]:text-foreground transition-colors group-hover:[&_svg]:text-[#D4AF37]"
				)}
			>
				{icon}
			</div>
			<div className="flex flex-col items-start justify-center">
				<span className="font-medium transition-colors group-hover:text-[#D4AF37]">{label}</span>
				{description && (
					<span className="line-clamp-1 text-muted-foreground text-[10px]">
						{description}
					</span>
				)}
			</div>
		</a>
	);
}
