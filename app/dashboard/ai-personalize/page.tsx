// File: app/dashboard/ai-personalize/page.tsx
"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Download, 
  BrainCircuit, 
  Cpu, 
  X,
  Loader2 
} from "lucide-react";

// Import Graph tanpa SSR
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

export default function AiPersonalizePage() {
  // --- STATE ---
  const [step, setStep] = useState<1 | 2>(1); // 1 = Input, 2 = Graph
  
  // Data Input
  const [knowledge, setKnowledge] = useState<string[]>(["", "", "", "", ""]);
  const [skills, setSkills] = useState<string[]>(["", "", "", "", ""]);
  
  // Data Graph
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const fgRef = useRef<any>();

  // Data Detail (Panel Kanan)
  const [selectedLink, setSelectedLink] = useState<any>(null);
  const [aiData, setAiData] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [exploredCount, setExploredCount] = useState(0);
  const exploredSet = useRef(new Set()); // Untuk melacak yg sudah diklik

  // --- HANDLERS ---

  const handleInputChange = (type: 'knowledge' | 'skill', index: number, value: string) => {
    if (type === 'knowledge') {
      const newArr = [...knowledge];
      newArr[index] = value;
      setKnowledge(newArr);
    } else {
      const newArr = [...skills];
      newArr[index] = value;
      setSkills(newArr);
    }
  };

  const checkValid = () => {
    // Minimal harus isi 3 di masing-masing biar seru (walaupun user minta 5)
    const kFilled = knowledge.filter(k => k.trim()).length;
    const sFilled = skills.filter(s => s.trim()).length;
    return kFilled >= 3 && sFilled >= 3;
  };

  const generateGraph = () => {
    const nodes: any[] = [];
    const links: any[] = [];

    // Filter yang kosong
    const validK = knowledge.filter(k => k.trim());
    const validS = skills.filter(s => s.trim());

    // Create Nodes
    validK.forEach((k, i) => nodes.push({ id: `k-${i}`, label: k, type: 'KNOWLEDGE', val: 10 }));
    validS.forEach((s, i) => nodes.push({ id: `s-${i}`, label: s, type: 'SKILL', val: 10 }));

    // Create Links (All to All - Bipartite)
    validK.forEach((k, i) => {
      validS.forEach((s, j) => {
        links.push({
          source: `k-${i}`,
          target: `s-${j}`,
          id: `${k}-${s}`, // ID unik kombinasi
          isExplored: false
        });
      });
    });

    setGraphData({ nodes, links } as any);
    setStep(2);
  };

  const handleLinkClick = async (link: any) => {
    setSelectedLink(link);
    setAiData(null);
    setLoadingAi(true);

    // Hitung explored
    const linkId = `${link.source.label}-${link.target.label}`;
    if (!exploredSet.current.has(linkId)) {
        exploredSet.current.add(linkId);
        setExploredCount(exploredSet.current.size);
        link.isExplored = true; // Update visual di graph (biar garisnya nyala)
    }

    try {
      // PANGGIL REAL AI (Backend Route yang baru kita buat)
      const res = await fetch("/api/ai/analyze-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          source: link.source.label, 
          target: link.target.label 
        }),
      });

      const json = await res.json();

      if (json.success) {
        setAiData(json.data);
      } else {
        setAiData({ error: json.error || "Gagal mengambil data AI" });
      }

    } catch (err) {
      console.error(err);
      setAiData({ error: "Terjadi kesalahan koneksi" });
    } finally {
      setLoadingAi(false);
    }
  };

  // --- RENDER ---

  return (
    <div className="relative min-h-screen bg-[#222222] text-[#fefefe] selection:bg-[#fefefe] selection:text-[#222]">
      
      {/* 1. AMBIENT BACKGROUND (Monokrom Halus) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/5 blur-[150px] rounded-full opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[150px] rounded-full opacity-40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        
        {/* HEADER */}
        <div className="text-center mb-12">
           <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
             Jaringan <span className="text-[#fefefe]/50">Potensi</span>
           </h1>
           <p className="text-[#fefefe]/60 max-w-2xl mx-auto">
             Hubungkan titik pengetahuan & keterampilanmu. Temukan kombinasi karir unik dengan bantuan AI.
           </p>
        </div>

        {/* STEP INDICATOR */}
        <div className="flex justify-center gap-4 mb-10">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${step === 1 ? 'bg-[#fefefe] text-[#222] border-[#fefefe]' : 'border-white/10 text-white/40'}`}>
                <span className="font-bold">1</span> Input Data
            </div>
            <div className="w-10 h-[1px] bg-white/10 self-center"></div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${step === 2 ? 'bg-[#fefefe] text-[#222] border-[#fefefe]' : 'border-white/10 text-white/40'}`}>
                <span className="font-bold">2</span> Visualisasi
            </div>
        </div>

        {/* --- VIEW 1: INPUT FORM (THE WORKSHOP) --- */}
        {step === 1 && (
            <div className="animate-in fade-in zoom-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Knowledge Column */}
                    <div className="glass-panel p-8 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-white/10 rounded-lg"><BrainCircuit size={20}/></div>
                            <h3 className="font-bold text-lg">Bidang Pengetahuan</h3>
                        </div>
                        <div className="space-y-3">
                            {knowledge.map((val, i) => (
                                <input 
                                    key={i}
                                    type="text" 
                                    placeholder={`Contoh: ${i === 0 ? 'Psikologi' : i === 1 ? 'Bisnis' : 'Sejarah'}`}
                                    className="w-full bg-[#fefefe]/5 border border-[#fefefe]/10 rounded-xl px-4 py-3 text-sm focus:bg-[#fefefe]/10 focus:border-[#fefefe]/30 transition outline-none"
                                    value={val}
                                    onChange={(e) => handleInputChange('knowledge', i, e.target.value)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Skills Column */}
                    <div className="glass-panel p-8 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-white/10 rounded-lg"><Cpu size={20}/></div>
                            <h3 className="font-bold text-lg">Keterampilan Teknis</h3>
                        </div>
                        <div className="space-y-3">
                            {skills.map((val, i) => (
                                <input 
                                    key={i}
                                    type="text" 
                                    placeholder={`Contoh: ${i === 0 ? 'Coding' : i === 1 ? 'Desain Grafis' : 'Writing'}`}
                                    className="w-full bg-[#fefefe]/5 border border-[#fefefe]/10 rounded-xl px-4 py-3 text-sm focus:bg-[#fefefe]/10 focus:border-[#fefefe]/30 transition outline-none"
                                    value={val}
                                    onChange={(e) => handleInputChange('skill', i, e.target.value)}
                                />
                            ))}
                        </div>
                    </div>

                </div>

                {/* Action Button */}
                <div className="mt-10 flex justify-center">
                    <button 
                        onClick={generateGraph}
                        disabled={!checkValid()}
                        className="group px-8 py-4 bg-[#fefefe] text-[#222] rounded-xl font-bold text-lg flex items-center gap-3 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                        <Sparkles size={20} className={checkValid() ? "text-yellow-500" : ""} />
                        Visualisasikan Jaringan
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                    </button>
                </div>
            </div>
        )}

        {/* --- VIEW 2: GRAPH VISUALIZATION --- */}
        {step === 2 && (
            <div className="animate-in fade-in duration-700 relative h-[700px] w-full border border-white/10 rounded-3xl overflow-hidden bg-[#111]">
                
                {/* Graph Controls Overlay */}
                <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none z-10">
                    <div className="glass-panel px-6 py-4 rounded-xl flex gap-8 pointer-events-auto">
                        <div className="text-center">
                            <p className="text-xs text-white/40 uppercase tracking-widest">Nodes</p>
                            <p className="text-xl font-bold">{graphData.nodes.length}</p>
                        </div>
                        <div className="w-[1px] bg-white/10"></div>
                        <div className="text-center">
                            <p className="text-xs text-white/40 uppercase tracking-widest">Kombinasi</p>
                            <p className="text-xl font-bold">{graphData.links.length}</p>
                        </div>
                        <div className="w-[1px] bg-white/10"></div>
                        <div className="text-center">
                            <p className="text-xs text-white/40 uppercase tracking-widest">Explored</p>
                            <p className="text-xl font-bold text-yellow-400">{exploredCount}</p>
                        </div>
                    </div>

                    <div className="flex gap-2 pointer-events-auto">
                        <button onClick={() => setStep(1)} className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition" title="Edit Data">
                            <ArrowLeft size={20} />
                        </button>
                        <button onClick={generateGraph} className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition" title="Reset Graph">
                            <RotateCcw size={20} />
                        </button>
                    </div>
                </div>

                {/* GRAPH COMPONENT */}
                <ForceGraph2D
                    ref={fgRef}
                    graphData={graphData}
                    backgroundColor="#111"
                    nodeLabel="label"
                    nodeColor={(node: any) => node.type === 'KNOWLEDGE' ? '#fefefe' : '#cccccc'} // Putih & Abu
                    nodeVal={6}
                    linkColor={(link: any) => link.isExplored ? '#fbbf24' : 'rgba(255,255,255,0.1)'} // Kuning kalau sudah diklik
                    linkWidth={(link: any) => link.isExplored ? 2 : 1}
                    linkDirectionalParticles={(link: any) => link.isExplored ? 4 : 0}
                    linkDirectionalParticleColor={() => "#fbbf24"}
                    linkDirectionalParticleWidth={2}
                    onLinkClick={handleLinkClick} // KLIK GARIS
                    onNodeClick={(node) => {
                        // Zoom to node
                        fgRef.current?.centerAt(node.x, node.y, 1000);
                        fgRef.current?.zoom(3, 2000);
                    }}
                />

                {/* DETAIL PANEL (SLIDE IN) */}
                {selectedLink && (
                    <div className="absolute top-0 right-0 w-full md:w-[450px] h-full bg-[#1a1a1a]/95 backdrop-blur-xl border-l border-white/10 p-8 overflow-y-auto shadow-2xl z-20 animate-in slide-in-from-right duration-300">
                        
                        <button 
                            onClick={() => setSelectedLink(null)}
                            className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition"
                        >
                            <X size={20} />
                        </button>

                        <div className="mt-8">
                            {/* Header Kombinasi */}
                            <div className="flex items-center gap-3 text-sm font-medium text-white/50 mb-4">
                                <span className="px-3 py-1 border border-white/10 rounded-full bg-white/5">{selectedLink.source.label}</span>
                                <span>+</span>
                                <span className="px-3 py-1 border border-white/10 rounded-full bg-white/5">{selectedLink.target.label}</span>
                            </div>

                            {loadingAi ? (
                                <div className="flex flex-col items-center justify-center h-64 text-center">
                                    <Loader2 className="animate-spin mb-4 text-white/50" size={32} />
                                    <p className="text-white/70">AI sedang menganalisis potensi...</p>
                                </div>
                            ) : aiData ? (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    
                                    {aiData.error ? (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl text-sm">
                                            {aiData.error}
                                        </div>
                                    ) : (
                                        <>
                                            {/* Career Title */}
                                            <div>
                                                <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                                    {aiData.career}
                                                </h2>
                                                <p className="text-sm text-white/60 leading-relaxed">
                                                    {aiData.description}
                                                </p>
                                            </div>

                                            <div className="w-full h-[1px] bg-white/10"></div>

                                            {/* Project Idea */}
                                            <div className="bg-white/5 p-5 rounded-xl border border-white/5">
                                                <h3 className="text-xs font-bold uppercase tracking-widest text-yellow-500 mb-3 flex items-center gap-2">
                                                    <Sparkles size={14}/> Ide Proyek
                                                </h3>
                                                <p className="text-sm text-white/80">
                                                    {aiData.project}
                                                </p>
                                            </div>

                                            {/* Skills */}
                                            <div>
                                                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Skill Set</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {aiData.skills?.map((s: string, i: number) => (
                                                        <span key={i} className="text-xs px-3 py-1.5 bg-white/10 rounded-md border border-white/5">
                                                            {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Learning Path */}
                                            <div>
                                                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Rute Belajar</h3>
                                                <ul className="space-y-3">
                                                    {aiData.learningPath?.map((step: string, i: number) => (
                                                        <li key={i} className="text-sm flex gap-3 text-white/70">
                                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold border border-white/10">
                                                                {i + 1}
                                                            </span>
                                                            {step}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Market Insight */}
                                            <div className="text-xs text-white/40 border-t border-white/10 pt-4 mt-4 italic">
                                                " {aiData.market} "
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
}