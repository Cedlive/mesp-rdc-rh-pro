
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Sparkles, X, Send, Bot, Minimize2, Maximize2, 
  MessageSquare, Terminal, Zap, BrainCircuit, 
  FileText, BarChart3, Gavel, Megaphone, Loader2,
  ChevronRight, ClipboardList
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  prompt: string;
}

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'model', text: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  const QUICK_ACTIONS: QuickAction[] = [
    { 
      id: 'note', 
      label: 'Note de service', 
      icon: Megaphone, 
      prompt: "Rédige un brouillon de note de service officielle pour annoncer une réunion d'urgence demain à 10h concernant la nouvelle grille salariale." 
    },
    { 
      id: 'analys', 
      label: 'Analyse Paie', 
      icon: BarChart3, 
      prompt: "Analyse les tendances de la masse salariale en RDC pour le secteur de l'éducation en 2024 et propose 3 pistes d'optimisation." 
    },
    { 
      id: 'law', 
      label: 'Droit du Travail', 
      icon: Gavel, 
      prompt: "Quelles sont les obligations de la MESP-RDC concernant les indemnités de fin de carrière selon le code du travail congolais ?" 
    },
    { 
      id: 'contract', 
      label: 'Clause Contrat', 
      icon: FileText, 
      prompt: "Génère une clause de confidentialité stricte adaptée à un contrat de médecin conseil pour la MESP." 
    }
  ];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatHistory, isOpen, isGenerating]);

  const handleQuery = async (input: string) => {
    if (!input.trim() || isGenerating) return;

    const userText = input;
    setChatHistory(prev => [...prev, { role: 'user', text: userText }]);
    setMessage('');
    setIsGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userText,
        config: {
            systemInstruction: `Tu es l'Assistant Expert MESP Genius, le cœur d'intelligence artificielle du logiciel RH de la MESP-RDC (Mutuelle de Santé des Enseignants en RDC).
            Ton rôle : Assister les gestionnaires RH dans leurs tâches quotidiennes.
            Expertise : Code du travail de la RDC, rédaction administrative (notes de service, contrats, rapports), calcul de paie multi-devises (CDF/USD), et gestion médicale.
            Style : Professionnel, concis, structuré et toujours prêt à aider. 
            Utilisateur actuel : ${currentUser?.firstName} ${currentUser?.lastName}, rôle : ${currentUser?.role}.
            Important : Pour les documents officiels, utilise toujours un formatage Markdown élégant.`
        }
      });

      const modelText = response.text || "Désolé, je rencontre une difficulté technique pour traiter cette requête.";
      setChatHistory(prev => [...prev, { role: 'model', text: modelText }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'model', text: "Erreur de connexion avec le centre neural. Veuillez vérifier votre clé API ou votre connexion réseau." }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleQuery(message);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-700 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[100] group overflow-hidden"
        title="MESP Genius Assistant"
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
        <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 bg-white dark:bg-slate-900 shadow-2xl rounded-[1.5rem] border border-slate-200 dark:border-slate-700 z-[100] flex flex-col transition-all duration-300 overflow-hidden ${isMinimized ? 'h-16 w-64' : 'h-[600px] w-[420px]'}`}>
        {/* Header Style Logiciel */}
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center shrink-0 border-b border-white/10">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <BrainCircuit size={18} />
                </div>
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest leading-none">MESP Genius</h3>
                    <p className="text-[9px] text-blue-400 font-bold uppercase mt-1">Intelligence RH Active</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-white/10 rounded-md transition-colors">
                    {isMinimized ? <Maximize2 size={14}/> : <Minimize2 size={14}/>}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-red-500/20 rounded-md transition-colors text-red-400">
                    <X size={16}/>
                </button>
            </div>
        </div>

        {!isMinimized && (
            <>
                {/* Chat Body */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50 custom-scrollbar">
                    {chatHistory.length === 0 && (
                        <div className="flex flex-col h-full items-center justify-center text-center p-6 space-y-6">
                            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex items-center justify-center text-blue-600 animate-bounce-slow">
                                <Bot size={40}/>
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-800 dark:text-slate-100">Bonjour {currentUser?.firstName} !</p>
                                <p className="text-xs text-slate-500 mt-2 leading-relaxed">Je suis votre expert RH augmenté. Que souhaitez-vous accomplir aujourd'hui ?</p>
                            </div>
                            
                            {/* Quick Actions Grid */}
                            <div className="grid grid-cols-2 gap-3 w-full">
                                {QUICK_ACTIONS.map(action => {
                                    const ActionIcon = action.icon;
                                    return (
                                        <button 
                                            key={action.id}
                                            onClick={() => handleQuery(action.prompt)}
                                            className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hover:border-blue-500 hover:shadow-md transition-all group"
                                        >
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <ActionIcon size={14} />
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter">{action.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    
                    {chatHistory.map((chat, i) => (
                        <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                                chat.role === 'user' 
                                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm whitespace-pre-wrap'
                            }`}>
                                {chat.text}
                            </div>
                        </div>
                    ))}
                    
                    {isGenerating && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-sm shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                                <Loader2 size={16} className="animate-spin text-blue-600" />
                                <span className="text-[11px] font-bold text-slate-400 uppercase animate-pulse">Réflexion en cours...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Form */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
                    <form onSubmit={onFormSubmit} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity"></div>
                        <div className="relative flex items-end gap-2">
                            <textarea 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), onFormSubmit(e))}
                                placeholder="Demander un document, une analyse..."
                                className="w-full pl-4 pr-12 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-0 outline-none resize-none max-h-32 dark:text-white transition-all"
                                rows={1}
                            />
                            <button 
                                type="submit"
                                disabled={!message.trim() || isGenerating}
                                className="absolute right-2 bottom-1.5 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-30 disabled:scale-100 shadow-lg shadow-blue-600/20 active:scale-90 transition-all"
                            >
                                <Send size={18}/>
                            </button>
                        </div>
                    </form>
                    <div className="mt-3 flex justify-center">
                        <p className="text-[9px] text-slate-400 flex items-center gap-1">
                            <Zap size={10} className="text-yellow-500" /> Gemini Pro Agent - Sécurisé par MESP-RDC IT
                        </p>
                    </div>
                </div>
            </>
        )}
    </div>
  );
};
