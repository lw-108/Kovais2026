import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { bookingLinks, infoLinks } from "@/components/nav-links";
import { LinkItem } from "@/components/sheard";
import { cn } from "@/lib/utils";

export function DesktopNav() {
	const hoverGold = "hover:text-[#D4AF37] transition-colors duration-200 [&_svg]:hover:text-[#D4AF37] [&_svg]:transition-colors";

	return (
		<NavigationMenu className="hidden md:flex">
			<NavigationMenuList>
                {/* Home */}
				<NavigationMenuItem>
					<NavigationMenuLink asChild>
						<a className={cn("rounded-md px-4 py-2 text-sm font-medium", hoverGold)} href="/">
							Home
						</a>
					</NavigationMenuLink>
				</NavigationMenuItem>

                {/* About Us */}
				<NavigationMenuItem>
					<NavigationMenuLink asChild>
						<a className={cn("rounded-md px-4 py-2 text-sm font-medium", hoverGold)} href="/about">
							About Us
						</a>
					</NavigationMenuLink>
				</NavigationMenuItem>

                {/* Booking Dropdown */}
				<NavigationMenuItem>
					<NavigationMenuTrigger className={cn("bg-transparent", hoverGold)}>
						Booking
					</NavigationMenuTrigger>
					<NavigationMenuContent className="bg-muted/50 p-1 pr-1.5 dark:bg-background">
						<div className="rounded-2xl grid w-[400px] grid-cols-1 gap-2 border bg-popover p-2 shadow md:w-[600px] md:grid-cols-2">
							{bookingLinks.map((item, i) => (
								<NavigationMenuLink asChild key={`booking-${item.label}-${i}`}>
									<LinkItem {...item} className={hoverGold} />
								</NavigationMenuLink>
							))}
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>

                {/* Info Dropdown */}
				<NavigationMenuItem>
					<NavigationMenuTrigger className={cn("bg-transparent", hoverGold)}>
						Info
					</NavigationMenuTrigger>
					<NavigationMenuContent className="bg-muted/50 p-1 pr-1.5 dark:bg-background">
						<div className="rounded-2xl grid w-[300px] grid-cols-1 gap-2 border bg-popover p-2 shadow md:w-[400px]">
							{infoLinks.map((item, i) => (
								<NavigationMenuLink asChild key={`info-${item.label}-${i}`}>
									<LinkItem {...item} className={hoverGold} />
								</NavigationMenuLink>
							))}
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>

			</NavigationMenuList>
		</NavigationMenu>
	);
}
