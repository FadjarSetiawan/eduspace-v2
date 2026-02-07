// File: cek_model.js
// Script untuk melihat model apa saja yang tersedia untuk API Key kamu

// GANTI INI DENGAN API KEY DARI FILE .ENV KAMU
const API_KEY = "AIzaSyBmx3oFQD9yk48dP7eLOvdUO8KJtsTmB-E"; 

async function cekModel() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("❌ Error:", data.error.message);
    } else {
      console.log("\n=== DAFTAR MODEL YANG BISA KAMU PAKAI ===");
      console.log("(Pilih salah satu nama di bawah ini untuk ditaruh di route.ts)\n");
      
      data.models.forEach(model => {
        // Kita cari model yang support 'generateContent'
        if (model.supportedGenerationMethods && model.supportedGenerationMethods.includes("generateContent")) {
          // Hapus prefix 'models/' biar bersih
          console.log(`✅ ${model.name.replace("models/", "")}`);
        }
      });
      console.log("\n===========================================\n");
    }
  } catch (err) {
    console.error("Gagal koneksi:", err);
  }
}

cekModel();