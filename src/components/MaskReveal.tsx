import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import the favicon to use as the scaling mask
import favicon from '/favicon.png';

gsap.registerPlugin(ScrollTrigger);

interface MaskRevealProps {
  children: React.ReactNode;
}

export const MaskReveal: React.FC<MaskRevealProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<SVGImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=1500', 
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        }
      });

      // 1. Expand the mask hole
      tl.to(maskRef.current, {
        attr: {
          x: -2500,
          y: -2500,
          width: 5000,
          height: 5000
        },
        ease: "power2.in",
      })
      // 2. Completely remove the overlay from the layout
      .to(overlayRef.current, {
        opacity: 0,
        display: 'none', // Critical for preventing layout blocking
        pointerEvents: 'none',
        duration: 0.3
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen">
      {/* Background content layer: Transparent and stable */}
      <div className="absolute inset-0 z-0 bg-transparent">
        {children}
      </div>

      {/* Dark Premium Mask Overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 z-50 pointer-events-auto overflow-hidden"
      >
        <svg 
          className="w-full h-full"
          viewBox="0 0 100 100" 
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <mask id="reveal-mask">
              <rect x="-50" y="-50" width="200" height="200" fill="white" />
              <image 
                ref={maskRef}
                href={favicon} 
                x="45" y="45" 
                width="10" height="10" 
                style={{ filter: 'brightness(0)' }} 
              />
            </mask>
          </defs>
          <rect 
            x="-50" y="-50" width="200" height="200" 
            fill="#0a0a0a" 
            mask="url(#reveal-mask)" 
          />
        </svg>
      </div>
    </div>
  );
};







