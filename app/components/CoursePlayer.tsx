// File: app/components/CoursePlayer.tsx
"use client";

import { useState } from "react";
import { PlayCircle, FileText, CheckCircle, ChevronRight } from "lucide-react";

export default function CoursePlayer({ course, userProgress, userId }: { course: any, userProgress: any[], userId: string }) {
  
  // State Materi Aktif
  const [activeLesson, setActiveLesson] = useState(course.lessons[0]);
  
  // State Progress Lokal (biar gak perlu refresh halaman)
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(
    userProgress.filter(p => p.isCompleted).map(p => p.lessonId)
  );

  // Hitung Persentase
  const progressPercent = Math.round((completedLessonIds.length / course.lessons.length) * 100);

  // Fungsi Toggle Selesai
  const toggleComplete = async () => {
    const isCurrentlyComplete = completedLessonIds.includes(activeLesson.id);
    const newStatus = !isCurrentlyComplete;

    // Update UI duluan (Optimistic UI)
    if (newStatus) {
      setCompletedLessonIds([...completedLessonIds, activeLesson.id]);
    } else {
      setCompletedLessonIds(completedLessonIds.filter(id => id !== activeLesson.id));
    }

    // Kirim ke Backend
    await fetch("/api/courses/progress", {
      method: "POST",
      body: JSON.stringify({
        userId: userId,
        lessonId: activeLesson.id,
        isCompleted: newStatus
      })
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] gap-6 overflow-hidden">
      
      {/* --- KIRI: PLAYER --- */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col">
          {activeLesson?.type === "VIDEO" ? (
            <div className="relative w-full h-full flex items-center justify-center bg-zinc-900 group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
              <PlayCircle className="w-20 h-20 text-white/80 group-hover:scale-110 transition duration-500" />
            </div>
          ) : (
             <div className="w-full h-full p-10 bg-[#1a1a1a] overflow-y-auto">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded mb-4 inline-block">MODUL BACAAN</span>
                <h2 className="text-3xl font-bold mb-6">{activeLesson.title}</h2>
                <p className="text-white/70 leading-relaxed text-lg">{activeLesson.content}</p>
             </div>
          )}
        </div>

        {/* TOMBOL AKSI DI BAWAH PLAYER */}
        <div className="mt-6 flex justify-between items-center px-2">
            <div>
              <h1 className="text-2xl font-bold mb-1">{activeLesson?.title}</h1>
              <p className="text-white/50 text-sm">{course.title}</p>
            </div>

            <button 
              onClick={toggleComplete}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition ${
                completedLessonIds.includes(activeLesson.id)
                ? "bg-green-500 text-black hover:bg-green-400"
                : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {completedLessonIds.includes(activeLesson.id) ? (
                <> <CheckCircle size={20} /> Selesai </>
              ) : (
                <> Tandai Selesai </>
              )}
            </button>
        </div>
      </div>

      {/* --- KANAN: PLAYLIST & PROGRESS --- */}
      <div className="w-full lg:w-96 flex flex-col glass-panel rounded-2xl border border-white/5 overflow-hidden">
        
        {/* Progress Header */}
        <div className="p-6 border-b border-white/5 bg-white/5">
            <div className="flex justify-between items-end mb-2">
                <h3 className="font-bold text-sm uppercase tracking-widest text-white/50">Progress Belajar</h3>
                <span className="text-2xl font-bold text-white">{progressPercent}%</span>
            </div>
            {/* Bar */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-500 ease-out" 
                  style={{ width: `${progressPercent}%` }} 
                />
            </div>
        </div>

        {/* List Materi */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {course.lessons.map((lesson: any, index: number) => {
                const isDone = completedLessonIds.includes(lesson.id);
                const isActive = activeLesson.id === lesson.id;

                return (
                  <button 
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition group ${
                          isActive ? 'bg-[#fefefe] text-[#222]' : 'text-white/60 hover:bg-white/5'
                      }`}
                  >
                      <div className="flex-shrink-0">
                          {isDone ? (
                              <CheckCircle size={20} className={isActive ? "text-green-600" : "text-green-500"} />
                          ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-current opacity-30 text-xs flex items-center justify-center font-mono">
                                {index + 1}
                              </div>
                          )}
                      </div>

                      <div className="flex-1">
                          <p className={`text-sm font-bold line-clamp-1 ${isDone && !isActive ? "line-through opacity-50" : ""}`}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 opacity-60 text-[10px] uppercase">
                              {lesson.type === 'VIDEO' ? <PlayCircle size={10} /> : <FileText size={10} />}
                              {lesson.type}
                          </div>
                      </div>

                      {isActive && <ChevronRight size={16} />}
                  </button>
                );
            })}
        </div>
      </div>
    </div>
  );
}