// File: app/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { 
  ArrowRight, CheckCircle2, Shield, LayoutDashboard, 
  Users, Trophy, PlayCircle, XCircle, ChevronDown 
} from "lucide-react";

// IMPORT KOMPONEN BARU
import HeroSection from "./components/landing/HeroSection";
import StatsSection from "./components/landing/StatsSection";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-[#050505] text-[#e1e1e1] selection:bg-white selection:text-black font-sans">
      
      {/* 1. NAVBAR (Tetap sama) */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-bold text-lg">E</div>
            <span className="font-bold text-lg tracking-tight text-white">EDUSPACE</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/50">
            <Link href="#problems" className="hover:text-white transition">Masalah</Link>
            <Link href="#features" className="hover:text-white transition">Fitur</Link>
            <Link href="#faq" className="hover:text-white transition">FAQ</Link>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <Link href="/dashboard" className="px-5 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition flex items-center gap-2">
                Dashboard <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-white/60 hover:text-white transition">
                  Masuk
                </Link>
                <Link href="/register" className="px-5 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition">
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION (NEW WELLFOUND STYLE) */}
      <HeroSection />

      {/* 3. STATS & LOGO MARQUEE (NEW ANIMATED) */}
      <StatsSection />

      {/* 4. PROBLEM SOLVING SECTION */}
      <section id="problems" className="py-32 px-6 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Mengapa Belajar Sendiri Itu Sulit?</h2>
                <p className="text-white/40">Kami memahami frustrasi Anda saat mencoba belajar skill baru secara otodidak.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Masalah (The Old Way) */}
                <div className="p-8 rounded-3xl bg-[#111] border border-red-500/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition"><XCircle size={100} /></div>
                    <h3 className="text-xl font-bold text-white/60 mb-6 flex items-center gap-2">
                        <XCircle size={20} className="text-red-500/50"/> Cara Lama
                    </h3>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3 text-white/40">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500/30"></span>
                            Materi tersebar, tidak terstruktur.
                        </li>
                        <li className="flex items-start gap-3 text-white/40">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500/30"></span>
                            Tidak ada mentor, sering stuck saat error.
                        </li>
                        <li className="flex items-start gap-3 text-white/40">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500/30"></span>
                            Kesepian dan mudah hilang motivasi.
                        </li>
                    </ul>
                </div>

                {/* Solusi (The Eduspace Way) */}
                <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/20 relative overflow-hidden group hover:border-white/40 transition duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition"><CheckCircle2 size={100} /></div>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <CheckCircle2 size={20} className="text-white"/> Solusi Eduspace
                    </h3>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3 text-white/90">
                            <CheckCircle2 size={16} className="mt-1 text-white"/>
                            Kurikulum terstruktur & tervalidasi industri.
                        </li>
                        <li className="flex items-start gap-3 text-white/90">
                            <CheckCircle2 size={16} className="mt-1 text-white"/>
                            Komunitas aktif & AI Personalize 24/7.
                        </li>
                        <li className="flex items-start gap-3 text-white/90">
                            <CheckCircle2 size={16} className="mt-1 text-white"/>
                            Gamification adiktif untuk menjaga semangat.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      </section>

      {/* 5. FEATURES BENTO GRID */}
      <section id="features" className="py-24 px-6 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
            <div className="mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ekosistem Belajar Lengkap</h2>
                <p className="text-white/40">Satu akun untuk akses ke semua tools pembelajaran masa depan.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Dashboard Card */}
                <div className="md:col-span-2 bg-[#0f0f0f] border border-white/10 rounded-3xl p-10 relative overflow-hidden group hover:border-white/20 transition duration-500">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full group-hover:bg-white/10 transition duration-700"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 border border-white/10"><LayoutDashboard className="text-white"/></div>
                        <h3 className="text-2xl font-bold mb-4 text-white">Dashboard Terpusat</h3>
                        <p className="text-white/50 mb-8 max-w-md">Lacak progress belajar, akses materi terakhir, dan lihat statistik performa Anda dalam satu layar yang bersih.</p>
                        <div className="w-full h-48 bg-[#050505] rounded-tl-xl border-t border-l border-white/10 p-4 relative">
                             <div className="flex gap-3 mb-4">
                                <div className="w-8 h-8 rounded bg-white/10"></div>
                                <div className="h-8 w-32 rounded bg-white/10"></div>
                             </div>
                             <div className="flex gap-4">
                                <div className="flex-1 h-24 rounded bg-white/5 border border-white/5"></div>
                                <div className="flex-1 h-24 rounded bg-white/5 border border-white/5"></div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Gamification Card */}
                <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-white/20 transition duration-500">
                     <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 border border-white/10"><Trophy className="text-white"/></div>
                     <h3 className="text-xl font-bold mb-2 text-white">Gamification</h3>
                     <p className="text-white/50 text-sm mb-6">Ubah belajar jadi kompetisi. Dapatkan XP, Badges, dan panjat Leaderboard global.</p>
                     <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-white w-2/3"></div>
                     </div>
                </div>

                {/* Community Card */}
                <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-white/20 transition duration-500">
                     <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 border border-white/10"><Users className="text-white"/></div>
                     <h3 className="text-xl font-bold mb-2 text-white">Komunitas</h3>
                     <p className="text-white/50 text-sm">Diskusi real-time. Bagikan update, tanya masalah error, dan bangun koneksi.</p>
                </div>

                {/* Security Card */}
                <div className="md:col-span-2 bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group hover:border-white/20 transition duration-500">
                    <div className="flex-1 relative z-10">
                        <h3 className="text-2xl font-bold mb-2 text-white">Aman & Privat</h3>
                        <p className="text-white/50 text-sm">Data Anda diproteksi dengan enkripsi kelas industri. Kami menjaga privasi Anda seserius kami menjaga kualitas materi.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-full border border-white/10">
                        <Shield size={48} className="text-white/80" />
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section id="faq" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4 text-white">Pertanyaan Umum</h2>
                <p className="text-white/40">Hal-hal yang sering ditanyakan oleh calon member.</p>
            </div>

            <div className="space-y-4">
                <details className="group glass-panel rounded-2xl border border-white/10 bg-[#111]">
                    <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                        <span className="font-bold text-white">Apakah Eduspace benar-benar gratis?</span>
                        <ChevronDown className="text-white/40 group-open:rotate-180 transition-transform duration-300" />
                    </summary>
                    <div className="px-6 pb-6 text-white/60 text-sm leading-relaxed border-t border-white/5 pt-4">
                        Untuk saat ini, Eduspace v2 membuka akses ke beberapa materi dasar secara gratis.
                    </div>
                </details>

                <details className="group glass-panel rounded-2xl border border-white/10 bg-[#111]">
                    <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                        <span className="font-bold text-white">Apakah saya akan mendapatkan sertifikat?</span>
                        <ChevronDown className="text-white/40 group-open:rotate-180 transition-transform duration-300" />
                    </summary>
                    <div className="px-6 pb-6 text-white/60 text-sm leading-relaxed border-t border-white/5 pt-4">
                        Ya, setelah menyelesaikan 100% progress materi, badge kelulusan akan muncul di profil Anda.
                    </div>
                </details>
            </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-white/10 bg-[#050505] py-20 px-6 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/5 blur-[150px] rounded-full pointer-events-none opacity-10"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">Siap Menemukan "Next" Kamu?</h2>
            <Link href="/register" className="px-10 py-4 bg-white text-black text-lg font-bold rounded-full hover:scale-105 transition shadow-[0_0_30px_rgba(255,255,255,0.15)] inline-flex items-center gap-2">
                Buat Akun Gratis <ArrowRight />
            </Link>

            <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-sm text-white/30">
                <p>&copy; 2026 Eduspace Inc.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <Link href="#" className="hover:text-white transition">Privacy</Link>
                    <Link href="#" className="hover:text-white transition">Terms</Link>
                </div>
            </div>
        </div>
      </footer>

    </div>
  );
}