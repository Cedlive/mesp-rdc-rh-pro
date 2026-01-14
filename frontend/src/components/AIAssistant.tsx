
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Sparkles, X, Send, Bot, Minimize2, Maximize2, 
  BrainCircuit, Loader2, Zap, Megaphone, 
  BarChart3, Gavel, FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'model', text: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatHistory, isOpen, isGenerating]);

  const handleQuery = async (input: string) => {
    if (!input.trim() || isGenerating) return;

    setChatHistory(prev => [...prev, { role: 'user', text: input }]);
    setMessage('');
    setIsGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: input,
        config: {
            systemInstruction: `Tu es Genius, l'assistant expert MESP-RDC. Tu aides ${currentUser?.firstName} (${currentUser?.role}) à gérer les RH. Réponds en Markdown.`
        }
      });

      // FIX ERROR #31: Forcer la conversion en string
      const modelText = String(response.text || "Désolé, je n'ai pas pu générer de réponse.");
      
      setChatHistory(prev => [...prev, { role: 'model', text: modelText }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'model', text: "Erreur de communication avec le noyau Genius IA." }]);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return (
    <button onClick={() => setIsOpen(true)} className="fixed bottom-10 right-10 w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[100] animate-bounce-slow">
      <Sparkles size={28} />
    </button>
  );

  return (
    <div className={`fixed bottom-10 right-10 bg-white dark:bg-slate-900 shadow-premium rounded-[2rem] border border-slate-200 dark:border-slate-800 z-[100] flex flex-col transition-all duration-300 overflow-hidden ${isMinimized ? 'h-16 w-64' : 'h-[500px] w-[400px]'}`}>
      <div className="p-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <BrainCircuit size={18} className="text-blue-400" />
          <span className="text-[10px] font-black uppercase tracking-widest">Genius AI Nucleus</span>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/10 rounded"><Minimize2 size={14}/></button>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-red-500/20 rounded text-red-400"><X size={16}/></button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950 font-medium custom-scrollbar">
            {chatHistory.map((chat, i) => (
              <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-[12px] shadow-sm ${chat.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 whitespace-pre-wrap'}`}>
                  {chat.text}
                </div>
              </div>
            ))}
            {isGenerating && <div className="flex items-center gap-2 text-[10px] text-slate-400 animate-pulse"><Loader2 size={12} className="animate-spin"/> Genius réfléchit...</div>}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleQuery(message); }} className="p-4 border-t dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex gap-2">
              <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Posez une question à l'IA..." className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white" />
              <button type="submit" disabled={isGenerating || !message.trim()} className="p-2 bg-blue-600 text-white rounded-xl shadow-lg disabled:opacity-30"><Send size={18}/></button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};
