"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Phone, 
  HelpCircle,
  Volume2
} from "lucide-react";

interface Step {
  title: string;
  titleTa: string; // Tamil translation for accessibility
  description: string;
  descriptionTa: string;
  icon: React.ComponentType<{ className?: string }>;
  anchorId: string; // Scroll target ID
}

interface ServiceGuideProps {
  steps: Step[];
  serviceName: string;
}

export function ServiceGuide({ steps, serviceName }: ServiceGuideProps) {
  const [showEasyGuide, setShowEasyGuide] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Smooth scroll handler
  const handleScroll = (id: string) => {
    const element = document.getElementById(id.replace("#", ""));
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Speaks guidance text using speech synthesis (Accessibility feature)
  const speakGuidance = () => {
    if ("speechSynthesis" in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }

      setIsPlayingAudio(true);
      const textToSpeak = `Welcome to the ${serviceName} booking helper. Here are 4 simple steps to book. 
        Step 1: ${steps[0].title}. ${steps[0].description}. 
        Step 2: ${steps[1].title}. ${steps[1].description}. 
        Step 3: ${steps[2].title}. ${steps[2].description}. 
        Step 4: ${steps[3].title}. ${steps[3].description}. 
        Or, you can press the WhatsApp button to book directly with our assistant.`;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported on this browser.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 relative z-30">
      {/* Self-contained dash animation style */}
      <style>{`
        @keyframes dash-flow {
          to {
            stroke-dashoffset: -24;
          }
        }
        .animate-svg-arrow {
          stroke-dasharray: 8, 8;
          animation: dash-flow 1.2s linear infinite;
        }
      `}</style>

      {/* Main Container */}
      <div className="bg-[#0b0b0b]/80 backdrop-blur-md border border-[#D4AF37]/20 p-8 md:p-12 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 blur-[80px] rounded-full pointer-events-none -z-10" />

        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-[#D4AF37]/10 pb-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-2 block">
              Easy Booking Guide • எளிய வழிமுறை
            </span>
            <h2 className="text-2xl md:text-4xl font-black serif uppercase tracking-tight text-white">
              How to Book Your <span className="text-[#D4AF37] italic">Ritual</span>
            </h2>
            <p className="text-white/50 text-xs md:text-sm font-medium mt-1">
              Click any step to jump straight to that section.
            </p>
          </div>

          {/* Quick Help Toggles */}
          <div className="flex flex-wrap gap-4">
            {/* Audio Assistant */}
            <button
              onClick={speakGuidance}
              className={`flex items-center gap-2 px-5 h-12 text-xs font-black uppercase tracking-wider transition-all duration-300 border ${
                isPlayingAudio 
                  ? "bg-[#D4AF37] border-[#D4AF37] text-stone-950" 
                  : "bg-white/5 border-white/10 text-white hover:border-[#D4AF37] hover:text-[#D4AF37]"
              }`}
            >
              <Volume2 className="size-4 animate-pulse" />
              <span>{isPlayingAudio ? "Stop Assistant" : "Voice Guide (ஒலி வழிகாட்டி)"}</span>
            </button>

            {/* Visual/Simple Mode */}
            <button
              onClick={() => setShowEasyGuide(!showEasyGuide)}
              className={`flex items-center gap-2 px-5 h-12 text-xs font-black uppercase tracking-wider transition-all duration-300 border ${
                showEasyGuide 
                  ? "bg-[#D4AF37] border-[#D4AF37] text-stone-950" 
                  : "bg-white/5 border-white/10 text-white hover:border-[#D4AF37] hover:text-[#D4AF37]"
              }`}
            >
              <HelpCircle className="size-4" />
              <span>{showEasyGuide ? "Hide Easy Guide" : "Easy Mode / தமிழ்"}</span>
            </button>
          </div>
        </div>

        {/* Interactive Steps Grid with Animating Arrows */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative group flex flex-col items-center lg:items-start text-center lg:text-left">
                {/* SVG Connecting Arrows (Desktop Only) */}
                {index < 3 && (
                  <div className="hidden lg:block absolute top-8 left-[4.5rem] w-[calc(100%-2.5rem)] h-8 z-20 pointer-events-none overflow-visible">
                    <svg className="w-full h-full" viewBox="0 0 160 30" fill="none">
                      <path
                        d="M 10 15 Q 80 0, 150 15"
                        stroke="#D4AF37"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="animate-svg-arrow"
                      />
                      <polygon points="148,9 155,15 148,21" fill="#D4AF37" />
                    </svg>
                  </div>
                )}

                {/* SVG Connecting Arrows (Mobile Only - Vertically connecting) */}
                {index < 3 && (
                  <div className="lg:hidden w-8 h-12 my-2 pointer-events-none overflow-visible flex items-center justify-center">
                    <svg className="w-8 h-full" viewBox="0 0 30 80" fill="none">
                      <path
                        d="M 15 5 Q 10 40, 15 75"
                        stroke="#D4AF37"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="animate-svg-arrow"
                      />
                      <polygon points="9,70 15,77 21,70" fill="#D4AF37" />
                    </svg>
                  </div>
                )}

                {/* Step Circle & Icon */}
                <button
                  onClick={() => handleScroll(step.anchorId)}
                  className="size-16 rounded-full bg-white/5 border border-white/10 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 text-[#D4AF37] flex items-center justify-center transition-all duration-300 relative z-10 group shadow-lg group-hover:scale-110"
                >
                  <Icon className="size-7" />
                  <span className="absolute -top-1.5 -right-1.5 size-6 rounded-full bg-[#D4AF37] text-stone-950 flex items-center justify-center text-[10px] font-black">
                    {index + 1}
                  </span>
                </button>

                {/* Content */}
                <div className="mt-6 space-y-2 max-w-xs">
                  <button 
                    onClick={() => handleScroll(step.anchorId)}
                    className="font-black text-sm uppercase tracking-wider text-white hover:text-[#D4AF37] transition-colors block mx-auto lg:mx-0 text-center lg:text-left"
                  >
                    {step.title}
                  </button>
                  <p className="text-[11px] text-white/50 leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Accessibility & Simplified Information Box */}
        {showEasyGuide && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 p-6 md:p-8 bg-[#D4AF37]/5 border border-[#D4AF37]/30 text-white space-y-8 relative"
          >
            <div className="absolute top-0 left-0 size-3 border-t border-l border-[#D4AF37]" />
            <div className="absolute bottom-0 right-0 size-3 border-b border-r border-[#D4AF37]" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Simplified Step Translation List */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">
                  Simple Steps (எளிதான வழிகாட்டி):
                </h4>
                <div className="space-y-4">
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="size-6 bg-[#D4AF37] text-stone-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5 rounded-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase text-white tracking-wide">
                          {step.titleTa} ({step.title})
                        </div>
                        <div className="text-[11px] text-white/60 mt-0.5">
                          {step.descriptionTa}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Booking & Support Options for Uneducated Users */}
              <div className="space-y-6 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-8">
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">
                    Difficulty Booking? (புக் செய்ய கஷ்டமாக உள்ளதா?)
                  </h4>
                  <p className="text-[11px] text-white/60 leading-relaxed font-medium">
                    Call us or chat directly on WhatsApp. Our assistants will take care of all booking steps for you!
                    (எங்களை அழைக்கவும் அல்லது வாட்ஸ்அப் வழியாக மெசேஜ் அனுப்பவும். நாங்கள் உங்களுக்காக அனைத்தையும் செய்வோம்!)
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 px-2 py-3">
                  {/* WhatsApp Direct Shortcut */}
                  <a
                    href={`https://wa.me/919234567891?text=Hi,%20I%20want%20to%20book%20a%20service%20for%20${encodeURIComponent(serviceName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-4 px-6 bg-[#D4AF37] hover:bg-[#bba033] text-white font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-[#D4AF37]/20 border border-[#D4AF37]/30"
                  >
                    <MessageSquare className="size-5 shrink-0" />
                    <span className="text-center">Book on WhatsApp<br/>(வாட்ஸ்அப் செய்ய)</span>
                  </a>

                  {/* Call Direct Shortcut */}
                  <a
                    href="tel:+919234567891"
                    className="flex-1 py-4 px-6 bg-[#D4AF37] hover:bg-[#bba033] text-white font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-[#D4AF37]/20 border border-[#D4AF37]/30"
                  >
                    <Phone className="size-5 shrink-0" />
                    <span className="text-center">Call Concierge<br/>(எங்களை அழைக்க)</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
