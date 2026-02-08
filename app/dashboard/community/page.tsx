"use client";

import { useState, useEffect } from "react";
import { Send, MessageCircle, Loader2, User as UserIcon, CornerDownRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
}

interface Post {
  id: string;
  content: string;
  createdAt: string;
  user: User;
  children?: Post[]; // Balasan
}

export default function CommunityPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  
  // State untuk Reply
  const [replyingTo, setReplyingTo] = useState<string | null>(null); // ID post yang lagi dibalas
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Feed
  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/community");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle Posting (Induk atau Balasan)
  const handlePost = async (parentId: string | null = null) => {
    const textToSend = parentId ? replyContent : content;
    if (!textToSend.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: textToSend, parentId }),
      });

      // Reset Form
      setContent("");
      setReplyContent("");
      setReplyingTo(null);
      
      // Refresh Feed
      fetchPosts(); 
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-light">Community <span className="font-bold">Threads</span></h1>
        <p className="text-white/50 text-sm mt-2">Diskusi terhubung, tanpa batas.</p>
      </div>

      {/* INPUT UTAMA (POSTING BARU) */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 mb-10 flex gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white shrink-0">
          Me
        </div>
        <div className="flex-1">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Mulai utas baru..."
                className="w-full bg-transparent border-none outline-none text-white placeholder-white/20 resize-none h-12 py-2"
            />
            <div className="flex justify-end mt-2">
                <button 
                    onClick={() => handlePost(null)}
                    disabled={isSubmitting || !content.trim()}
                    className="px-6 py-2 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-200 transition disabled:opacity-50"
                >
                    {isSubmitting ? "Posting..." : "Post"}
                </button>
            </div>
        </div>
      </div>

      {/* FEED LIST */}
      {loading ? (
        <div className="text-center py-20 text-white/50"><Loader2 className="animate-spin mx-auto mb-2" /> Memuat diskusi...</div>
      ) : (
        <div className="space-y-6">
            {posts.map((post) => (
                <div key={post.id} className="relative">
                    
                    {/* GARIS PENGHUBUNG (THREAD LINE) */}
                    {/* Muncul jika ada balasan */}
                    {post.children && post.children.length > 0 && (
                        <div className="absolute left-[26px] top-12 bottom-6 w-[2px] bg-white/10 z-0"></div>
                    )}

                    {/* --- PARENT POST --- */}
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 relative z-10 bg-[#111]">
                        <div className="flex gap-4">
                            {/* Avatar Parent */}
                            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center font-bold text-white shrink-0 z-10 bg-[#111]">
                                {post.user.name.charAt(0).toUpperCase()}
                            </div>
                            
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold">{post.user.name}</h3>
                                    <span className="text-xs text-white/30">{new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                                <p className="text-white/80 mt-1 text-sm leading-relaxed">{post.content}</p>
                                
                                {/* Tombol Reply */}
                                <div className="mt-3 flex gap-4">
                                    <button 
                                        onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                                        className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition"
                                    >
                                        <MessageCircle size={14} /> {replyingTo === post.id ? "Batal" : "Balas"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* FORM BALASAN (Muncul jika tombol Reply diklik) */}
                        {replyingTo === post.id && (
                            <div className="mt-4 pl-16 animate-in fade-in slide-in-from-top-2">
                                <textarea
                                    autoFocus
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder={`Balas ke ${post.user.name}...`}
                                    className="w-full bg-white/5 rounded-xl p-3 text-sm text-white outline-none border border-white/10 focus:border-white/30 transition resize-none"
                                    rows={2}
                                />
                                <div className="flex justify-end mt-2">
                                    <button 
                                        onClick={() => handlePost(post.id)}
                                        disabled={isSubmitting || !replyContent.trim()}
                                        className="px-4 py-1.5 bg-white text-black rounded-lg font-bold text-xs hover:bg-gray-200 transition"
                                    >
                                        Kirim Balasan
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- CHILDREN POSTS (BALASAN) --- */}
                    {post.children && post.children.length > 0 && (
                        <div className="mt-2 space-y-2">
                            {post.children.map((child) => (
                                <div key={child.id} className="flex gap-4 relative">
                                    
                                    {/* Garis Lengkung (Connector) */}
                                    <div className="w-[26px] h-[30px] border-b-2 border-l-2 border-white/10 rounded-bl-xl absolute left-[26px] -top-6"></div>

                                    {/* Avatar Child (Lebih kecil) */}
                                    <div className="ml-12 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-[10px] text-white shrink-0 z-10 bg-[#111]">
                                        {child.user.name.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="flex-1 glass-panel p-4 rounded-2xl border border-white/5 bg-white/5">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-sm">{child.user.name}</h4>
                                            <span className="text-[10px] text-white/30">{new Date(child.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                        <p className="text-white/70 mt-1 text-xs leading-relaxed">{child.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            ))}

            {posts.length === 0 && (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
                    <p className="text-white/30">Belum ada diskusi. Jadilah yang pertama!</p>
                </div>
            )}
        </div>
      )}
    </div>
  );
}