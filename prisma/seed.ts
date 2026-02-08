import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // 1. BERSIHKAN DATABASE
  await prisma.userProgress.deleteMany();
  await prisma.post.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // 2. PASSWORD HASH
  const password = await hash("123456", 10);

  // 3. BUAT USER
  const me = await prisma.user.create({
    data: {
      name: "Fadjar Setiawan",
      email: "fadjar@eduspace.id",
      password,
      role: "STUDENT", // Aman sekarang, karena schema sudah diupdate
      level: 1,
      totalXp: 900,
    },
  });

  const sarah = await prisma.user.create({
    data: {
      name: "Sarah Connor",
      email: "sarah@eduspace.id",
      password,
      role: "STUDENT",
      level: 3,
      totalXp: 3400,
    },
  });

  const tony = await prisma.user.create({
    data: {
      name: "Tony Stark",
      email: "tony@eduspace.id",
      password,
      role: "STUDENT",
      level: 10,
      totalXp: 15000,
    },
  });

  // 4. BUAT KELAS (Jangan lupa duration!)
  const pythonCourse = await prisma.course.create({
    data: {
      title: "Dasar Pemrograman Python",
      description: "Kuasai bahasa pemrograman paling populer.",
      level: "BEGINNER",
      thumbnail: "python.jpg",
      duration: "4 Jam", // 👈 INI YANG TADI BIKIN ERROR (Sekarang sudah ada)
      lessons: {
        create: [
          { title: "Intro to Python", type: "text", content: "Python adalah bahasa pemrograman..." },
          { title: "Setup Environment", type: "video", content: "https://www.youtube.com/watch?v=knWv3qgQ8-E" },
        ],
      },
    },
  });

  const designCourse = await prisma.course.create({
    data: {
      title: "UI/UX Design Mastery",
      description: "Belajar desain aplikasi modern.",
      level: "INTERMEDIATE",
      thumbnail: "design.jpg",
      duration: "6 Jam", // 👈 INI JUGA DITAMBAHKAN
      lessons: {
        create: [
          { title: "Pengenalan UX", type: "text", content: "UX adalah pengalaman pengguna..." },
          { title: "Figma Dasar", type: "video", content: "https://www.youtube.com/watch?v=kqtD5dpn9C8" },
        ],
      },
    },
  });

  // 5. ENROLLMENT
  await prisma.enrollment.create({
    data: {
      userId: me.id,
      courseId: pythonCourse.id,
      updatedAt: new Date(),
    },
  });

  // 6. COMMUNITY
  const post1 = await prisma.post.create({
    data: {
      content: "Halo semua! Ada yang belajar Python juga?",
      userId: sarah.id,
    },
  });

  await prisma.post.create({
    data: {
      content: "Saya kak! Lagi belajar variabel nih.",
      userId: tony.id,
      parentId: post1.id,
    },
  });

  await prisma.post.create({
    data: {
      content: "Semangat belajarnya! Python seru kok.",
      userId: me.id,
      parentId: post1.id,
    },
  });

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });