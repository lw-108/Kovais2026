import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface MaskRevealProps {
  // No children needed for standalone intro
}

export const MaskReveal: React.FC<MaskRevealProps> = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const maskTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: '+=200%', 
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        }
      });

      maskTimeline
        .to('.masked-content', { 
           scale: 1.5, 
           maskSize: '12000%', 
           webkitMaskSize: '12000%',
           duration: 3,
           ease: "power2.in",
           onComplete: () => {
             gsap.set('.masked-content', { maskImage: 'none', webkitMaskImage: 'none' });
           }
        })
        .to(triggerRef.current, {
           backgroundColor: 'rgba(0,0,0,0)',
           duration: 0.5,
           ease: "power1.inOut"
        }, "-=0.5")
        .to(triggerRef.current, {
           opacity: 0,
           display: 'none',
           duration: 0.5,
        }, "+=0.1");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-[50]">
      <div 
        ref={triggerRef} 
        id="art"
        className="relative h-screen w-full overflow-hidden bg-black"
      >
        {/* The Luxury Image to be revealed */}
        <div 
          className="masked-content masked-img relative z-10 w-full h-full bg-[url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center"
        />
      </div>
    </section>
  );
};
