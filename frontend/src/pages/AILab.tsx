
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Sparkles, Send, FileCode, Trash2, 
  Save, RefreshCw, BrainCircuit, ChevronRight,
  ShieldCheck, Zap, Layers, Binary, FileText,
  Megaphone, CheckCircle2, Calendar, Clock
} from 'lucide-react';

export const AILab = () => {
  const [prompt, setPrompt] = useState('');
  const [projectStartDate, setProjectStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [editorContent, setEditorContent] = useState('# MESP-RDC Intelligent Hub v3.1\n// Bienvenue dans votre centre de commande assisté par Gemini.\n// En attente d\'instructions...\n\n');
  const [isGenerating, setIsGenerating] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<{msg: string, type: 'info'|'success'|'error'}[]>([
    { msg: 'Moteur Gemini initialisé...', type: 'info' },
    { msg: 'Base de connaissances MESP chargée.', type: 'success' }
  ]);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleLogs]);

  const handleGeminiQuery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setConsoleLogs(prev => [...prev, { msg: `TRAITEMENT: ${prompt.substring(0, 30)}...`, type: 'info' }]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Contexte : Projet RH débutant le ${projectStartDate}.
                  Requête : ${prompt}.
                  En tant qu'expert RH pour la MESP-RDC, génère une réponse structurée en Markdown.`,
      });

      const text = response.text || "Erreur de génération.";
      setEditorContent(prev => prev + `\n\n--- GÉNÉRÉ LE ${new Date().toLocaleDateString()} ---\n\n` + text);
      setConsoleLogs(prev => [...prev, { msg: 'Document généré avec succès.', type: 'success' }]);
      setPrompt('');
    } catch (error) {
      setConsoleLogs(prev => [...prev, { msg: 'Erreur critique du serveur IA.', type: 'error' }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const PROMPT_SUGGESTIONS = [
    { title: 'Rédiger Note Officielle', icon: Megaphone, text: 'Rédige une note de service pour annoncer la campagne de santé visuelle de la semaine prochaine.' },
    { title: 'Analyse Budgétaire', icon: Binary, text: 'Analyse l\'impact du taux de change (2500 FC/$) sur les primes de mission du personnel.' },
    { title: 'Modèle de Contrat', icon: FileText, text: 'Génère une structure de contrat CDI pour un médecin conseil en RDC.' }
  ];

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col gap-6 animate-fade-in">
      {/* Header Hub IA */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-center border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <div className="flex items-center gap-6 relative z-10">
              <div className="p-4 bg-blue-600/20 rounded-2xl border border-blue-500/30">
                  <BrainCircuit size={42} className="text-blue-400" />
              </div>
              <div>
                  <h1 className="text-3xl font-black tracking-tighter">AI COMMAND <span className="text-blue-500">HUB</span></h1>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                        Gemini 3.0 Pro
                    </span>
                    <span className="text-[10px] font-black uppercase text-green-400 tracking-widest bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                        Secure Environment
                    </span>
                  </div>
              </div>
          </div>
          <div className="flex gap-3 mt-8 md:mt-0 relative z-10">
              <button onClick={() => setEditorContent('')} className="p-4 bg-white/5 hover:bg-red-500/20 text-slate-400 rounded-2xl transition-all" title="Effacer tout">
                  <Trash2 size={22}/>
              </button>
              <button className="px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl">
                  <Save size={18}/> Exporter le document
              </button>
          </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
          {/* Panneau de configuration */}
          <div className="w-full lg:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Paramètres d'Analyse</span>
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto space-y-8 custom-scrollbar">
                  {/* Champ projectStartDate */}
                  <div className="space-y-4">
                      <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Chronologie du projet</p>
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl">
                          <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">
                             Date de début (projectStartDate)
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" size={16} />
                            <input 
                                type="date"
                                value={projectStartDate}
                                onChange={(e) => setProjectStartDate(e.target.value)}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 pl-10 text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                            />
                          </div>
                      </div>
                  </div>

                  <div className="space-y-4">
                      <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Suggestions intelligentes</p>
                      <div className="grid grid-cols-1 gap-2">
                          {PROMPT_SUGGESTIONS.map((s, i) => {
                              const Icon = s.icon;
                              return (
                                <button 
                                    key={i} 
                                    onClick={() => setPrompt(s.text)} 
                                    className="text-left p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-blue-500/50 rounded-2xl transition-all group"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-500">
                                            <Icon size={14}/>
                                        </div>
                                        <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{s.title}</h4>
                                    </div>
                                    <p className="text-[10px] text-slate-400 line-clamp-1">{s.text}</p>
                                </button>
                              );
                          })}
                      </div>
                  </div>
              </div>

              {/* Formulaire d'entrée */}
              <div className="p-6 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800">
                  <form onSubmit={handleGeminiQuery} className="relative">
                      <textarea 
                          rows={4}
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Décrivez votre besoin RH..."
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 pr-14 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none resize-none shadow-sm dark:text-white"
                          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleGeminiQuery())}
                      />
                      <button 
                        type="submit"
                        disabled={isGenerating || !prompt.trim()}
                        className="absolute bottom-4 right-4 p-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-500 disabled:opacity-30 transition-all active:scale-90"
                      >
                          {isGenerating ? <RefreshCw className="animate-spin" size={20}/> : <Send size={20}/>}
                      </button>
                  </form>
              </div>
          </div>

          {/* Sortie de l'Éditeur */}
          <div className="flex-1 flex flex-col bg-white dark:bg-[#0b0e14] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative">
              <div className="bg-slate-50 dark:bg-slate-900 px-6 py-3 flex items-center justify-between text-[10px] font-black text-slate-500 uppercase border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 text-blue-500">
                      <FileCode size={16} /> WORKSPACE_OUTPUT.MD
                  </div>
                  <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-green-500"><Clock size={14}/> Temps Réel</span>
                  </div>
              </div>

              <textarea 
                  className="flex-1 bg-transparent text-slate-700 dark:text-slate-300 p-10 font-mono text-sm leading-relaxed outline-none resize-none"
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  spellCheck={false}
              />

              <div className="h-32 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col">
                  <div className="px-6 py-2 bg-slate-100/50 dark:bg-slate-900/50 flex items-center gap-3 text-[9px] font-black text-slate-500 uppercase border-b border-slate-200 dark:border-slate-800">
                      Cœur Neural - Activité
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-1.5 bg-slate-50/30 dark:bg-black/40">
                      {consoleLogs.map((log, i) => (
                          <div key={i} className={`flex gap-3 ${log.type === 'error' ? 'text-red-500' : log.type === 'success' ? 'text-green-500' : 'text-blue-500'}`}>
                              <span className="text-slate-400">[{new Date().toLocaleTimeString()}]</span>
                              <span className="flex-1">{log.msg}</span>
                              {log.type === 'success' && <CheckCircle2 size={12} />}
                          </div>
                      ))}
                      {isGenerating && (
                        <div className="text-blue-400 animate-pulse flex items-center gap-2">
                             <span className="text-slate-400">[{new Date().toLocaleTimeString()}]</span>
                             Génération en cours...
                        </div>
                      )}
                      <div ref={consoleEndRef} />
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
