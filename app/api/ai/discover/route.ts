// File: app/api/ai/discover/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Inisialisasi Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    // 1. Terima data skill dari Frontend
    const { nodes } = await req.json(); // Contoh: ["Coding", "Psychology"]

    if (!nodes || nodes.length === 0) {
      return NextResponse.json({ error: "Skill tidak boleh kosong" }, { status: 400 });
    }

    console.log("🤖 AI Sedang berpikir untuk skill:", nodes);

    // 2. Siapkan Prompt untuk Gemini
    // Kita minta format JSON Array murni supaya gampang diolah code
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      Saya adalah user dengan skill/minat berikut: ${nodes.join(", ")}.
      
      Tugas kamu:
      Berikan 3 rekomendasi KARIR SPESIFIK yang unik (kombinasi dari skill tersebut).
      Jangan berikan penjelasan panjang. HANYA berikan nama karirnya dalam format JSON Array of Strings.
      
      Contoh Output yang benar:
      ["UX Researcher", "EdTech Developer", "Behavioral Data Analyst"]
      
      JANGAN pakai markdown. JANGAN pakai tanda kutip tiga (backticks). Langsung kurung siku.
    `;

    // 3. Minta Gemini menjawab
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("💡 Jawaban Gemini Mentah:", text);

    // 4. Bersihkan jawaban (kadang AI masih suka kasih markdown ```json)
    let cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    // Safety check: Pastikan diawali [ dan diakhiri ]
    const firstBracket = cleanJson.indexOf("[");
    const lastBracket = cleanJson.lastIndexOf("]");
    if (firstBracket !== -1 && lastBracket !== -1) {
      cleanJson = cleanJson.substring(firstBracket, lastBracket + 1);
    }

    // 5. Parse jadi Object JavaScript
    const careers = JSON.parse(cleanJson);

    // 6. Kirim balik ke Frontend
    return NextResponse.json({ 
      success: true, 
      data: careers 
    });

  } catch (error) {
    console.error("🔥 Error AI:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Maaf, AI sedang pusing. Coba lagi nanti." 
    }, { status: 500 });
  }
}