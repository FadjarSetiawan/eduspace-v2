// File: app/components/landing/StatsSection.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion"; // Opsional, kita pakai logic manual aja biar ringan

// Component Angka Animasi
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  
  // Logic simpel: Mulai hitung saat komponen di-load
  useEffect(() => {
    let start = 0;
    // Durasi animasi tergantung besarnya angka, kita set statis aja biar smooth
    const duration = 2000; 
    const stepTime = Math.abs(Math.floor(duration / end));
    
    const timer = setInterval(() => {
      start += Math.ceil(end / 100); // Increment per step
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 20); // Update tiap 20ms

    return () => clearInterval(timer);
  }, [end]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function StatsSection() {
  return (
    <section className="bg-[#050505] border-b border-white/5 py-24 relative overflow-hidden">
        
        {/* STATS COUNTER */}
        <div className="max-w-7xl mx-auto px-6 mb-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                <div className="space-y-2">
                    <h3 className="text-6xl md:text-7xl font-bold text-white tracking-tighter">
                        <Counter end={150} suffix="K+" />
                    </h3>
                    <p className="text-white/40 font-medium uppercase tracking-widest text-sm">Active Students</p>
                </div>
                <div className="space-y-2">
                    <h3 className="text-6xl md:text-7xl font-bold text-white tracking-tighter">
                        <Counter end={85} suffix="%" />
                    </h3>
                    <p className="text-white/40 font-medium uppercase tracking-widest text-sm">Completion Rate</p>
                </div>
                <div className="space-y-2">
                    <h3 className="text-6xl md:text-7xl font-bold text-white tracking-tighter">
                        <Counter end={500} suffix="+" />
                    </h3>
                    <p className="text-white/40 font-medium uppercase tracking-widest text-sm">Premium Modules</p>
                </div>
            </div>
        </div>

        {/* LOGO MARQUEE (Infinite Scroll) */}
        <div className="w-full overflow-hidden border-t border-white/5 py-12 bg-white/[0.02]">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-white/20 mb-8">Trusted by future talents from</p>
            
            <div className="relative w-full flex overflow-x-hidden">
                <div className="animate-scroll flex whitespace-nowrap gap-16 md:gap-24 items-center opacity-30 grayscale hover:opacity-50 transition-opacity duration-500">
                    {/* Logo Set 1 */}
                    <h3 className="text-2xl font-bold font-serif mx-4">HARVARD</h3>
                    <h3 className="text-2xl font-bold font-serif mx-4">GOOGLE</h3>
                    <h3 className="text-2xl font-bold font-serif mx-4">MICROSOFT</h3>
                    <h3 className="text-2xl font-bold font-serif mx-4">AMAZON</h3>
                    <h3 className="text-2xl font-bold font-serif mx-4">GOJEK</h3>
                    <h3 className="text-2xl font-bold font-serif mx-4">TRAVELOKA</h3>
                    <h3 className="text-2xl font-bold font-serif mx-4">TOKOPEDIA</h3>
                    <h3 className="text-2xl font-bold font-serif mx-4">OPENAI</h3>

                    {/* Logo Set 2 (Duplikat untuk efek seamless) */}
                    <h3 className="text-2xl font-bold font-serif mx-4">HARVARD</h3>
                    <h3 className="text-2xl font-bold font-serif mx-4">GOOGLE</h3>
                    <h3 className="text-2xl font-bold font-serif mx-4">MICROSOFT</h3>
                    <h3 className="text-2xl font-bold font-serif mx-4">AMAZON</h3>
                    <h3 className="text-2xl font-bold font-serif mx-4">GOJEK</h3>
                    <h3 className="text-2xl font-bold font-serif mx-4">TRAVELOKA</h3>
                    <h3 className="text-2xl font-bold font-serif mx-4">TOKOPEDIA</h3>
                    <h3 className="text-2xl font-bold font-serif mx-4">OPENAI</h3>
                </div>
            </div>
        </div>
    </section>
  );
}