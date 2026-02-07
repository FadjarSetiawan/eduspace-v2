// File: app/dashboard/courses/[id]/page.tsx
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CoursePlayer from "@/app/components/CoursePlayer";

const prisma = new PrismaClient();

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // 1. Ambil User Demo (Hardcode sementara karena belum ada Login Auth)
  const user = await prisma.user.findFirst({ where: { email: 'maba@eduspace.id' } });
  if (!user) return <div>User not found (Seed database dulu!)</div>;

  // 2. Ambil Course lengkap dengan Lesson
  const course = await prisma.course.findUnique({
    where: { id: resolvedParams.id },
    include: { lessons: true }
  });

  // 3. Ambil Progress User (Hanya untuk course ini)
  const userProgress = await prisma.userProgress.findMany({
    where: { 
      userId: user.id,
      // PERBAIKAN DI SINI: Gunakan Nested Object untuk filter relasi
      lesson: {
        courseId: resolvedParams.id 
      }
    }
  });

  if (!course) return notFound();

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      
      {/* Navigation Bar Kecil di Atas */}
      <div className="mb-6 flex items-center gap-4">
        <Link href="/dashboard/courses" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition text-white/50 hover:text-white">
            <ArrowLeft size={20} />
        </Link>
        <div>
            <p className="text-xs text-white/40 uppercase tracking-widest">Kelas Sedang Berlangsung</p>
            <h1 className="text-lg font-bold">{course.title}</h1>
        </div>
      </div>

      {/* Panggil Client Component Player */}
      <CoursePlayer course={course} userProgress={userProgress} userId={user.id} />
      
    </div>
  );
}