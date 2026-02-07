// File: app/components/landing/HeroSection.tsx
"use client";

import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-20">
      
      {/* --- FLOATING PILLS (Wellfound Style) --- */}
      {/* Kita sebar posisi absolute-nya secara manual agar terlihat natural */}
      <div className="absolute inset-0 pointer-events-none opacity-40 md:opacity-100">
        
        {/* Kiri Atas */}
        <div className="absolute top-[20%] left-[10%] animate-float-slow">
            <div className="px-4 py-2 rounded-full border border-white/10 bg-[#111] text-xs font-mono text-white/50 backdrop-blur-md shadow-xl">Python Developers</div>
        </div>
        <div className="absolute top-[35%] left-[5%] animate-float">
            <div className="px-4 py-2 rounded-full border border-white/10 bg-[#111] text-xs font-mono text-white/50 backdrop-blur-md shadow-xl animation-delay-2000">UI/UX Design</div>
        </div>
        <div className="absolute top-[55%] left-[12%] animate-float-fast">
            <div className="px-4 py-2 rounded-full border border-white/10 bg-[#111] text-xs font-mono text-white/50 backdrop-blur-md shadow-xl">Data Science</div>
        </div>

        {/* Kanan Atas */}
        <div className="absolute top-[15%] right-[15%] animate-float">
            <div className="px-4 py-2 rounded-full border border-white/10 bg-[#111] text-xs font-mono text-white/50 backdrop-blur-md shadow-xl animation-delay-4000">React.js</div>
        </div>
        <div className="absolute top-[40%] right-[8%] animate-float-slow">
            <div className="px-4 py-2 rounded-full border border-white/10 bg-[#111] text-xs font-mono text-white/50 backdrop-blur-md shadow-xl">Next.js Experts</div>
        </div>
        
        {/* Bawah */}
        <div className="absolute bottom-[20%] left-[25%] animate-float-fast">
            <div className="px-4 py-2 rounded-full border border-white/10 bg-[#111] text-xs font-mono text-white/50 backdrop-blur-md shadow-xl animation-delay-2000">Machine Learning</div>
        </div>
        <div className="absolute bottom-[25%] right-[20%] animate-float">
            <div className="px-4 py-2 rounded-full border border-white/10 bg-[#111] text-xs font-mono text-white/50 backdrop-blur-md shadow-xl">Fullstack</div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 text-center max-w-5xl px-6">
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60 animate-in fade-in zoom-in duration-1000">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            Revolusi Pendidikan 4.0
        </div>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-white animate-in slide-in-from-bottom-10 fade-in duration-1000">
            Find what's <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Next.</span>
        </h1>

        <p className="text-lg md:text-xl text-white/40 mb-12 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-100">
            Platform all-in-one untuk menguasai skill teknologi masa depan. 
            Tanpa ribet. Tanpa batas.
        </p>

        {/* Search Bar Style CTA */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in slide-in-from-bottom-14 fade-in duration-1000 delay-200">
            <div className="relative group w-full md:w-auto">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 to-white/10 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                <Link 
                    href="/register" 
                    className="relative px-10 py-5 bg-black rounded-full leading-none flex items-center gap-3 text-white font-bold border border-white/10 hover:bg-white hover:text-black transition duration-300 w-full md:w-auto justify-center"
                >
                    Mulai Belajar Sekarang <ArrowRight size={18} />
                </Link>
            </div>
            
            <Link 
                href="#features" 
                className="px-10 py-5 rounded-full flex items-center gap-2 text-white/60 font-medium hover:text-white transition w-full md:w-auto justify-center"
            >
                <Search size={18} /> Jelajahi Katalog
            </Link>
        </div>
      </div>

      {/* Fade Bottom Effect */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent z-10"></div>
    </section>
  );
}