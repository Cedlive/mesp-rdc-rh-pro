
import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const customLogo = localStorage.getItem('mesp_splash_logo');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 150);

    const finishTimeout = setTimeout(() => {
        setProgress(100);
        setTimeout(onFinish, 800);
    }, 3500);

    return () => {
      clearInterval(timer);
      clearTimeout(finishTimeout);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-slate-900 z-[100] flex flex-col items-center justify-center text-white overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600 rounded-full blur-[150px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600 rounded-full blur-[150px] opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>

        <div className="relative z-10 flex flex-col items-center max-w-md w-full px-8 text-center">
            <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center border border-white/20 mb-8 shadow-2xl animate-in fade-in zoom-in duration-1000 overflow-hidden">
                {customLogo ? (
                    <img src={customLogo} className="w-full h-full object-contain p-4" alt="MESP Logo" />
                ) : (
                    <span className="text-5xl font-extrabold text-white">M</span>
                )}
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-2 animate-in slide-in-from-bottom-5 duration-1000 delay-200">
                MESP<span className="text-blue-500">.</span>RDC
            </h1>
            <p className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-12 animate-in slide-in-from-bottom-5 duration-1000 delay-300">
                Enterprise Resource Planning
            </p>

            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden relative">
                <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            
            <div className="w-full flex justify-between items-center mt-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>Synchronisation Nucleus...</span>
                <span>{Math.round(progress)}%</span>
            </div>
        </div>

        <div className="absolute bottom-8 text-center">
            <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] font-black">Powered by MESP Cloud Engine</p>
        </div>
    </div>
  );
};
