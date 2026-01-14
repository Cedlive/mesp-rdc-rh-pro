import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X, Bell } from 'lucide-react';

interface Alert {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

export const AlertManager: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const handleAlert = (e: any) => {
      const newAlert = { ...e.detail, id: Date.now() };
      setAlerts(prev => [newAlert, ...prev]);
      setTimeout(() => {
        setAlerts(prev => prev.filter(a => a.id !== newAlert.id));
      }, 5000);
    };

    window.addEventListener('app-alert', handleAlert);
    return () => window.removeEventListener('app-alert', handleAlert);
  }, []);

  return (
    <div className="fixed top-24 right-8 z-[200] flex flex-col gap-4 w-96 pointer-events-none">
      {alerts.map(alert => (
        <div key={alert.id} className="pointer-events-auto animate-in slide-in-from-right duration-300">
          <div className={`p-5 rounded-[2rem] border-2 shadow-2xl flex gap-4 bg-white dark:bg-slate-900 ${
            alert.type === 'success' ? 'border-green-500' : 
            alert.type === 'error' ? 'border-red-500' : 'border-blue-500'
          }`}>
            <div className={`p-3 rounded-2xl shrink-0 ${
              alert.type === 'success' ? 'bg-green-50 text-green-600' : 
              alert.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
            }`}>
              {alert.type === 'success' ? <CheckCircle2 size={24}/> : <AlertCircle size={24}/>}
            </div>
            <div className="flex-1">
              <h4 className="font-black text-sm uppercase text-slate-800 dark:text-white">{alert.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">{alert.message}</p>
            </div>
            <button onClick={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))} className="text-slate-300 hover:text-slate-500 transition-colors">
              <X size={16}/>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};