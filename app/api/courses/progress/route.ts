import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  // 1. Cek Sesi Login
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Ambil data dari Frontend
    // Pastikan frontend mengirim lessonId DAN courseId
    const { lessonId, courseId } = await req.json();

    if (!lessonId || !courseId) {
      return NextResponse.json(
        { message: "Data tidak lengkap (Butuh lessonId & courseId)" },
        { status: 400 }
      );
    }

    // 3. Cari User Database berdasarkan session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 4. JALANKAN TRANSAKSI DATABASE (Semua sukses atau batal semua)
    await prisma.$transaction(async (tx) => {
      
      // A. Simpan Progress (Centang Materi)
      // Cek dulu biar gak double entry
      const existingProgress = await tx.userProgress.findFirst({
        where: {
            userId: user.id,
            lessonId: lessonId
        }
      });

      if (!existingProgress) {
          await tx.userProgress.create({
            data: {
              userId: user.id,
              lessonId: lessonId,
              isCompleted: true,
            },
          });

          // B. Tambah XP User (+100 XP) - Hanya jika baru pertama kali selesai
          await tx.user.update({
            where: { id: user.id },
            data: { totalXp: { increment: 100 } },
          });
      }

      // C. UPDATE ENROLLMENT (Supaya naik ke atas di Dashboard)
      // Kita update 'updatedAt' menjadi waktu sekarang (new Date)
      await tx.enrollment.updateMany({
        where: {
          userId: user.id,
          courseId: courseId,
        },
        data: {
          updatedAt: new Date(), // <--- INI KUNCI SORTING-NYA
        },
      });
    });

    return NextResponse.json({ message: "Progress saved successfully" });

  } catch (error) {
    console.error("Progress Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}