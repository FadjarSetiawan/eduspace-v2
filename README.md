Wah, selamat bang! 🎉 Akhirnya demonya lancar dan fiturnya lengkap dari Dashboard sampai Community ala Threads.

Sekarang, biar project ini terlihat **Profesional** di GitHub (dan dilirik rekruter/juri), kita butuh `README.md` yang **"Ganteng"**.

Ini *template* README super lengkap yang sudah saya sesuaikan dengan fitur-fitur yang baru saja kita bangun (Gamification, Thread UI, Auto-Enroll, dll).

Silakan buat file bernama **`README.md`** di root folder project kamu, lalu copy-paste kode di bawah ini:

---

```markdown
# 🚀 Eduspace V2 - Gamified Student Portal

![Eduspace Banner](https://via.placeholder.com/1200x600/111/fff?text=Eduspace+V2+Preview)
*(Ganti link di atas dengan screenshot dashboard kamu nanti)*

Eduspace V2 adalah platform **Learning Management System (LMS)** modern yang berfokus pada pengalaman belajar yang interaktif dan menyenangkan. Dibangun dengan teknologi web terbaru, platform ini menggabungkan manajemen kursus dengan elemen **Gamifikasi** dan **Komunitas** bergaya media sosial.

🔗 **Live Demo:** [https://eduspace-v2.vercel.app](https://eduspace-v2.vercel.app)

---

## ✨ Fitur Unggulan

### 📊 1. Interactive Dashboard
* **Real-time Progress:** Statistik XP, Level, dan jumlah materi yang diselesaikan update secara instan.
* **Weekly Activity Graph:** Grafik batang visual untuk memantau konsistensi belajar dalam 7 hari terakhir.
* **Smart Resume:** Fitur "Lanjutkan Belajar" otomatis mengurutkan kelas yang terakhir diakses ke posisi paling depan.

### 🎮 2. Course Player & Gamification
* **Immersive Learning:** Materi berbasis Teks dan Video (YouTube Embed).
* **Auto-Enrollment:** Sistem otomatis mendaftarkan user saat pertama kali membuka kelas.
* **XP System:** Dapatkan 100 XP setiap menyelesaikan materi. Level user akan naik seiring bertambahnya XP.
* **Optimistic UI:** Centang materi terasa instan tanpa loading lama.

### 🏆 3. Leaderboard (Hall of Fame)
* **Top 3 Podium:** Visualisasi panggung untuk 3 peraih XP tertinggi.
* **User Highlighting:** Baris user yang sedang login otomatis diberi highlight dan badge **"YOU"** agar mudah ditemukan dalam daftar ranking.

### 💬 4. Community Threads
* **Thread UI:** Diskusi materi dengan tampilan modern ala aplikasi *Threads*.
* **Visual Connector:** Garis vertikal dan lengkung yang menghubungkan postingan induk dengan balasannya (Nested Replies).
* **Focus Mode:** Tanpa tombol like/share yang mengganggu, fokus pada diskusi yang berkualitas.

---

## 🛠️ Tech Stack

Project ini dibangun menggunakan **Modern Web Stack**:

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router & Server Actions)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Glassmorphism & Dark Mode)
* **Database:** [PostgreSQL](https://www.postgresql.org/) (via Neon / Supabase)
* **ORM:** [Prisma](https://www.prisma.io/)
* **Auth:** [NextAuth.js](https://next-auth.js.org/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Deployment:** [Vercel](https://vercel.com/)

---

## 📸 Screenshots

| Dashboard | Course Player |
|-----------|---------------|
| ![Dashboard](https://via.placeholder.com/400x200/222/fff?text=Dashboard+Shot) | ![Player](https://via.placeholder.com/400x200/222/fff?text=Player+Shot) |

| Leaderboard | Community |
|-------------|-----------|
| ![Leaderboard](https://via.placeholder.com/400x200/222/fff?text=Leaderboard+Shot) | ![Community](https://via.placeholder.com/400x200/222/fff?text=Community+Shot) |

*(Jangan lupa upload screenshot asli kamu ke folder public atau issue github, lalu ganti link di atas)*

---

## 🚀 Cara Menjalankan (Localhost)

Ikuti langkah ini untuk menjalankan project di komputer kamu:

### 1. Clone Repository
```bash
git clone [https://github.com/username-kamu/eduspace-v2.git](https://github.com/username-kamu/eduspace-v2.git)
cd eduspace-v2

```

### 2. Install Dependencies

```bash
npm install

```

### 3. Setup Environment Variables

Buat file `.env` di root folder, dan isi dengan konfigurasi berikut:

```env
# Koneksi Database (Gunakan Supabase/Neon/Local Postgres)
DATABASE_URL="postgresql://user:password@localhost:5432/eduspace_db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="rahasia_super_aman_123"

```

### 4. Setup Database

Sinkronisasi skema database dan isi data dummy (Seeding):

```bash
# Push skema ke database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Isi data awal (User, Course, Community Posts)
npx prisma db seed

```

### 5. Jalankan Server

```bash
npm run dev

```

Buka [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) di browser kamu.

---

## 📂 Struktur Project

```
app/
├── api/              # Backend Routes (NextAuth, Prisma logic)
├── components/       # Reusable UI (CoursePlayer, Charts, etc)
├── dashboard/        # Halaman Utama (Protected Routes)
│   ├── community/    # Fitur Threads
│   ├── courses/      # Katalog & Player
│   ├── leaderboard/  # Halaman Ranking
│   └── page.tsx      # Dashboard Home
├── login/            # Halaman Auth
└── prisma/           # Database Schema & Seed

```

---

## 🔐 Akun Demo

Gunakan akun ini untuk pengujian cepat:

* **Email:** `fadjar@eduspace.id`
* **Password:** `123456`

---

## 🤝 Kontribusi

Project ini dikembangkan oleh **Fadjar Setiawan**.
Masukan dan Pull Request sangat diterima!

Happy Coding! 🚀

```

***

### 💡 Tips Tambahan Biar Makin Keren:

1.  **Ganti Screenshot:**
    Kamu kan tadi sudah kirim screenshot ke saya. Nah, buat folder baru di project kamu namanya `public/screenshots`. Masukkan gambar-gambar tadi ke situ. Lalu di README, ganti link `https://via.placeholder...` dengan path relatif, misal: `![Dashboard](/screenshots/dashboard.png)`.

2.  **Live Link:**
    Jangan lupa ganti `https://eduspace-v2.vercel.app` dengan link Vercel aslimu kalau beda.

3.  **Username GitHub:**
    Di bagian "Clone Repository", ganti `username-kamu` dengan username GitHub aslimu.

Langsung sikat, Bang! Project sekeren ini sayang kalau dokumentasinya kosong. 🔥

```