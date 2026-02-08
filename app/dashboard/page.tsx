import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { BookOpen, Trophy, Target, PlayCircle, BarChart } from "lucide-react";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

// --- HELPER FUNCTION (YANG TADI BIKIN MERAH) ---
function getLast7Days() {
  // PERBAIKAN: Kita kasih tipe data eksplisit di sini 👇
  const days: { dateKey: string; dayLabel: string }[] = [];
  
  const options: Intl.DateTimeFormatOptions = { weekday: 'short' };
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      dateKey: d.toLocaleDateString('en-CA'),
      dayLabel: d.toLocaleDateString('id-ID', options),
    });
  }
  return days;
}

export default async function DashboardPage() {
  // 1. CEK SESI
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    redirect("/login");
  }

  // 2. AMBIL USER
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) redirect("/login");

  // 3. HITUNG STATISTIK MANUAL (Biar Type Safe)
  const enrolledCount = await prisma.enrollment.count({
    where: { userId: user.id }
  });

  const completedMaterialsCount = await prisma.userProgress.count({
    where: { userId: user.id, isCompleted: true }
  });

  // 4. AMBIL KELAS (Urutan Terbaru)
  const enrollments = await prisma.enrollment.findMany({
    where: { 
      userId: user.id 
    },
    include: { 
      course: {
        include: {
          lessons: true 
        }
      }
    },
    orderBy: {
      updatedAt: "desc" 
    },
    take: 3 
  });

  // 5. AMBIL DATA PROGRESS
  const allProgress = await prisma.userProgress.findMany({
    where: { userId: user.id, isCompleted: true }
  });

  // 6. LOGIC GRAFIK MINGGUAN
  const last7Days = getLast7Days();
  const weeklyStats = last7Days.map(day => {
    const count = allProgress.filter(p => {
        // Konversi tanggal database ke lokal string
        const pDate = new Date(p.updatedAt).toLocaleDateString('en-CA');
        return pDate === day.dateKey;
    }).length;
    return { ...day, count };
  });

  const maxVal = Math.max(...weeklyStats.map(d => d.count), 5);

  // 7. LOGIC PROGRESS PER KELAS
  const getProgress = (courseId: string, totalLessons: number) => {
    if (totalLessons === 0) return 0;
    
    const currentCourse = enrollments.find(e => e.courseId === courseId);
    if (!currentCourse) return 0;

    const courseLessonIds = currentCourse.course.lessons.map(l => l.id);
    const validCompleted = allProgress.filter(p => courseLessonIds.includes(p.lessonId)).length;
    
    return Math.round((validCompleted / totalLessons) * 100);
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER */}
      <header>
        <h1 className="text-3xl font-light">Selamat Datang, <span className="font-bold">{user.name}</span></h1>
        <p className="text-white/50 mt-2">Dashboard kemajuan belajarmu.</p>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="p-3 bg-white/5 rounded-xl text-white"><BookOpen size={24} /></div>
          <div><p className="text-sm text-white/40">Kelas Diambil</p><p className="text-3xl font-bold">{enrolledCount}</p></div>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="p-3 bg-white/5 rounded-xl text-white"><Target size={24} /></div>
          <div><p className="text-sm text-white/40">Materi Selesai</p><p className="text-3xl font-bold">{completedMaterialsCount}</p></div>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="p-3 bg-white/5 rounded-xl text-white"><Trophy size={24} /></div>
          <div><p className="text-3xl font-bold text-yellow-500">{user.totalXp.toLocaleString()}</p></div>
        </div>
      </div>

      {/* LANJUTKAN BELAJAR */}
      <section>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Lanjutkan Belajar</h2>
            <Link href="/dashboard/courses" className="text-sm text-white/50 hover:text-white transition">Lihat Katalog &rarr;</Link>
        </div>
        {enrollments.length === 0 ? (
            <div className="glass-panel p-10 rounded-2xl text-center border border-white/5 border-dashed">
                <p className="text-white/50 mb-4">Belum ada kelas aktif.</p>
                <Link href="/dashboard/courses" className="px-6 py-2 bg-white text-black rounded-lg font-bold text-sm inline-block hover:bg-gray-200">Cari Kelas</Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((item) => {
                    const percent = getProgress(item.courseId, item.course.lessons.length);
                    return (
                        <div key={item.id} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/20 transition group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-white/5 rounded border border-white/5">{item.course.level}</span>
                                {percent === 100 && <span className="text-green-500 text-xs font-bold">LULUS</span>}
                            </div>
                            <h3 className="font-bold text-lg mb-1 line-clamp-1">{item.course.title}</h3>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-4">
                                <div className="h-full bg-white" style={{ width: `${percent}%` }}></div>
                            </div>
                            <Link href={`/dashboard/courses/${item.courseId}`} className="w-full mt-4 py-3 bg-white/5 border border-white/10 hover:bg-white hover:text-black rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition">
                                {percent > 0 ? "Lanjutkan" : "Mulai"} <PlayCircle size={16} />
                            </Link>
                        </div>
                    );
                })}
            </div>
        )}
      </section>

      {/* GRAFIK AKTIVITAS */}
      <section className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full pointer-events-none opacity-30"></div>
        <div className="flex items-center gap-3 mb-8 relative z-10">
            <div className="p-2 bg-white/10 rounded-lg"><BarChart size={20} className="text-white" /></div>
            <div>
                <h2 className="text-lg font-bold">Aktivitas Mingguan</h2>
                <p className="text-xs text-white/40">Jumlah materi yang diselesaikan</p>
            </div>
        </div>
        <div className="flex items-end justify-between h-64 gap-3 relative z-10 px-2">
            {weeklyStats.map((stat, i) => {
                const heightPercent = Math.max((stat.count / maxVal) * 100, 2);
                const hasData = stat.count > 0;
                return (
                    <div key={i} className="flex-1 h-full flex flex-col justify-end items-center gap-2 group relative">
                        <div className={`
                            mb-2 px-2 py-1 rounded text-[10px] font-bold transition-all duration-300
                            ${hasData ? 'bg-white text-black translate-y-0 opacity-100' : 'bg-white/10 text-white translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0'}
                        `}>
                            {stat.count}
                        </div>
                        <div className="w-full flex-1 bg-white/5 rounded-t-lg relative overflow-hidden flex items-end">
                            <div 
                                className={`w-full transition-all duration-1000 ease-out ${hasData ? 'bg-[#fefefe] shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'bg-white/10'}`}
                                style={{ height: `${heightPercent}%` }}
                            >
                                {hasData && <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>}
                            </div>
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${hasData ? 'text-white' : 'text-white/30'}`}>
                            {stat.dayLabel}
                        </span>
                    </div>
                );
            })}
        </div>
      </section>
    </div>
  );
}