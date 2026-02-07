// File: app/dashboard/community/page.tsx
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { Send, MessageSquare } from "lucide-react";
import { createPost } from "@/app/actions/post"; // Import Action tadi

const prisma = new PrismaClient();

// Helper: Format Waktu (Contoh: "2 jam yang lalu")
function timeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " tahun lalu";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " bulan lalu";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " hari lalu";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " jam lalu";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " menit lalu";
  return Math.floor(seconds) + " detik lalu";
}

export default async function CommunityPage() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  // Ambil Semua Post (Urutkan dari terbaru)
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light">Community <span className="font-bold">Feed</span></h1>
        <p className="text-white/50 mt-2">Berdiskusi dan berbagi dengan sesama pembelajar.</p>
      </div>

      {/* INPUT POSTING BARU */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
        <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-400 flex items-center justify-center text-black font-bold shadow-lg">
                {session?.user?.name?.charAt(0) || "U"}
            </div>
            
            <form action={createPost} className="flex-1">
                <textarea
                    name="content"
                    placeholder="Apa yang sedang kamu pelajari hari ini?"
                    className="w-full bg-transparent border-none outline-none text-white placeholder-white/30 resize-none h-20 text-lg"
                    required
                />
                <div className="flex justify-end mt-2 pt-4 border-t border-white/5">
                    <button 
                        type="submit"
                        className="px-6 py-2 bg-white text-black rounded-full font-bold text-sm flex items-center gap-2 hover:bg-gray-200 transition shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    >
                        Posting <Send size={14} />
                    </button>
                </div>
            </form>
        </div>
      </div>

      {/* DAFTAR POSTINGAN */}
      <div className="space-y-4">
        {posts.map((post) => {
            const isMe = post.author.email === userEmail;

            return (
                <div key={post.id} className={`glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/10 transition ${isMe ? 'bg-white/[0.03]' : ''}`}>
                    <div className="flex gap-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-sm">
                                {post.author.name.charAt(0)}
                            </div>
                        </div>

                        {/* Konten */}
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-sm flex items-center gap-2">
                                        {post.author.name}
                                        {isMe && <span className="text-[10px] bg-white text-black px-1.5 rounded font-bold">YOU</span>}
                                    </h4>
<p className="text-xs text-white/30" suppressHydrationWarning>
    {timeAgo(post.createdAt)}
</p>                                </div>
                            </div>

                            <p className="mt-3 text-white/80 leading-relaxed text-sm">
                                {post.content}
                            </p>

                            {/* Action Buttons (Dummy) */}
                            <div className="flex gap-6 mt-4 pt-4 border-t border-white/5">
                                <button className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition">
                                    <MessageSquare size={14} /> Balas
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        })}

        {posts.length === 0 && (
            <div className="text-center py-20 opacity-50">
                <p>Belum ada postingan. Jadilah yang pertama!</p>
            </div>
        )}
      </div>

    </div>
  );
}