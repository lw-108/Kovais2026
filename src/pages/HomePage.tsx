import { Component as EtheralShadow } from "@/components/ui/etheral-shadow";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero";
import { MaskReveal } from "@/components/MaskReveal";
import { LuxuryCarousel } from "@/components/LuxuryCarousel";
import { Integrations } from "@/components/integrations";
import AboutSection3 from "@/components/ui/about-section";
import Features from "@/components/features";
import { HowItWorks } from "@/components/how-it-works";
import { GalleryGrid } from "@/components/ui/gallery-grid";
import { Recognition } from "@/components/recognition";
import { Testimonials } from "@/components/testimonials";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full">
      {/* Background Shadow Component */}
      <div className="fixed inset-0 -z-10 h-full w-full">
        <EtheralShadow
          color="rgba(128, 128, 128, 0.4)"
          animation={{ scale: 100, speed: 60 }}
          noise={{ opacity: 0.2, scale: 1.0 }}
          sizing="fill"
          showText={false}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="relative flex-1 pb-20">
          <MaskReveal>
            <LuxuryCarousel />
          </MaskReveal>
          <HeroSection />
          <Integrations />
          <AboutSection3 />
          <Features />
          <HowItWorks />
          <GalleryGrid />
          <Recognition />
          <Testimonials />
          <CTA />
        </main>
        <Footer />
      </div>
    </div>
  );
}
