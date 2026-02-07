// File: app/login/page.tsx
"use client";

import { useState, Suspense } from "react"; // Tambah import Suspense
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, AlertCircle, CheckCircle } from "lucide-react";

// 1. KITA UBAH NAMA KOMPONEN UTAMA JADI "LoginForm" (Bukan export default)
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (res?.error) {
        setError("Email atau password salah.");
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111] text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Ambient Effect */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/5 blur-[150px] rounded-full opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 relative z-10">
        
        {/* Header Logo */}
        <div className="text-center mb-8">
            <div className="w-12 h-12 bg-white text-black font-bold text-xl rounded-xl flex items-center justify-center mx-auto mb-4">E</div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-white/40 text-sm mt-2">Lanjutkan perjalanan belajarmu di Eduspace.</p>
        </div>

        {/* Notifikasi Sukses Register */}
        {registered && (
            <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
                <CheckCircle size={20} />
                <div>
                    <p className="font-bold">Registrasi Berhasil!</p>
                    <p className="opacity-80 text-xs">Silakan login dengan akun barumu.</p>
                </div>
            </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl border border-white/10 space-y-5 bg-white/5 backdrop-blur-xl">
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-3 rounded-lg flex items-center gap-2">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                    type="email" 
                    required
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:bg-black/40 focus:border-white/40 outline-none transition placeholder-white/20"
                    placeholder="nama@email.com"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Password</label>
                <input 
                    type="password" 
                    required
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:bg-black/40 focus:border-white/40 outline-none transition placeholder-white/20"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                />
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition disabled:opacity-50 mt-4 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
                {loading ? <Loader2 className="animate-spin" /> : <>Masuk <ArrowRight size={18} /></>}
            </button>
        </form>

        <p className="text-center text-white/40 text-sm mt-8">
            Belum punya akun? <Link href="/register" className="text-white font-bold hover:underline transition">Daftar sekarang</Link>
        </p>
      </div>
    </div>
  );
}

// 2. EXPORT DEFAULT YANG BARU: BUNGKUS DENGAN SUSPENSE
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#111]"></div>}>
      <LoginForm />
    </Suspense>
  );
}