"use client";

import { useState } from "react";
import { CheckCircle, PlayCircle, ChevronRight, FileText, Video } from "lucide-react";
import { useRouter } from "next/navigation";

interface Lesson {
  id: string;
  title: string;
  type: string;
  content: string; 
  duration?: any; 
}

interface Course {
  id: string;
  title: string;
  description: string;
  lessons?: Lesson[];
}

export default function CoursePlayer({ course, userProgress }: { course: Course, userProgress: string[] }) {
  const router = useRouter();

  // SAFETY CHECK: Pastikan lessons ada
  const lessons = course?.lessons || []; 
  
  const initialLesson = lessons.length > 0 ? lessons[0] : { 
      id: "empty", title: "Belum ada materi", type: "text", content: "Materi sedang disiapkan.", duration: 0 
  };

  const [activeLesson, setActiveLesson] = useState<Lesson>(initialLesson);
  const [completedLessons, setCompletedLessons] = useState<string[]>(userProgress);
  const [loading, setLoading] = useState(false);

  const progressPercent = lessons.length > 0 
    ? Math.round((completedLessons.length / lessons.length) * 100) 
    : 0;

  const handleComplete = async () => {
    if (activeLesson.id === "empty" || completedLessons.includes(activeLesson.id)) return;

    setLoading(true);
    setCompletedLessons([...completedLessons, activeLesson.id]);

    try {
      const res = await fetch("/api/courses/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            lessonId: activeLesson.id,
            courseId: course.id 
        }), 
      });

      if (!res.ok) throw new Error("Gagal menyimpan progress");
      router.refresh();

    } catch (error) {
      console.error(error);
      setCompletedLessons(completedLessons.filter(id => id !== activeLesson.id));
    } finally {
      setLoading(false);
    }
  };

  if (lessons.length === 0) {
      return (
        <div className="p-10 text-center border border-white/10 rounded-2xl bg-white/5">
            <h2 className="text-xl font-bold mb-2">Materi Belum Tersedia</h2>
            <p className="text-white/50">Admin belum mengupload materi untuk kelas ini.</p>
        </div>
      );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
      {/* PLAYER UI ... */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="glass-panel p-1 rounded-2xl border border-white/10 bg-black aspect-video flex items-center justify-center relative overflow-hidden shadow-2xl">
            {activeLesson.type === "video" ? (
                <iframe 
                    src={activeLesson.content.replace("watch?v=", "embed/")} 
                    className="w-full h-full rounded-xl"
                    allowFullScreen
                    title={activeLesson.title}
                />
            ) : (
                <div className="p-10 text-center w-full">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                        <FileText size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{activeLesson.title}</h2>
                    <p className="text-white/50 max-w-md mx-auto">
                        {activeLesson.content}
                    </p>
                </div>
            )}
        </div>

        <div className="flex justify-between items-end">
            <div>
                <h1 className="text-2xl font-bold">{activeLesson.title}</h1>
                <p className="text-white/50 text-sm">{course.title}</p>
            </div>
            
            <button 
                onClick={handleComplete}
                disabled={loading || completedLessons.includes(activeLesson.id)}
                className={`
                    px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all
                    ${completedLessons.includes(activeLesson.id) 
                        ? "bg-green-500 text-black cursor-default" 
                        : "bg-white text-black hover:bg-gray-200 hover:scale-105 active:scale-95"}
                `}
            >
                {completedLessons.includes(activeLesson.id) ? (
                    <>Selesai <CheckCircle size={18} /></>
                ) : (
                    <>Tandai Selesai <CheckCircle size={18} /></>
                )}
            </button>
        </div>
      </div>

      <div className="w-full lg:w-96 glass-panel p-6 rounded-3xl border border-white/10 flex flex-col h-full">
        <div className="mb-6">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
                <span>Progress Belajar</span>
                <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {lessons.map((lesson) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isActive = activeLesson.id === lesson.id;
                return (
                    <button 
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`
                            w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 group
                            ${isActive 
                                ? "bg-white text-black border-white" 
                                : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 text-white"}
                        `}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isCompleted ? "bg-green-500 text-black" : isActive ? "bg-black/10 text-black" : "bg-white/10 text-white/50"}`}>
                            {isCompleted ? <CheckCircle size={14} /> : (lesson.type === 'video' ? <Video size={14} /> : <FileText size={14} />)}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold line-clamp-1">{lesson.title}</p>
                            <p className={`text-[10px] uppercase tracking-widest ${isActive ? "text-black/50" : "text-white/30"}`}>{lesson.type}</p>
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