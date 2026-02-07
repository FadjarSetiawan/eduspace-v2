// File: app/api/ai/analyze-connection/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Log biar kita tau endpoint ini kepanggil
  console.log("🚀 API /api/ai/analyze-connection dipanggil");

  try {
    // 1. Cek API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ FATAL: API Key tidak terbaca di process.env");
      return NextResponse.json(
        { success: false, error: "API Key Server Missing. Coba restart server." }, 
        { status: 500 }
      );
    }

    // 2. Baca Input
    const body = await req.json();
    const { source, target } = body;
    console.log(`🤖 Menganalisis Kombinasi: [${source}] + [${target}]`);

    if (!source || !target) {
        return NextResponse.json({ success: false, error: "Input kosong" }, { status: 400 });
    }

    // 3. Setup AI
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // --- PILIHAN MODEL DARI DAFTAR KAMU ---
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      Bertindaklah sebagai Konsultan Karir Masa Depan Expert.
      Tugas: Analisis potensi unik dari penggabungan bidang pengetahuan "${source}" dan skill teknis "${target}".
      
      ATURAN WAJIB:
      1. Jawab HANYA dengan format JSON valid.
      2. JANGAN ada teks pembuka seperti "Tentu" atau "Berikut jsonnya".
      3. JANGAN gunakan markdown formatting (\`\`\`json). Langsung kurung kurawal { ... }.
      4. Gunakan Bahasa Indonesia yang profesional namun inspiratif.
      
      Struktur JSON:
      {
        "career": "Nama Pekerjaan Futuristis (Contoh: Neuro-Marketer)",
        "description": "Deskripsi pekerjaan yang menarik dalam 2 kalimat.",
        "project": "Ide proyek portofolio konkret yang menggabungkan kedua hal tersebut.",
        "skills": ["Hard Skill 1", "Hard Skill 2", "Soft Skill 1", "Soft Skill 2", "Tools"],
        "learningPath": [
           "Bulan 1: Fokus fundamental...",
           "Bulan 2: Studi kasus...",
           "Bulan 3: Proyek integrasi...",
           "Bulan 4: Membangun portofolio..."
        ],
        "market": "Insight singkat tentang gaji atau permintaan pasar."
      }
    `;

    // 4. Eksekusi AI
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log("📥 Respon AI:", text.substring(0, 50) + "..."); 

    // 5. PEMBERSIHAN DATA (CLEANING)
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1);
    } else {
      console.error("❌ Respon AI bukan JSON:", text);
      throw new Error("AI memberikan format yang salah.");
    }

    // 6. Parse & Kirim
    const data = JSON.parse(text);
    console.log("✅ JSON Berhasil. Mengirim ke Frontend...");
    
    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error("🔥 SERVER ERROR:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Terjadi kesalahan internal pada AI." 
    }, { status: 500 });
  }
}