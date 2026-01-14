
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Sparkles, Send, FileCode, Trash2, 
  Save, RefreshCw, BrainCircuit, ShieldCheck, 
  Zap, Calendar, Terminal, CheckCircle2, Clock
} from 'lucide-react';

export const AILab = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [editorContent, setEditorContent] = useState('# MESP-RDC Intelligent Hub\n// Centre de commande assisté par Gemini 3.0\n\n');
  const [consoleLogs, setConsoleLogs] = useState<{msg: string, type: 'info'|'success'|'error'}[]>([
    { msg: 'Moteur Gemini prêt.', type: 'info' },
    { msg: 'Liaison sécurisée établie.', type: 'success' }
  ]);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleLogs]);

  const handleGeminiQuery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setConsoleLogs(prev => [...prev, { msg: `ANALYSE: ${prompt.substring(0, 30)}...`, type: 'info' }]);

    try {
      // Syntaxe correcte demandée par les guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "Tu es l'Expert RH de la MESP-RDC. Tu aides à la rédaction de contrats, notes de service et analyses de paie en RDC. Réponds en Markdown professionnel."
        }
      });

      // Accès à .text (propriété, pas méthode)
      const text = response.text || "La génération a échoué.";
      setEditorContent(prev => prev + `\n\n/* RÉPONSE IA - ${new Date().toLocaleTimeString()} */\n\n` + text);
      setConsoleLogs(prev => [...prev, { msg: 'Traitement terminé.', type: 'success' }]);
      setPrompt('');
    } catch (error) {
      setConsoleLogs(prev => [...prev, { msg: 'Erreur API Gemini.', type: 'error' }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col gap-6 animate-fade-in">
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-center border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <div className="flex items-center gap-6 relative z-10">
              <div className="p-4 bg-blue-600/20 rounded-2xl border border-blue-500/30">
                  <BrainCircuit size={42} className="text-blue-400" />
              </div>
              <div>
                  <h1 className="text-3xl font-black tracking-tighter">AI COMMAND <span className="text-blue-500">HUB</span></h1>
                  <p className="text-blue-300/60 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2"><ShieldCheck size={12}/> Gemini 3 Pro Secure Engine</p>
              </div>
          </div>
          <div className="flex gap-3 relative z-10">
              <button onClick={() => setEditorContent('')} className="p-4 bg-white/5 hover:bg-red-500/20 text-slate-400 rounded-2xl transition-all"><Trash2 size={22}/></button>
              <button className="px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl"><Save size={18}/> Exporter MD</button>
          </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
          <div className="w-full lg:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Terminal size={14}/> Console RH</span>
              </div>
              <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar bg-slate-50 dark:bg-slate-950 font-mono text-[11px]">
                  {consoleLogs.map((log, i) => (
                      <div key={i} className={`flex gap-2 ${log.type === 'error' ? 'text-red-500' : log.type === 'success' ? 'text-green-500' : 'text-blue-500'}`}>
                          <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span>
                          <span>{log.msg}</span>
                      </div>
                  ))}
                  <div ref={consoleEndRef} />
              </div>
              <div className="p-6 border-t border-slate-100 dark:border-slate-800">
                  <form onSubmit={handleGeminiQuery} className="relative">
                      <textarea 
                          rows={4}
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Commande RH (ex: rédiger note congés)..."
                          className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 pr-14 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none resize-none dark:text-white"
                      />
                      <button 
                        type="submit"
                        disabled={isGenerating || !prompt.trim()}
                        className="absolute bottom-4 right-4 p-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-500 disabled:opacity-30 transition-all"
                      >
                          {isGenerating ? <RefreshCw className="animate-spin" size={20}/> : <Send size={20}/>}
                      </button>
                  </form>
              </div>
          </div>

          <div className="flex-1 flex flex-col bg-[#0d1117] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
              <div className="bg-slate-900 px-6 py-3 flex items-center justify-between text-[10px] font-black text-slate-500 uppercase border-b border-slate-800">
                  <div className="flex items-center gap-3 text-blue-400">
                      <FileCode size={16} /> output_document.md
                  </div>
                  <div className="flex items-center gap-4 text-green-500">
                      <Zap size={14} fill="currentColor"/> Moteur Actif
                  </div>
              </div>
              <textarea 
                  className="flex-1 bg-[#0d1117] text-slate-300 p-10 font-mono text-sm leading-relaxed outline-none resize-none"
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  spellCheck={false}
              />
          </div>
      </div>
    </div>
  );
};
