import React, { useState, useEffect } from 'react';
import { MOCK_TASKS, MOCK_ANNOUNCEMENTS, MOCK_EMPLOYEES, MOCK_DEPARTMENTS } from '../constants';
import { Announcement, Employee } from '../types';
import { 
  Play, Pause, Clock, Sparkles, Activity, ChevronRight,
  MapPin, Award, CheckCircle2, Circle, ArrowRight,
  ShieldCheck, HeartPulse, Wallet, FileCheck, TrendingUp,
  AlertTriangle, Users, Bell
} from 'lucide-react';
/* Fix: Ensure Link is correctly imported from react-router-dom */
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { useAuth } from '../context/AuthContext';

export const Dashboard: React.FC<{currentUser?: Employee | null}> = ({ currentUser }) => {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const statusData = [
    { name: 'Actifs', value: MOCK_EMPLOYEES.filter(e => e.status === 'Actif').length, color: '#10b981' },
    { name: 'Mission', value: MOCK_EMPLOYEES.filter(e => e.status === 'Mission').length, color: '#3b82f6' },
    { name: 'Alerte', value: 2, color: '#f43f5e' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* 1. TOP HEADER & AI STATUS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
              Système Nucleus <span className="text-blue-600">MESP</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">Bonjour {currentUser?.firstName}, toutes les stations SEP sont opérationnelles.</p>
        </div>
        <div className="flex gap-3 bg-white dark:bg-slate-800 p-2 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
                <Sparkles size={16} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Genius IA Active</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-600 rounded-2xl">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-[10px] font-black uppercase tracking-widest">Sync Cloud OK</span>
            </div>
        </div>
      </div>

      {/* 2. KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
              { label: 'Effectif Global', val: '1,240', sub: '+12 ce mois', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Bons Médicaux', val: '458', sub: 'En attente: 24', icon: HeartPulse, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Masse Salariale', val: '1.2M $', sub: 'Taux: 2500 FC', icon: Wallet, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'Alertes RH', val: '03', sub: 'Retards critiques', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' }
          ].map((kpi, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-card border border-slate-50 dark:border-slate-700 hover:shadow-xl transition-software group">
                  <div className="flex justify-between items-start mb-4">
                      <div className={`p-4 rounded-2xl ${kpi.bg} dark:bg-slate-900 ${kpi.color} group-hover:scale-110 transition-transform`}>
                          <kpi.icon size={24} />
                      </div>
                      <TrendingUp size={16} className="text-green-500" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">{kpi.val}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{kpi.label}</p>
                  <p className="text-[9px] font-bold text-slate-400 mt-4 border-t border-slate-50 dark:border-slate-700 pt-3">{kpi.sub}</p>
              </div>
          ))}
      </div>

      {/* 3. MAIN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Pointage & Contrôle Live */}
          <div className="lg:col-span-4 space-y-8">
              <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[450px]">
                  <div className="absolute top-0 right-0 p-8 opacity-5"><ShieldCheck size={200}/></div>
                  <h3 className="text-[10px] font-black uppercase text-blue-400 tracking-[0.4em] mb-12">Pointage Biométrique Live</h3>
                  <div className="text-7xl font-mono font-black tracking-tighter tabular-nums mb-12 drop-shadow-2xl">
                      {formatTime(timer)}
                  </div>
                  <button 
                    onClick={() => setIsRunning(!isRunning)}
                    className={`w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-software active:scale-95 flex items-center justify-center gap-4 ${
                        isRunning ? 'bg-red-500 shadow-red-500/20 hover:bg-red-600' : 'bg-blue-600 shadow-blue-500/20 hover:bg-blue-700'
                    }`}
                  >
                      {isRunning ? <><Pause size={20} fill="currentColor"/> Fin de Service</> : <><Play size={20} fill="currentColor"/> Démarrer Vacation</>}
                  </button>
                  <div className="mt-10 flex gap-10 opacity-40 text-[9px] font-black uppercase tracking-widest">
                      <div className="flex items-center gap-2"><MapPin size={12}/> SEP Kinshasa</div>
                      <div className="flex items-center gap-2"><Activity size={12}/> Secure</div>
                  </div>
              </div>
          </div>

          {/* Monitoring & Flux */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-premium border border-slate-50 dark:border-slate-700 flex flex-col">
              <div className="flex justify-between items-center mb-10">
                  <div>
                      <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Workflow d'Approbation</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Actions requises en attente de signature</p>
                  </div>
                  <button className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl hover:bg-slate-100 transition-all text-slate-400"><Bell size={20}/></button>
              </div>
              
              <div className="flex-1 space-y-4">
                  {MOCK_TASKS.map((task, i) => (
                      <div key={task.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-transparent hover:border-blue-100 dark:hover:border-blue-900 transition-all cursor-pointer group">
                          <div className="flex items-center gap-6">
                              <div className={`p-3 rounded-2xl ${task.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm'}`}>
                                  {task.status === 'Completed' ? <CheckCircle2 size={20}/> : <Circle size={20}/>}
                              </div>
                              <div>
                                  <h4 className={`text-sm font-black ${task.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-200'}`}>{task.title}</h4>
                                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{task.type} • Priorité Haute</p>
                              </div>
                          </div>
                          <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-all transform group-hover:translate-x-1" />
                      </div>
                  ))}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-700 flex justify-between items-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dernière mise à jour : il y a 2 minutes</p>
                  <Link to="/ai-lab" className="text-blue-600 text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">Consulter l'agent Genius <ChevronRight size={14}/></Link>
              </div>
          </div>
      </div>
    </div>
  );
};