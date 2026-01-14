import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Command, ArrowRight, X, Activity, Wallet, Shield } from 'lucide-react';
/* Fix: Ensure useNavigate is correctly imported from react-router-dom */
import { useNavigate } from 'react-router-dom';
import { MOCK_EMPLOYEES } from '../constants';

export const GlobalSearch = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const results = query.length < 2 ? [] : [
    ...MOCK_EMPLOYEES.filter(e => `${e.firstName} ${e.lastName}`.toLowerCase().includes(query.toLowerCase())).map(e => ({
        type: 'Agent',
        label: `${e.firstName} ${e.lastName}`,
        sub: e.role,
        icon: User,
        action: () => navigate(`/employees?search=${e.id}`)
    })),
    { type: 'Menu', label: 'Pôle Médical', sub: 'Bons de consultation', icon: Activity, action: () => navigate('/medical') },
    { type: 'Menu', label: 'Paie & Primes', sub: 'Cycle financier', icon: Wallet, action: () => navigate('/payroll') },
    { type: 'Menu', label: 'Intelligence Hub', sub: 'Assistant Gemini', icon: Command, action: () => navigate('/ai-lab') },
  ].slice(0, 6);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-md flex items-start justify-center pt-[15vh] p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-200">
        <div className="flex items-center p-6 border-b border-slate-100 dark:border-slate-700">
          <Search className="text-blue-600 mr-4" size={24} />
          <input 
            ref={inputRef}
            className="flex-1 bg-transparent border-none outline-none text-xl font-bold text-slate-800 dark:text-white placeholder-slate-400"
            placeholder="Rechercher partout..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Escape' && onClose()}
          />
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400"><X size={20}/></button>
        </div>
        
        <div className="p-4 max-h-[400px] overflow-y-auto">
          {results.length > 0 ? (
            <div className="space-y-2">
              {results.map((res, i) => (
                <button 
                    key={i}
                    onClick={() => { res.action(); onClose(); }}
                    className="w-full flex items-center justify-between p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 group-hover:bg-white dark:group-hover:bg-slate-600 rounded-xl text-slate-500 dark:text-slate-400 group-hover:text-blue-600 transition-colors">
                        <res.icon size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{res.type}</p>
                      <p className="font-bold text-slate-800 dark:text-white">{res.label}</p>
                      <p className="text-xs text-slate-500">{res.sub}</p>
                    </div>
                  </div>
                  <ArrowRight className="text-slate-300 group-hover:text-blue-600 transition-all group-hover:translate-x-1" size={18} />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Raccourcis clavier</p>
                <div className="flex justify-center gap-6">
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-400"><kbd className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded shadow-sm mr-2">Cmd</kbd> + <kbd className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded shadow-sm">K</kbd> Recherche</div>
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-400"><kbd className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded shadow-sm mr-2">Esc</kbd> Fermer</div>
                </div>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-1"><Shield size={12}/> Accès Sécurisé MESP</div>
            <div className="flex items-center gap-1"><Command size={12}/> Powered by Genius IA</div>
        </div>
      </div>
    </div>
  );
};