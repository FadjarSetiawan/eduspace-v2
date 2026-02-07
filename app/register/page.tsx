"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, AlertCircle, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mendaftar");
      }

      router.push("/login?registered=true");
      
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111] text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[150px] rounded-full opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 relative z-10">
        
        <div className="text-center mb-8">
            <div className="w-12 h-12 bg-white/10 text-white font-bold text-xl rounded-xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                <Sparkles size={20} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Join Eduspace</h1>
            <p className="text-white/40 text-sm mt-2">Mulai revolusi belajarmu hari ini.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4 bg-white/5 backdrop-blur-xl">
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-3 rounded-lg flex items-center gap-2">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Nama Lengkap</label>
                <input 
                    type="text" required
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:bg-black/40 focus:border-white/40 outline-none transition placeholder-white/20"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Email</label>
                <input 
                    type="email" required
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:bg-black/40 focus:border-white/40 outline-none transition placeholder-white/20"
                    placeholder="nama@email.com"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Password</label>
                <input 
                    type="password" required
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:bg-black/40 focus:border-white/40 outline-none transition placeholder-white/20"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                />
            </div>

            <button 
                type="submit" disabled={loading}
                className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition disabled:opacity-50 mt-4 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
                {loading ? <Loader2 className="animate-spin" /> : <>Buat Akun <ArrowRight size={18} /></>}
            </button>
        </form>

        <p className="text-center text-white/40 text-sm mt-8">
            Sudah punya akun? <Link href="/login" className="text-white font-bold hover:underline transition">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}