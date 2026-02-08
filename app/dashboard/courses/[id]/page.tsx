import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route"; 
import { redirect, notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import CoursePlayer from "@/app/components/CoursePlayer"; // Pastikan import ini benar

const prisma = new PrismaClient();

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Ambil ID dari URL
  const { id } = await params;

  // 2. Cek User Login
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) redirect("/login");

  // 3. Ambil Data Course
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      lessons: true, 
    },
  });

  if (!course) return notFound();

  // 4. Auto Enroll (Daftarkan user jika belum)
  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
  });

  if (!existingEnrollment) {
    await prisma.enrollment.create({
      data: { userId: user.id, courseId: course.id },
    });
  }

  // 5. Ambil Progress User
  const userProgress = await prisma.userProgress.findMany({
    where: {
      userId: user.id,
      lessonId: { in: course.lessons.map((l) => l.id) },
      isCompleted: true,
    },
  });

  const completedLessonIds = userProgress.map((p) => p.lessonId);

  // 6. Tampilkan Player (Kirim data course ke component)
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
            href="/dashboard/courses" 
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
        >
            <ChevronLeft />
        </Link>
        <div>
            <h1 className="text-xl font-bold">{course.title}</h1>
            <p className="text-white/50 text-sm">Level: {course.level}</p>
        </div>
      </div>

      <CoursePlayer 
        course={course} 
        userProgress={completedLessonIds} 
      />
    </div>
  );
}