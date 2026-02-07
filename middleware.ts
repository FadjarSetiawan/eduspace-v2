// File: middleware.ts
import { withAuth } from "next-auth/middleware";

// Export default wajib berupa fungsi middleware
export default withAuth({
  pages: {
    signIn: "/login", // Jika belum login, lempar ke sini
  },
});

// Konfigurasi halaman mana yang diproteksi
export const config = {
  matcher: [
    "/dashboard/:path*", // Proteksi semua route di dalam /dashboard
  ],
};