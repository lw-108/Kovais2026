"use client";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { ArrowRight, ShieldCheck, Clock, Users, Heart } from "lucide-react";
import { useRef } from "react";
import type { Variants } from "framer-motion";
import { CountUp } from "@/components/ui/count-up";

export default function AboutSection3() {
  const heroRef = useRef<HTMLDivElement>(null);
  
  const revealVariants: Variants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      },
    }),
    hidden: {
      filter: "blur(8px)",
      y: 20,
      opacity: 0,
    },
  };

  const scaleVariants: Variants = {
    visible: (i: number) => ({
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.8,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      opacity: 0,
    },
  };

  const features = [
    {
      title: "Premium Quality",
      desc: "Only the finest products and techniques",
      icon: ShieldCheck
    },
    {
      title: "Always Available",
      desc: "Round-the-clock service excellence",
      icon: Clock
    },
    {
      title: "Expert Professionals",
      desc: "Trained & certified specialists",
      icon: Users
    },
    {
      title: "Guest First",
      desc: "Your comfort is our obsession",
      icon: Heart
    }
  ];

  return (
    <section className="py-24 px-6 relative" ref={heroRef}>
      <div className="max-w-6xl mx-auto">
        {/* Main Title */}
        <TimelineContent
          as="h1"
          animationNum={0}
          timelineRef={heroRef}
          className="text-5xl md:text-8xl serif text-foreground mb-12 tracking-tight"
        >
          Our Story
        </TimelineContent>

        {/* SVG Path Image Container - The "Old Layout" Image */}
        <TimelineContent
          as="figure"
          animationNum={2}
          timelineRef={heroRef}
          customVariants={scaleVariants}
          className="relative group w-full mb-16"
        >
          <svg
            className="w-full h-auto drop-shadow-2xl"
            width={"100%"}
            height={"100%"}
            viewBox="0 0 100 40"
          >
            <defs>
              <clipPath
                id="clip-inverted"
                clipPathUnits={"objectBoundingBox"}
              >
                <path
                  d="M0.0998072 1H0.422076H0.749756C0.767072 1 0.774207 0.961783 0.77561 0.942675V0.807325C0.777053 0.743631 0.791844 0.731953 0.799059 0.734076H0.969813C0.996268 0.730255 1.00088 0.693206 0.999875 0.675159V0.0700637C0.999875 0.0254777 0.985045 0.00477707 0.977629 0H0.902473C0.854975 0 0.890448 0.138535 0.850165 0.138535H0.0204424C0.00408849 0.142357 0 0.180467 0 0.199045V0.410828C0 0.449045 0.0136283 0.46603 0.0204424 0.469745H0.0523086C0.0696245 0.471019 0.0735527 0.497877 0.0733523 0.511146V0.915605C0.0723903 0.983121 0.090588 1 0.0998072 1Z"
                  fill="#D9D9D9"
                />
              </clipPath>
            </defs>
            <image
              clipPath="url(#clip-inverted)"
              preserveAspectRatio="xMidYMid slice"
              width={"100%"}
              height={"100%"}
              xlinkHref="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
              className="transition-all duration-700 hover:brightness-110"
            ></image>
          </svg>
        </TimelineContent>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8">
            <h2 className="text-3xl md:text-5xl font-monster text-foreground tracking-tight mb-8 leading-[1.1]">
              <VerticalCutReveal
                splitBy="words"
                staggerDuration={0.08}
                staggerFrom="first"
                reverse={false}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                  delay: 0.5,
                }}
              >
                A Decade of Exceptional Service
              </VerticalCutReveal>
            </h2>

            <TimelineContent
                as="div"
                animationNum={3}
                timelineRef={heroRef}
                customVariants={revealVariants}
                className="text-lg text-muted-foreground/90 leading-relaxed mb-12 max-w-2xl"
            >
                Since 2014, Kovais has redefined luxury in Coimbatore. We believe every visit should leave you feeling elevated — not just served. Our philosophy blends warm Tamil hospitality with world-class standards.
            </TimelineContent>

            {/* Feature Grid */}
            <div className="grid sm:grid-cols-2 gap-6 mb-16">
                {features.map((f, i) => (
                    <TimelineContent 
                        key={f.title}
                        as="div" 
                        animationNum={4 + i} 
                        timelineRef={heroRef} 
                        customVariants={revealVariants}
                        className="flex flex-col gap-2 p-6 rounded-2xl bg-muted/10 border border-border/40"
                    >
                        <f.icon className="size-5 text-[#D4AF37]" />
                        <div className="flex flex-col text-left">
                            <span className="font-bold text-foreground text-sm uppercase tracking-wider">{f.title}</span>
                            <span className="text-sm text-muted-foreground">{f.desc}</span>
                        </div>
                    </TimelineContent>
                ))}
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-12 pt-10 border-t border-border/40">
              <TimelineContent as="div" animationNum={8} timelineRef={heroRef} customVariants={revealVariants} className="flex flex-col">
                <span className="text-4xl font-bold text-[#D4AF37] serif">
                  <CountUp to={10} suffix="+" />
                </span>
                <span className="text-[10px] justify-center align-center uppercase tracking-widest text-muted-foreground font-bold">Years of Excellence</span>
              </TimelineContent>
              <TimelineContent as="div" animationNum={9} timelineRef={heroRef} customVariants={revealVariants} className="flex flex-col">
                <span className="text-4xl font-bold text-[#D4AF37] serif">
                  <CountUp to={5000} suffix="+" />
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Happy Guests</span>
              </TimelineContent>
              <TimelineContent as="div" animationNum={10} timelineRef={heroRef} customVariants={revealVariants} className="flex flex-col">
                <span className="text-4xl font-bold text-[#D4AF37] serif">
                   <CountUp to={25} />
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Premium Services</span>
              </TimelineContent>
              <TimelineContent as="div" animationNum={11} timelineRef={heroRef} customVariants={revealVariants} className="flex flex-col">
                <span className="text-4xl font-bold text-[#D4AF37] serif">
                   <CountUp to={24} suffix="/7" />
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Always Open</span>
              </TimelineContent>
            </div>
          </div>

          {/* Right Sidebar - Bento Style */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="relative p-8 bg-[#D4AF37]/5 border border-[#D4AF37]/10 flex flex-col items-center text-center backdrop-blur-sm overflow-hidden group">
              {/* 90 degree Photo Frame Corners for the WHOLE CARD */}
              <div className="absolute top-0 left-0 size-8 border-t-2 border-l-2 border-[#D4AF37] opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-0 right-0 size-8 border-t-2 border-r-2 border-[#D4AF37] opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 size-8 border-b-2 border-l-2 border-[#D4AF37] opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 size-8 border-b-2 border-r-2 border-[#D4AF37] opacity-60 group-hover:opacity-100 transition-opacity" />

              <TimelineContent
                as="div"
                animationNum={12}
                timelineRef={heroRef}
                customVariants={revealVariants}
                className="text-[#D4AF37] text-6xl italic font-light serif mb-1 tracking-tighter"
              >
                KOVAIS
              </TimelineContent>

              <TimelineContent
                as="div"
                animationNum={13}
                timelineRef={heroRef}
                customVariants={revealVariants}
                className="text-muted-foreground text-[10px] mb-8 font-bold uppercase tracking-[0.2em]"
              >
                Premium Service Collective
              </TimelineContent>

              <TimelineContent
                as="p"
                animationNum={14}
                timelineRef={heroRef}
                customVariants={revealVariants}
                className="text-foreground/80 font-medium mb-10 italic text-sm leading-relaxed"
              >
                "Redefining the standards of hospitality and professional care through dedicated service excellence."
              </TimelineContent>

              <TimelineContent
                as="button"
                animationNum={15}
                timelineRef={heroRef}
                customVariants={revealVariants}
                className="group relative bg-foreground text-background px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] overflow-hidden transition-all hover:bg-foreground/90 shadow-lg"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Book Experience <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </TimelineContent>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
