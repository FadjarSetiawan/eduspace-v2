import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { Trophy, Medal, Crown, User as UserIcon } from "lucide-react";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic"; // Supaya leaderboard selalu update real-time

export default async function LeaderboardPage() {
  // 1. CEK SESI LOGIN
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    redirect("/login");
  }

  // 2. AMBIL DATA USER YANG SEDANG LOGIN (Buat patokan highlight "YOU")
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) redirect("/login");

  // 3. AMBIL SEMUA USER & URUTKAN BERDASARKAN XP TERTINGGI
  const allUsers = await prisma.user.findMany({
    orderBy: { totalXp: "desc" },
    take: 50, // Ambil top 50 aja biar gak berat
    select: {
      id: true,
      name: true,
      totalXp: true,
      level: true,
    }
  });

  // Pisahkan Top 3 dengan Sisanya
  const topThree = allUsers.slice(0, 3);
  const restUsers = allUsers.slice(3);

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-light mb-2">Hall of <span className="font-bold text-yellow-500">Fame</span></h1>
        <p className="text-white/50 text-sm">Para pelajar terbaik di Eduspace minggu ini.</p>
      </div>

      {/* --- PODIUM TOP 3 --- */}
      <div className="flex items-end justify-center gap-4 md:gap-8 mb-16 px-4 min-h-[300px]">
        
        {/* JUARA 2 (Silver) */}
        {topThree[1] && (
          <div className="flex flex-col items-center gap-3 w-1/3 max-w-[150px]">
            <div className="relative">
               <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-300 border-4 border-gray-500 flex items-center justify-center text-black font-bold text-2xl relative z-10">
                  2
               </div>
               {/* Badge YOU kalau Juara 2 adalah User Login */}
               {topThree[1].id === currentUser.id && (
                 <span className="absolute -top-3 -right-3 px-2 py-0.5 bg-blue-600 text-[10px] font-bold rounded-full z-20 border border-white/20">YOU</span>
               )}
            </div>
            <div className="text-center">
              <p className={`font-bold line-clamp-1 ${topThree[1].id === currentUser.id ? "text-blue-400" : "text-gray-300"}`}>{topThree[1].name}</p>
              <p className="text-xs text-white/40">{topThree[1].totalXp} XP</p>
            </div>
            <div className="w-full h-32 bg-gradient-to-t from-gray-800/50 to-gray-500/20 rounded-t-2xl border-t border-gray-500/30"></div>
          </div>
        )}

        {/* JUARA 1 (Gold) */}
        {topThree[0] && (
          <div className="flex flex-col items-center gap-3 w-1/3 max-w-[180px] -mt-10 relative z-10">
            <Crown className="text-yellow-500 animate-bounce" size={32} />
            <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-yellow-400 border-4 border-yellow-600 flex items-center justify-center text-black font-bold text-3xl shadow-[0_0_30px_rgba(234,179,8,0.5)]">
                    1
                </div>
                {/* Badge YOU kalau Juara 1 adalah User Login */}
                {topThree[0].id === currentUser.id && (
                 <span className="absolute -top-3 -right-3 px-2 py-0.5 bg-blue-600 text-[10px] font-bold rounded-full z-20 border border-white/20">YOU</span>
               )}
            </div>
            <div className="text-center">
              <p className={`font-bold text-lg line-clamp-1 ${topThree[0].id === currentUser.id ? "text-blue-400" : "text-yellow-500"}`}>{topThree[0].name}</p>
              <p className="text-sm text-white/40">{topThree[0].totalXp} XP</p>
            </div>
            <div className="w-full h-44 bg-gradient-to-t from-yellow-900/40 to-yellow-500/20 rounded-t-2xl border-t border-yellow-500/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-yellow-500/10 blur-xl"></div>
            </div>
          </div>
        )}

        {/* JUARA 3 (Bronze) */}
        {topThree[2] && (
          <div className="flex flex-col items-center gap-3 w-1/3 max-w-[150px]">
             <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-orange-400 border-4 border-orange-700 flex items-center justify-center text-black font-bold text-2xl relative z-10">
                    3
                </div>
                {/* Badge YOU kalau Juara 3 adalah User Login */}
                {topThree[2].id === currentUser.id && (
                 <span className="absolute -top-3 -right-3 px-2 py-0.5 bg-blue-600 text-[10px] font-bold rounded-full z-20 border border-white/20">YOU</span>
               )}
            </div>
            <div className="text-center">
              <p className={`font-bold line-clamp-1 ${topThree[2].id === currentUser.id ? "text-blue-400" : "text-orange-400"}`}>{topThree[2].name}</p>
              <p className="text-xs text-white/40">{topThree[2].totalXp} XP</p>
            </div>
            <div className="w-full h-24 bg-gradient-to-t from-orange-900/40 to-orange-500/20 rounded-t-2xl border-t border-orange-500/30"></div>
          </div>
        )}
      </div>

      {/* --- LIST SISANYA (RANK 4 KE BAWAH) --- */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
        {restUsers.map((user, index) => {
          const rank = index + 4;
          // 👇 INI LOGIC KUNCINYA: Cek apakah ID user ini sama dengan User Login
          const isMe = user.id === currentUser.id;

          return (
            <div 
              key={user.id} 
              className={`
                flex items-center gap-4 p-4 border-b border-white/5 transition-colors
                ${isMe ? "bg-white/10" : "hover:bg-white/5"}
              `}
            >
              {/* Ranking Number */}
              <div className="w-8 text-center font-bold text-white/30 text-sm">
                {rank}
              </div>

              {/* Avatar Circle */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${isMe ? "bg-blue-600 text-white" : "bg-white/5 text-white/50"}`}>
                 {user.name.charAt(0).toUpperCase()}
              </div>

              {/* Name & Badge */}
              <div className="flex-1">
                 <div className="flex items-center gap-2">
                    <p className={`font-bold text-sm ${isMe ? "text-white" : "text-white/80"}`}>{user.name}</p>
                    
                    {/* Badge YOU muncul hanya jika isMe = true */}
                    {isMe && (
                        <span className="px-2 py-0.5 bg-white text-black text-[9px] font-bold rounded uppercase tracking-wider">
                            YOU
                        </span>
                    )}
                 </div>
                 <p className="text-xs text-white/30">Level {user.level || 1}</p>
              </div>

              {/* XP Score */}
              <div className="text-right">
                 <p className="font-bold text-yellow-500 text-sm">{user.totalXp.toLocaleString()}</p>
                 <p className="text-[10px] text-white/20 uppercase">XP Points</p>
              </div>
            </div>
          );
        })}

        {/* Kalau list kosong */}
        {restUsers.length === 0 && (
            <div className="p-8 text-center text-white/30 text-sm">
                Belum ada penantang lainnya.
            </div>
        )}
      </div>
    </div>
  );
}