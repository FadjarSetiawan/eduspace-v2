import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs' // Kita pakai library yang baru diinstall

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Database Lengkap (Auth + LMS + Gamification)...')

  // 1. Reset Database
  await prisma.userBadge.deleteMany()
  await prisma.badge.deleteMany()
  await prisma.userProgress.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.course.deleteMany()
  await prisma.edge.deleteMany()
  await prisma.node.deleteMany()
  await prisma.user.deleteMany()

  // Password default untuk semua user: "123456"
  const passwordHash = await hash('123456', 10)

  // 2. Setup Badges
  const badgesData = [
    { slug: 'early-adopter', name: 'Perintis', description: 'Bergabung di fase awal.', icon: 'Flag' },
    { slug: 'fast-learner', name: 'Fast Learner', description: 'Selesai 3 materi cepat.', icon: 'Zap' },
    { slug: 'python-master', name: 'Python Master', description: 'Jago Python.', icon: 'Code' },
    { slug: 'social-star', name: 'Social Star', description: 'Aktif diskusi.', icon: 'Users' }
  ]
  
  const badgesMap: any = {}
  for (const b of badgesData) {
    const badge = await prisma.badge.create({ data: b })
    badgesMap[b.slug] = badge
  }

  // 3. Buat User Utama (Kamu)
  const me = await prisma.user.create({
    data: { 
      email: 'maba@eduspace.id', 
      name: 'Mahasiswa Baru',
      password: passwordHash, // <--- SUDAH ADA PASSWORD
      totalXp: 1250, 
      level: 5
    },
  })

  // 4. Buat User Rivals (Saingan)
  const rivals = [
    { name: "Sarah Connor", xp: 3400, level: 12 },
    { name: "John Wick", xp: 2100, level: 8 },
    { name: "Tony Stark", xp: 1500, level: 6 },
    { name: "Peter Parker", xp: 800, level: 3 },
    { name: "Bruce Wayne", xp: 5000, level: 20 }
  ]

  for (const r of rivals) {
    const user = await prisma.user.create({
      data: {
        email: `${r.name.replace(' ', '').toLowerCase()}@rival.com`,
        name: r.name,
        password: passwordHash, // <--- SUDAH ADA PASSWORD
        totalXp: r.xp,
        level: r.level
      }
    })
    // Kasih badge random ke rival
    await prisma.userBadge.create({ data: { userId: user.id, badgeId: badgesMap['early-adopter'].id } })
  }

  // Kasih Badge ke Kamu
  await prisma.userBadge.create({ data: { userId: me.id, badgeId: badgesMap['early-adopter'].id } })

  // 5. Buat COURSE (LMS Data)
  const coursesData = [
    {
      title: "Dasar Pemrograman Python",
      description: "Pelajari fondasi coding modern dengan bahasa yang paling ramah pemula.",
      level: "Beginner",
      duration: "12 Jam",
      thumbnail: "python-101",
      lessons: ["Pengenalan Python", "Setup Environment", "Variabel & Tipe Data", "Logika Percabangan"]
    },
    {
      title: "UI/UX Design Mastery",
      description: "Dari wireframe hingga high-fidelity prototype. Pahami psikologi user.",
      level: "Intermediate",
      duration: "20 Jam",
      thumbnail: "ui-ux",
      lessons: ["Mindset Desainer", "Wireframing", "Prototyping di Figma", "Usability Testing"]
    },
    {
      title: "Digital Marketing Strategy",
      description: "Kuasai SEO, SEM, dan Social Media Ads untuk bisnis.",
      level: "Beginner",
      duration: "8 Jam",
      thumbnail: "digimar",
      lessons: ["Fundamental Marketing", "SEO Basics", "Content Strategy"]
    },
    {
      title: "Data Science for Business",
      description: "Mengolah data menjadi keputusan bisnis strategis.",
      level: "Advanced",
      duration: "30 Jam",
      thumbnail: "data-science",
      lessons: ["Intro to Data", "Statistik Dasar", "Visualisasi Data"]
    }
  ]

  for (const c of coursesData) {
    const { lessons, ...courseInfo } = c
    const course = await prisma.course.create({
      data: {
        ...courseInfo,
        lessons: {
          create: lessons.map(l => ({
            title: l,
            type: Math.random() > 0.5 ? "VIDEO" : "TEXT",
            content: "Ini adalah konten simulasi untuk materi pembelajaran."
          }))
        }
      },
      include: { lessons: true }
    })

    // Auto Enroll User ke 2 Course pertama
    if (c.title.includes("Python") || c.title.includes("UI/UX")) {
        await prisma.enrollment.create({
            data: { userId: me.id, courseId: course.id }
        })

        if (course.lessons.length > 0) {
            await prisma.userProgress.create({
                data: { userId: me.id, lessonId: course.lessons[0].id, isCompleted: true }
            })
        }
    }
  }
// 6. BUAT POSTINGAN KOMUNITAS (DUMMY)
  const posts = [
    { email: "brucewayne@rival.com", content: "Baru saja menyelesaikan modul Data Science. Easy peasy. 🦇" },
    { email: "tonystark@rival.com", content: "Siapa yang butuh belajar Python kalau punya JARVIS? Tapi oke juga sih materinya." },
    { email: "peterparker@rival.com", content: "Ada yang paham materi UI/UX bagian Wireframing? Susah banget 😭" },
    { email: "sarahconnor@rival.com", content: "Fokus. Tidak ada waktu untuk main-main. Skynet is coming." }
  ]

  for (const p of posts) {
    const author = await prisma.user.findUnique({ where: { email: p.email } })
    if (author) {
      await prisma.post.create({
        data: {
          content: p.content,
          authorId: author.id
        }
      })
    }
  }

  console.log('✅ Database SIAP! Auth + LMS + Gamification + Community Posts.')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })