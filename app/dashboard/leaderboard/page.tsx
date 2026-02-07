// File: app/dashboard/leaderboard/page.tsx
import { PrismaClient } from "@prisma/client";
import { Crown, Medal, Shield, Zap, Flag, Code, Users, Star } from "lucide-react";

const prisma = new PrismaClient();

// Mapping string icon ke Komponen Lucide
const IconMap: any = { Zap, Flag, Code, Users, Star };

export default async function LeaderboardPage() {
  // 1. Ambil 10 Top Users
  const users = await prisma.user.findMany({
    orderBy: { totalXp: 'desc' },
    take: 10,
    include: {
      badges: {
        include: { badge: true }
      }
    }
  });

  // Cari user kita (untuk highlight)
  const myEmail = 'maba@eduspace.id';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-light tracking-tight">Hall of <span className="font-bold text-yellow-500">Fame</span></h1>
        <p className="text-white/50 mt-2">Para pelajar terbaik di Eduspace minggu ini.</p>
      </div>

      {/* TOP 3 PODIUM (Visualisasi Khusus) */}
      <div className="flex items-end justify-center gap-4 md:gap-8 mb-16 px-4">
        {/* JUARA 2 */}
        <div className="flex flex-col items-center w-1/3 md:w-40">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-slate-400 bg-slate-400/10 flex items-center justify-center mb-3 relative">
                <span className="font-bold text-xl md:text-2xl text-slate-300">2</span>
                <Medal className="absolute -bottom-2 text-slate-400 fill-slate-400" size={24} />
            </div>
            <p className="font-bold text-sm md:text-base text-center line-clamp-1">{users[1]?.name}</p>
            <p className="text-xs text-white/40">{users[1]?.totalXp} XP</p>
            <div className="w-full h-24 bg-gradient-to-t from-slate-400/20 to-transparent rounded-t-xl mt-2 border-t border-slate-400/30"></div>
        </div>

        {/* JUARA 1 */}
        <div className="flex flex-col items-center w-1/3 md:w-48 relative -top-4">
            <div className="absolute -top-10 animate-bounce">
                <Crown className="text-yellow-500 fill-yellow-500" size={32} />
            </div>
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-yellow-500 bg-yellow-500/10 flex items-center justify-center mb-3 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                <span className="font-bold text-3xl md:text-4xl text-yellow-500">1</span>
            </div>
            <p className="font-bold text-base md:text-lg text-center text-yellow-500 line-clamp-1">{users[0]?.name}</p>
            <p className="text-sm text-white/40">{users[0]?.totalXp} XP</p>
            <div className="w-full h-32 bg-gradient-to-t from-yellow-500/20 to-transparent rounded-t-xl mt-2 border-t border-yellow-500/30"></div>
        </div>

        {/* JUARA 3 */}
        <div className="flex flex-col items-center w-1/3 md:w-40">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-orange-700 bg-orange-700/10 flex items-center justify-center mb-3 relative">
                <span className="font-bold text-xl md:text-2xl text-orange-700">3</span>
                <Medal className="absolute -bottom-2 text-orange-700 fill-orange-700" size={24} />
            </div>
            <p className="font-bold text-sm md:text-base text-center line-clamp-1">{users[2]?.name}</p>
            <p className="text-xs text-white/40">{users[2]?.totalXp} XP</p>
            <div className="w-full h-16 bg-gradient-to-t from-orange-700/20 to-transparent rounded-t-xl mt-2 border-t border-orange-700/30"></div>
        </div>
      </div>

      {/* LIST RANK 4 - 10 */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        {users.slice(3).map((user, index) => {
            const isMe = user.email === myEmail;
            return (
                <div 
                    key={user.id} 
                    className={`flex items-center gap-4 p-4 border-b border-white/5 last:border-0 transition hover:bg-white/5 ${isMe ? 'bg-white/10' : ''}`}
                >
                    <div className="w-8 text-center font-mono text-white/30 font-bold">
                        {index + 4}
                    </div>
                    
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <span className="font-bold text-sm">{user.name.charAt(0)}</span>
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <p className={`font-bold text-sm ${isMe ? 'text-white' : 'text-white/70'}`}>
                                {user.name} {isMe && <span className="text-[10px] bg-white text-black px-1.5 rounded ml-2">YOU</span>}
                            </p>
                            
                            {/* Badges Mini */}
                            <div className="flex gap-1">
                                {user.badges.map((ub: any) => {
                                    const Icon = IconMap[ub.badge.icon] || Shield;
                                    return (
                                        <div key={ub.id} className="w-4 h-4 text-white/30" title={ub.badge.name}>
                                            <Icon size={12} />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <p className="text-xs text-white/30">Level {user.level}</p>
                    </div>

                    <div className="text-right">
                        <p className="font-bold text-sm">{user.totalXp.toLocaleString()}</p>
                        <p className="text-[10px] text-white/30 uppercase">XP Points</p>
                    </div>
                </div>
            )
        })}
      </div>

    </div>
  );
}