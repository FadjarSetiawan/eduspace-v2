// File: app/api/courses/progress/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId, lessonId, isCompleted } = await req.json();

    // 1. Cek status progress sebelumnya (biar gak nambah XP double kalau diklik berkali-kali)
    const currentProgress = await prisma.userProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } }
    });

    const wasCompleted = currentProgress?.isCompleted || false;

    // 2. Jika status berubah, update XP User
    if (isCompleted !== wasCompleted) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          totalXp: {
            // Kalau jadi selesai: Tambah 100. Kalau batal: Kurang 100.
            increment: isCompleted ? 100 : -100
          }
        }
      });
    }

    // 3. Simpan Progress Materi
    const progress = await prisma.userProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId }
      },
      update: { isCompleted },
      create: { userId, lessonId, isCompleted }
    });

    return NextResponse.json({ success: true, data: progress });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Gagal update progress" }, { status: 500 });
  }
}