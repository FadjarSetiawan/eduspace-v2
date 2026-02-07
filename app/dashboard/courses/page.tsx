// File: app/dashboard/courses/page.tsx
import { PrismaClient } from "@prisma/client";
import { PlayCircle, Clock, BarChart, ArrowRight, Search } from "lucide-react";
import Link from "next/link"; // <--- INI PENTING!

const prisma = new PrismaClient();

// Ambil data dari database (Server Component)
async function getCourses() {
  const courses = await prisma.course.findMany({
    include: { _count: { select: { lessons: true } } }
  });
  return courses;
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-light">Katalog <span className="font-bold">Kelas</span></h1>
          <p className="text-white/50 mt-1 text-sm">Pilih skill baru yang ingin kamu kuasai hari ini.</p>
        </div>

        <div className="relative group w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-white/30 group-focus-within:text-white transition" />
          </div>
          <input 
            type="text" 
            placeholder="Cari mata kuliah..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:bg-white/10 focus:border-white/30 outline-none transition text-white placeholder-white/30"
          />
        </div>
      </div>

      {/* COURSE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="group relative glass-panel rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
            
            {/* Thumbnail Placeholder */}
            <div className="h-40 bg-gradient-to-br from-white/5 to-white/10 relative p-6 flex flex-col justify-between">
               <div className="absolute top-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-white/10">
                 {course.level}
               </div>
               <PlayCircle className="text-white/10 w-16 h-16 absolute -bottom-4 -right-4 rotate-12 group-hover:scale-110 transition duration-500" />
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-white/90 transition">
                {course.title}
              </h3>
              <p className="text-sm text-white/50 line-clamp-2 mb-6 h-10">
                {course.description}
              </p>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-xs text-white/40 mb-6">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1.5">
                  <BarChart size={14} />
                  {(course as any)._count.lessons} Modul
                </div>
              </div>

              {/* TOMBOL AKSI (REVISI: Sekarang pakai Link) */}
              <Link 
                href={`/dashboard/courses/${course.id}`}
                className="w-full py-3 bg-white text-[#222] font-bold text-sm rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition group-hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              >
                Mulai Belajar
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}