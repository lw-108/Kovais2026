import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// Import the favicon to use as the scaling mask
import favicon from '/favicon.png';

interface MaskRevealProps {
  children: React.ReactNode;
}

export const MaskReveal: React.FC<MaskRevealProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<SVGImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    // Lock scroll on mount
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      const progressObj = { value: 0 };
      
      const statusMessages = [
        { min: 0, text: "INITIALIZING PORTAL..." },
        { min: 20, text: "AUTHENTICATING LUXURY ENVIRONMENT..." },
        { min: 45, text: "CURATING VIRTUAL COMFORT..." },
        { min: 70, text: "ESTABLISHING GOLD STANDARDS..." },
        { min: 90, text: "WELCOME TO KOVAIS" }
      ];

      // Loader timeline: counts up from 0 to 100
      const loaderTl = gsap.timeline({
        onComplete: () => {
          triggerZoomReveal();
        }
      });

      loaderTl.to(progressObj, {
        value: 100,
        duration: 3, // 3 seconds count up
        ease: "power2.out",
        onUpdate: () => {
          const currentVal = Math.floor(progressObj.value);
          
          if (percentRef.current) {
            percentRef.current.innerText = currentVal.toString().padStart(2, '0');
          }
          if (progressLineRef.current) {
            progressLineRef.current.style.width = `${currentVal}%`;
          }

          // Update status text dynamically
          const match = [...statusMessages].reverse().find(msg => currentVal >= msg.min);
          if (match && statusRef.current && statusRef.current.innerText !== match.text) {
            statusRef.current.innerText = match.text;
          }
        }
      });

      const triggerZoomReveal = () => {
        const zoomTl = gsap.timeline({
          onComplete: () => {
            setLoading(false);
            document.body.style.overflow = 'unset';
          }
        });

        zoomTl
          // 1. Fade out the text and loader elements with an elegant scale down
          .to('.loader-element', {
            opacity: 0,
            y: -30,
            stagger: 0.1,
            duration: 0.6,
            ease: "power3.inOut"
          })
          // 2. Open the mask in the center (favicon shape appears)
          .to(maskRef.current, {
            attr: {
              x: 45,
              y: 45,
              width: 10,
              height: 10
            },
            duration: 0.8,
            ease: "back.out(1.5)"
          }, "+=0.1")
          // 3. Zoom the favicon mask massively to reveal the website
          .to(maskRef.current, {
            attr: {
              x: -9000,
              y: -9000,
              width: 18000,
              height: 18000
            },
            duration: 2.2,
            ease: "power4.inOut"
          }, "+=0.2")
          // 4. Smoothly fade out the black overlay container
          .to(overlayRef.current, {
            opacity: 0,
            duration: 0.6,
            ease: "power2.out"
          }, "-=0.6")
          // 5. Hide the overlay entirely
          .set(overlayRef.current, {
            display: 'none'
          });
      };
    }, containerRef);

    return () => {
      document.body.style.overflow = 'unset';
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Background content layer: Transparent and stable */}
      <div className="relative w-full z-0">
        {children}
      </div>

      {/* Dark Premium Mask Overlay: Covers full screen */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 z-[9999] pointer-events-auto overflow-hidden flex items-center justify-center"
        style={{ background: 'transparent' }}
      >
        {/* SVG Mask Layer */}
        <svg 
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100" 
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <mask id="reveal-mask">
              {/* White rect keeps the masked overlay visible */}
              <rect x="-50" y="-50" width="200" height="200" fill="white" />
              {/* Black image starts at width/height 0 (solid overlay) and zooms up */}
              <image 
                ref={maskRef}
                href={favicon} 
                x="50" y="50" 
                width="0" height="0" 
                style={{ filter: 'brightness(0)' }} 
              />
            </mask>
          </defs>
          {/* Opaque black background, clipped by the mask */}
          <rect 
            x="-50" y="-50" width="200" height="200" 
            fill="#070707" 
            mask="url(#reveal-mask)" 
          />
        </svg>

        {/* Elegant Preloader UI Elements */}
        {loading && (
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 select-none pointer-events-none">
            {/* Header/Branding */}
            <div className="loader-element text-white/40 tracking-[0.4em] font-sans text-xs uppercase mb-8 font-semibold">
              KOVAIS COIMBATORE
            </div>

            {/* Percentage Display */}
            <div className="loader-element flex items-baseline justify-center">
              <span 
                ref={percentRef} 
                className="text-[18vw] sm:text-[14vw] md:text-[10vw] font-instrument-serif italic text-primary leading-none font-light tracking-tighter"
              >
                00
              </span>
              <span className="text-white/20 text-[5vw] sm:text-[3vw] ml-2 font-sans font-normal">%</span>
            </div>

            {/* Fine Progress Line */}
            <div className="loader-element w-48 sm:w-64 h-[1px] bg-white/10 relative overflow-hidden my-6">
              <div 
                ref={progressLineRef} 
                className="h-full bg-primary absolute left-0 top-0 transition-all duration-75"
                style={{ width: '0%' }}
              />
            </div>

            {/* Changing status caption */}
            <div 
              ref={statusRef} 
              className="loader-element text-white/50 tracking-[0.2em] font-sans text-[10px] sm:text-xs uppercase min-h-[1.5rem]"
            >
              INITIALIZING PORTAL...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
