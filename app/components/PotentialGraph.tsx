// File: app/components/PotentialGraph.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Sparkles, ArrowRight, Info } from "lucide-react";

// Load Library Grafik
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

export default function PotentialGraph() {
  const fgRef = useRef<any>();
  
  // -- STATE 1: WORKSHOP (INPUT) --
  const [knowledgeList, setKnowledgeList] = useState<string[]>(["", "", "", "", ""]);
  const [skillList, setSkillList] = useState<string[]>(["", "", "", "", ""]);
  const [step, setStep] = useState<"INPUT" | "RESULT">("INPUT");

  // -- STATE 2: VISUALIZATION --
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedLink, setSelectedLink] = useState<any>(null); // Saat garis diklik
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  // Fungsi Update Input
  const updateKnowledge = (index: number, val: string) => {
    const newArr = [...knowledgeList];
    newArr[index] = val;
    setKnowledgeList(newArr);
  };

  const updateSkill = (index: number, val: string) => {
    const newArr = [...skillList];
    newArr[index] = val;
    setSkillList(newArr);
  };

  // FUNGSI UTAMA: GENERATE 45 KOMBINASI (10 Nodes -> Complete Bipartite Graph)
  const generateNetwork = () => {
    const nodes: any[] = [];
    const links: any[] = [];

    // 1. Buat Nodes (5 Pengetahuan - Biru, 5 Skill - Hijau)
    knowledgeList.forEach((k) => {
      if(k) nodes.push({ id: k, group: "KNOWLEDGE", color: "#3b82f6", val: 10 });
    });
    skillList.forEach((s) => {
      if(s) nodes.push({ id: s, group: "SKILL", color: "#22c55e", val: 10 });
    });

    // 2. Buat Edges (Hubungkan SEMUA Pengetahuan ke SEMUA Skill)
    // 5 x 5 = 25 Utama, tapi user minta "semua titik ke semua titik" (45 total)
    // Logika 45 garis = (10 * 9) / 2. Artinya Full Mesh (Complete Graph).
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        links.push({
          source: nodes[i].id,
          target: nodes[j].id,
          id: `${nodes[i].id} + ${nodes[j].id}` // ID Unik Kombinasi
        });
      }
    }

    setGraphData({ nodes, links } as any);
    setStep("RESULT");
  };

  // FUNGSI AI: Tanya detail kombinasi saat garis diklik
  const handleLinkClick = async (link: any) => {
    setSelectedLink(link);
    setAiLoading(true);
    setAiResult(null);

    // Simulasi Call AI (Nanti diganti API Route beneran)
    // Kita simulasi dulu biar cepet UI-nya kebentuk
    setTimeout(() => {
      setAiResult({
        title: `Ahli ${link.source.id} Berbasis ${link.target.id}`,
        career: `Spesialis yang menggabungkan prinsip ${link.source.id} dengan kemampuan teknis ${link.target.id} untuk menciptakan solusi inovatif.`,
        project: `Membuat portofolio proyek yang menerapkan ${link.target.id} dalam konteks industri ${link.source.id}.`,
        skills: ["Critical Thinking", "Complex Problem Solving", "Interdisciplinary Strategy"]
      });
      setAiLoading(false);
    }, 1500);
  };

  // --- TAMPILAN 1: FORM INPUT (THE WORKSHOP) ---
  if (step === "INPUT") {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">The Workshop</h2>
          <p className="text-white/60">Masukkan 5 Bidang Pengetahuan & 5 Keterampilan Utama Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Kolom Kiri: Knowledge */}
          <div className="space-y-4">
            <h3 className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-4">5 Bidang Pengetahuan</h3>
            {knowledgeList.map((val, i) => (
              <input key={i} type="text" placeholder={`Pengetahuan #${i+1} (Contoh: Psikologi)`}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                value={val} onChange={(e) => updateKnowledge(i, e.target.value)}
              />
            ))}
          </div>

          {/* Kolom Kanan: Skill */}
          <div className="space-y-4">
            <h3 className="text-green-400 font-bold uppercase tracking-widest text-sm mb-4">5 Keterampilan Teknis</h3>
            {skillList.map((val, i) => (
              <input key={i} type="text" placeholder={`Skill #${i+1} (Contoh: Data Analysis)`}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-green-500 outline-none"
                value={val} onChange={(e) => updateSkill(i, e.target.value)}
              />
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <button onClick={generateNetwork} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl font-bold text-lg hover:opacity-90 transition shadow-xl flex items-center gap-3">
            <Sparkles size={20} />
            Visualisasikan Jaringan Saya
          </button>
        </div>
      </div>
    );
  }

  // --- TAMPILAN 2: HASIL (THE NETWORK) ---
  return (
    <div className="relative w-full h-[80vh] bg-[#111] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none z-10">
        <div>
          <h2 className="text-2xl font-bold text-white">Jaringan Potensi Anda</h2>
          <p className="text-white/50 text-sm">45 Kombinasi Potensi Terdeteksi</p>
        </div>
        <button onClick={() => setStep("INPUT")} className="pointer-events-auto px-4 py-2 bg-white/10 backdrop-blur rounded-lg text-sm hover:bg-white/20 transition">
          Ubah Data
        </button>
      </div>

      {/* Info Box Bawah */}
      {!selectedLink && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur px-6 py-3 rounded-full border border-white/10 text-sm text-white/70 pointer-events-none z-10 animate-pulse">
          Klik garis penghubung untuk melihat potensi kombinasi
        </div>
      )}

      {/* SIDEBAR DETAIL (Muncul saat klik garis) */}
      {selectedLink && (
        <div className="absolute top-0 right-0 w-96 h-full bg-[#1a1a1a]/95 backdrop-blur border-l border-white/10 p-8 z-20 shadow-2xl transform transition-transform overflow-y-auto">
          <button onClick={() => setSelectedLink(null)} className="absolute top-4 right-4 text-white/40 hover:text-white">✕</button>
          
          <div className="mt-6">
            <div className="flex gap-2 mb-4">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30">{selectedLink.source.id}</span>
              <span className="text-white/30">+</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30">{selectedLink.target.id}</span>
            </div>

            {aiLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-white/10 rounded w-3/4"></div>
                <div className="h-24 bg-white/10 rounded w-full"></div>
                <div className="h-24 bg-white/10 rounded w-full"></div>
              </div>
            ) : aiResult ? (
              <>
                <h3 className="text-xl font-bold text-white mb-2">{aiResult.title}</h3>
                
                <div className="mt-6 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-[#fbbf24] uppercase tracking-widest mb-2">Potensi Karir</h4>
                    <p className="text-sm text-white/80 leading-relaxed">{aiResult.career}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold text-[#fbbf24] uppercase tracking-widest mb-2">Ide Proyek</h4>
                    <p className="text-sm text-white/80 leading-relaxed">{aiResult.project}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[#fbbf24] uppercase tracking-widest mb-2">Skill Pendukung</h4>
                    <div className="flex flex-wrap gap-2">
                      {aiResult.skills.map((s: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-white/60">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* GRAPH CANVAS */}
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeLabel="id"
        nodeColor={(node: any) => node.color}
        nodeVal={8}
        linkColor={() => "rgba(255,255,255,0.15)"}
        linkWidth={(link: any) => link === selectedLink ? 3 : 1} // Garis tebal saat dipilih
        linkDirectionalParticles={selectedLink ? 4 : 0} // Partikel cuma muncul di garis terpilih
        linkDirectionalParticleSpeed={0.01}
        backgroundColor="#111"
        onLinkClick={handleLinkClick} // Event klik garis
      />
    </div>
  );
}