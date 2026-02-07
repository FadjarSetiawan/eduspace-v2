// File: app/dashboard/layout.tsx
import DashboardSidebar from "../components/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#222222] text-[#fefefe]">
      
      {/* Panggil Komponen Sidebar Baru */}
      <DashboardSidebar />

      {/* MAIN CONTENT AREA */}
      {/* Kita kasih margin-left 72 (w-72) supaya konten gak ketutupan sidebar */}
      <main className="flex-1 ml-72 p-8 relative min-h-screen">
        
        {/* Header Transparan (Opsional: Untuk Breadcrumb atau Profil) */}
        <div className="h-16 flex items-center justify-end mb-4 pointer-events-none">
             {/* Tempat taruh notifikasi/profil user di masa depan */}
        </div>

        {/* Isi Halaman */}
        <div className="max-w-7xl mx-auto pb-20">
            {children}
        </div>
        
      </main>
    </div>
  );
}