
import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Bell, Search, Menu, Command, Wifi, WifiOff, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const { mode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCompact, setIsSidebarCompact] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  return (
    <div className={`min-h-screen ${mode === 'dark' ? 'dark bg-slate-950' : 'bg-[#f8fafc]'} font-sans text-slate-800 transition-colors`}>
      <Sidebar 
        currentUser={currentUser} 
        onLogout={logout} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        isCompact={isSidebarCompact}
        toggleCompact={() => setIsSidebarCompact(!isSidebarCompact)}
      />

      <div className={`flex flex-col min-h-screen transition-all duration-300 ${isSidebarCompact ? 'md:ml-20' : 'md:ml-64'}`}>
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-[100] px-4 md:px-10 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-6">
             <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
                <Menu size={24} />
             </button>
             <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 w-80 text-slate-400 group">
                <Search size={18} />
                <span className="text-sm font-medium">Spotlight Search...</span>
                <span className="ml-auto text-[10px] font-black bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600 shadow-sm flex items-center gap-1">
                    <Command size={10}/> K
                </span>
             </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500 animate-pulse'}`}></div>
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{isOnline ? 'Nucleus Sync Active' : 'Mode Hors Ligne'}</span>
            </div>

            <div className="flex items-center gap-4 pl-8 border-l border-slate-100 dark:border-slate-800">
               <div className="text-right hidden sm:block">
                   <p className="text-sm font-black text-slate-900 dark:text-white leading-none">{currentUser?.firstName}</p>
                   <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter mt-1">{currentUser?.role}</p>
               </div>
               <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xl border-2 border-white dark:border-slate-900">
                  {currentUser?.firstName[0]}
               </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
