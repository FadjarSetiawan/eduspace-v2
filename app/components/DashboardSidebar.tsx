// File: app/components/DashboardSidebar.tsx
"use client"; // Wajib biar bisa baca URL
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Book, Cpu, Users, LogOut, Settings, Trophy } from "lucide-react";
const menuItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Kelas Saya", href: "/dashboard/courses", icon: Book },
];

const aiItems = [
  { name: "AI Personalize", href: "/dashboard/ai-personalize", icon: Cpu },
];

// Ganti array communityItems dengan ini:
const communityItems = [
  { name: "Leaderboard", href: "/dashboard/leaderboard", icon: require("lucide-react").Trophy }, // <-- BARU
  { name: "Komunitas", href: "/dashboard/community", icon: Users },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  // Helper untuk cek link aktif
  const isActive = (path: string) => {
    // Jika path persis sama, atau jika path induk (misal /courses) aktif saat buka detail (/courses/123)
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(path);
  };

  // Helper Class untuk style
  const linkClass = (path: string) => `
    flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300
    ${isActive(path) 
      ? "bg-[#fefefe] text-[#222] shadow-[0_0_15px_rgba(255,255,255,0.15)] font-bold translate-x-1" 
      : "text-[#fefefe]/50 hover:text-[#fefefe] hover:bg-[#fefefe]/5"
    }
  `;

  return (
    <aside className="w-72 fixed h-full glass-panel border-r border-[#fefefe]/5 flex flex-col z-40 bg-[#111]">
      {/* HEADER */}
      <div className="p-8 border-b border-[#fefefe]/5">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#fefefe] rounded-lg flex items-center justify-center text-[#222] font-bold">E</div>
            <div>
                <h1 className="text-lg font-bold tracking-wider text-[#fefefe]">EDUSPACE</h1>
                <p className="text-[10px] text-[#fefefe]/40 uppercase tracking-widest">Student Portal</p>
            </div>
        </div>
      </div>

      {/* MENU UTAMA */}
      <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar">
        
        {/* GROUP 1: MAIN */}
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-bold text-[#fefefe]/20 uppercase tracking-widest mb-2">Main Menu</p>
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </div>

        {/* GROUP 2: INTELLIGENCE */}
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-bold text-[#fefefe]/20 uppercase tracking-widest mb-2">Intelligence</p>
          {aiItems.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>
              <item.icon size={18} className={isActive(item.href) ? "text-[#222]" : "text-[#fbbf24]"} />
              {item.name}
            </Link>
          ))}
        </div>

        {/* GROUP 3: SOCIAL */}
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-bold text-[#fefefe]/20 uppercase tracking-widest mb-2">Social</p>
          {communityItems.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-[#fefefe]/5">
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })} // <-- Fungsi Logout
          className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </aside>
  );
}