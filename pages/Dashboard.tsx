
import React, { useState, useEffect } from 'react';
import { MOCK_TASKS, MOCK_EMPLOYEES } from '../constants';
import { Employee } from '../types';
import { 
  Play, Pause, Clock, Activity, TrendingUp, Award, 
  Users, HeartPulse, Wallet, AlertTriangle, ArrowRight,
  CheckCircle2, Circle, MapPin, Sparkles, ChevronRight,
  ShieldCheck, Zap, Plane, Truck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

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

  const attendanceData = [
    { name: 'Lun', presents: 850, missions: 45 },
    { name: 'Mar', presents: 920, missions: 58 },
    { name: 'Mer', presents: 880, missions: 62 },
    { name: 'Jeu', presents: 1100, missions: 34 },
    { name: 'Ven', presents: 950, missions: 46 },
  ];

  const statusData = [
    { name: 'Actifs', value: 85, color: '#10b981' },
    { name: 'Congés', value: 10, color: '#f59e0b' },
    { name: 'Missions', value: 5, color: '#3b82f6' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* HEADER STRATÉGIQUE */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-10 text-white border border-white/5 shadow-premium">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <Zap size={400} className="text-blue-500 transform translate-x-32 -translate-y-20" />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <span className="px-4 py-1 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Système de Commandement v5.0</span>
                    <span className="flex items-center gap-1 text-[10px] text-green-400 font-bold uppercase"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> Nucleus Cloud Active</span>
                </div>
                <h1 className="text-5xl font-black tracking-tighter leading-tight">
                    Bonjour, <span className="text-blue-500">{currentUser?.firstName}</span> 👋
                </h1>
                <p className="text-slate-400 font-medium text-lg mt-2">Bienvenue sur l'infrastructure centrale de la MESP-RDC.</p>
            </div>
            <div className="flex gap-4">
                <div className="bg-white/5 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 flex items-center gap-5">
                    <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400"><Clock size={24}/></div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Heure Système</p>
                        <p className="text-xl font-mono font-black">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 flex items-center gap-5">
                    <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400"><Users size={24}/></div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Agents Live</p>
                        <p className="text-xl font-mono font-black">1,124</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* KPI GRID ULTRA-MODERNE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
              { label: 'Effectif Global', val: '1,240', sub: '+14% / mois', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              { label: 'Déploiements', val: '158', sub: 'Stations SEP', icon: Plane, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
              { label: 'Flotte MESP', val: '42', sub: 'Toyota V8 SEP', icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
              { label: 'Alertes Critiques', val: '02', sub: 'Action Immédiate', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' }
          ].map((kpi, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-card border border-slate-50 dark:border-slate-800 hover:-translate-y-2 transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-6">
                      <div className={`p-4 rounded-2xl ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform shadow-sm`}>
                          <kpi.icon size={28} />
                      </div>
                      <div className="bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 px-2 py-1 rounded-lg text-[10px] font-black tracking-widest">ACTIVE</div>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{kpi.val}</h3>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">{kpi.label}</p>
                  <div className="mt-6 flex items-center gap-2">
                      <TrendingUp size={14} className="text-green-500" />
                      <span className="text-[10px] font-bold text-slate-500">{kpi.sub}</span>
                  </div>
              </div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CENTRE DE POINTAGE BIOMÉTRIQUE */}
          <div className="lg:col-span-4 space-y-8">
              <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-premium relative overflow-hidden flex flex-col items-center justify-center min-h-[500px] border border-blue-500/20">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none"></div>
                  <div className="absolute top-10 left-10"><ShieldCheck size={24} className="text-blue-500 opacity-50"/></div>
                  
                  <h3 className="text-[10px] font-black uppercase text-blue-400 tracking-[0.5em] mb-12 animate-pulse">Scan Biométrique Actif</h3>
                  
                  <div className="relative mb-12">
                      <div className="absolute inset-0 bg-blue-500 rounded-full blur-[80px] opacity-20 animate-pulse"></div>
                      <div className="text-7xl font-mono font-black tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                          {formatTime(timer)}
                      </div>
                  </div>

                  <div className="w-full space-y-4">
                      <button 
                        onClick={() => setIsRunning(!isRunning)}
                        className={`w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all active:scale-95 flex items-center justify-center gap-4 ${
                            isRunning 
                            ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:bg-red-600' 
                            : 'bg-blue-600 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:bg-blue-700'
                        }`}
                      >
                          {isRunning ? <><Pause size={24} fill="currentColor"/> Terminer Service</> : <><Play size={24} fill="currentColor"/> Pointer Arrivée</>}
                      </button>
                      <button className="w-full py-5 bg-white/5 border border-white/10 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 transition-all">Pause Déjeuner</button>
                  </div>

                  <div className="mt-12 flex items-center gap-8 text-[9px] font-black uppercase tracking-widest text-slate-500">
                      <div className="flex items-center gap-2"><MapPin size={12} className="text-blue-500"/> SEP Gombe</div>
                      <div className="flex items-center gap-2"><CheckCircle2 size={12} className="text-green-500"/> Certifié</div>
                  </div>
              </div>

              {/* STATUT FLOTTE MOBILE */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-card border border-slate-50 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-6">
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Véhicules de Mission</h4>
                      <Link to="/settings" className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl hover:text-blue-600 transition-colors"><ChevronRight size={18}/></Link>
                  </div>
                  <div className="space-y-4">
                      {[
                          { plate: '0432BG/01', model: 'Toyota Land Cruiser', status: 'En mouvement', color: 'text-green-500' },
                          { plate: '0488BG/01', model: 'Toyota Land Cruiser', status: 'Stationné', color: 'text-slate-400' }
                      ].map((v, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-blue-100 transition-all">
                              <div className="flex items-center gap-4">
                                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl shadow-sm text-blue-600"><Truck size={18}/></div>
                                  <div>
                                      <p className="text-xs font-black dark:text-white uppercase">{v.plate}</p>
                                      <p className="text-[9px] text-slate-400 font-bold uppercase">{v.model}</p>
                                  </div>
                              </div>
                              <span className={`text-[9px] font-black uppercase ${v.color}`}>{v.status}</span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* FLUX ANALYTIQUE CENTRAL */}
          <div className="lg:col-span-8 space-y-8">
              <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] shadow-premium border border-slate-50 dark:border-slate-800 flex flex-col h-[400px]">
                  <div className="flex justify-between items-center mb-10">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Statistiques de Présence</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Flux global des agents sur l'ensemble du territoire</p>
                      </div>
                      <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
                          <button className="px-4 py-2 bg-white dark:bg-slate-800 text-[10px] font-black uppercase text-blue-600 rounded-lg shadow-sm">Semaine</button>
                          <button className="px-4 py-2 text-[10px] font-black uppercase text-slate-500">Mois</button>
                      </div>
                  </div>
                  <div className="flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={attendanceData}>
                              <defs>
                                  <linearGradient id="colorP" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                  </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                              <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 30px rgba(0,0,0,0.1)'}} />
                              <Area type="monotone" dataKey="presents" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorP)" />
                          </AreaChart>
                      </ResponsiveContainer>
                  </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] shadow-premium border border-slate-50 dark:border-slate-800 flex flex-col min-h-[300px]">
                  <div className="flex justify-between items-center mb-10">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Demandes à Valider</h3>
                      <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-2">Tout voir <ChevronRight size={14}/></button>
                  </div>
                  <div className="space-y-4">
                      {MOCK_TASKS.map((task, i) => (
                          <div key={task.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-transparent hover:border-blue-100 transition-all cursor-pointer group">
                              <div className="flex items-center gap-6">
                                  <div className={`p-4 rounded-2xl ${task.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm'}`}>
                                      {task.status === 'Completed' ? <CheckCircle2 size={22}/> : <Circle size={22}/>}
                                  </div>
                                  <div>
                                      <h4 className={`text-base font-black ${task.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-200'}`}>{task.title}</h4>
                                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{task.type} • Priorité Haute</p>
                                  </div>
                              </div>
                              <button className="p-4 opacity-0 group-hover:opacity-100 bg-blue-600 text-white rounded-2xl shadow-xl transition-all translate-x-4 group-hover:translate-x-0"><ArrowRight size={18}/></button>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
