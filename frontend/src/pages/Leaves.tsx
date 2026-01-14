import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_LEAVES, MOCK_EMPLOYEES } from '../constants';
import { LeaveRequest } from '../types';
import LeaveService from '../services/leaveService';
import { 
  Clock, Calendar, CheckCircle, XCircle, ChevronRight, 
  ChevronLeft, Play, Square, Palmtree, Stethoscope, 
  Briefcase, X, Save, ArrowUpDown, LayoutGrid, 
  Columns, AlertCircle, Check, Ban, Timer, UserCheck, UserX
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Leaves = () => {
  const { currentUser } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [activeTab, setActiveTab] = useState<'requests' | 'calendar'>('requests');
  const [newLeave, setNewLeave] = useState({ type: 'Congé Annuel', startDate: '', endDate: '', reason: '' });
  
  // Time Clock State
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [timer, setTimer] = useState(0);

  const isAdmin = currentUser?.role === 'Administrateur' || currentUser?.role === 'Directeur RH' || currentUser?.role === 'Responsable RH';

  useEffect(() => {
      fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
      try {
          const res = await LeaveService.getAll();
          setLeaves(res.data);
      } catch (e) {
          console.error(e);
          setLeaves(MOCK_LEAVES as LeaveRequest[]);
      }
  };

  useEffect(() => {
    let interval: any;
    if (isClockedIn) {
      interval = setInterval(() => { setTimer((prev) => prev + 1); }, 1000);
    }
    return () => clearInterval(interval);
  }, [isClockedIn]);

  const handleSubmitLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeave.startDate || !newLeave.endDate) return;
    
    const start = new Date(newLeave.startDate);
    const end = new Date(newLeave.endDate);
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;

    try {
        const res = await LeaveService.create({
            type: newLeave.type as any,
            startDate: newLeave.startDate,
            endDate: newLeave.endDate,
            duration: duration > 0 ? duration : 1,
            reason: newLeave.reason,
            status: 'En attente'
        });
        setLeaves([res.data, ...leaves]);
        setIsRequestModalOpen(false);
        setNewLeave({ type: 'Congé Annuel', startDate: '', endDate: '', reason: '' });
        window.dispatchEvent(new CustomEvent('app-alert', { detail: { title: 'Succès', message: 'Demande soumise.', type: 'success' } }));
    } catch(e) { alert("Erreur soumission"); }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'Approuvé' | 'Rejeté') => {
      try {
          await LeaveService.updateStatus(id, newStatus);
          setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
          window.dispatchEvent(new CustomEvent('app-alert', { 
              detail: { 
                  title: `Demande ${newStatus}`, 
                  message: `La demande a été mise à jour avec succès.`, 
                  type: newStatus === 'Approuvé' ? 'success' : 'warning' 
              } 
          }));
      } catch (e) {
          alert("Erreur lors de la mise à jour du statut");
      }
  };

  const sortedLeaves = useMemo(() => {
    let base = [...leaves];
    if (sortOrder) {
        base.sort((a, b) => sortOrder === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status));
    }
    return base;
  }, [leaves, sortOrder]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const getStatusUI = (status: string) => {
      switch (status) {
          case 'Approuvé':
              return {
                  bg: 'bg-green-50 dark:bg-green-900/20',
                  text: 'text-green-700 dark:text-green-400',
                  border: 'border-green-200 dark:border-green-800',
                  icon: <CheckCircle size={14} />,
                  label: 'Validé'
              };
          case 'Rejeté':
              return {
                  bg: 'bg-red-50 dark:bg-red-900/20',
                  text: 'text-red-700 dark:text-red-400',
                  border: 'border-red-200 dark:border-red-800',
                  icon: <XCircle size={14} />,
                  label: 'Décliné'
              };
          case 'En attente':
          default:
              return {
                  bg: 'bg-amber-50 dark:bg-amber-900/20',
                  text: 'text-amber-700 dark:text-amber-400',
                  border: 'border-amber-200 dark:border-amber-800',
                  icon: <Timer size={14} className="animate-pulse" />,
                  label: 'En attente'
              };
      }
  };

  return (
    <div className="animate-fade-in space-y-8 relative pb-10">
      {/* Modal de demande */}
      {isRequestModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Nouvelle Absence</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-widest">Planification de votre temps de repos</p>
                    </div>
                    <button onClick={() => setIsRequestModalOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400"><X size={24}/></button>
                </div>
                <form onSubmit={handleSubmitLeave} className="p-10 space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Type d'absence</label>
                        <select className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white" value={newLeave.type} onChange={(e) => setNewLeave({...newLeave, type: e.target.value})}>
                            <option value="Congé Annuel">Congé Annuel</option>
                            <option value="Maladie">Maladie</option>
                            <option value="Mission">Mission</option>
                            <option value="Circonstance">Circonstance Familiale</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Du</label>
                            <input required type="date" className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" value={newLeave.startDate} onChange={(e) => setNewLeave({...newLeave, startDate: e.target.value})}/>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Au</label>
                            <input required type="date" className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" value={newLeave.endDate} onChange={(e) => setNewLeave({...newLeave, endDate: e.target.value})}/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Motif / Commentaire</label>
                        <textarea required className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none dark:text-white min-h-[120px] resize-none" placeholder="Décrivez votre besoin..." value={newLeave.reason} onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})}></textarea>
                    </div>
                    <div className="pt-4 flex gap-4">
                        <button type="button" onClick={() => setIsRequestModalOpen(false)} className="flex-1 py-5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Annuler</button>
                        <button type="submit" className="flex-1 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all">
                            Soumettre
                        </button>
                    </div>
                </form>
            </div>
         </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-card border border-slate-50 dark:border-slate-700">
        <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none">Absences & Temps</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Pilotage des présences et workflow des congés.</p>
        </div>
        <button onClick={() => setIsRequestModalOpen(true)} className="bg-slate-900 dark:bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 dark:shadow-blue-500/30 hover:scale-105 transition-all flex items-center gap-3">
            <Calendar size={22} /> Poser un Congé
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Widget Pointage Mobile-friendly */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-card border border-slate-50 dark:border-slate-700 p-10 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500"><Clock size={150} className="text-blue-600" /></div>
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-10">Pointage Live Biométrique</h3>
            <div className="text-7xl font-mono font-black text-slate-800 dark:text-white mb-10 tracking-tighter tabular-nums drop-shadow-sm">{formatTime(timer)}</div>
            <button 
                onClick={() => setIsClockedIn(!isClockedIn)} 
                className={`w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 ${
                    isClockedIn 
                    ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' 
                    : 'bg-green-600 text-white hover:bg-green-700 shadow-green-500/20'
                }`}
            >
                {isClockedIn ? <><Square size={20} fill="currentColor" /> Fin de Vacation</> : <><Play size={20} fill="currentColor" /> Prise de Poste</>}
            </button>
            <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-700 grid grid-cols-2 gap-4">
                <div className="text-left">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Début</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{isClockedIn ? '08:00' : '--:--'}</p>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Pause</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">00:45:00</p>
                </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
             <h3 className="font-black text-sm uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
               <Palmtree size={20} className="text-blue-400"/> Droits Acquis
             </h3>
             <div className="space-y-4">
                {[
                    { label: 'Congés Payés', val: '18.5 j', icon: Palmtree, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Maladie (Reste)', val: '5 j', icon: Stethoscope, color: 'text-red-400', bg: 'bg-red-500/10' },
                    { label: 'Récupération', val: '2 j', icon: Briefcase, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                ].map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-5 bg-white/5 rounded-[1.5rem] border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 ${s.bg} ${s.color} rounded-xl`}><s.icon size={18} /></div>
                            <span className="font-bold text-xs uppercase tracking-widest opacity-80">{s.label}</span>
                        </div>
                        <span className="text-xl font-black">{s.val}</span>
                    </div>
                ))}
             </div>
          </div>
        </div>

        {/* Workflow des Demandes */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-[3rem] shadow-card border border-slate-50 dark:border-slate-700 flex flex-col overflow-hidden min-h-[650px]">
          <div className="flex border-b border-slate-50 dark:border-slate-700 shrink-0">
             <button onClick={() => setActiveTab('requests')} className={`flex-1 py-6 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === 'requests' ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50/10' : 'text-slate-400 hover:text-slate-600'}`}>Registre des Demandes</button>
             <button onClick={() => setActiveTab('calendar')} className={`flex-1 py-6 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === 'calendar' ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50/10' : 'text-slate-400 hover:text-slate-600'}`}>Calendrier de l'Équipe</button>
          </div>

          <div className="flex-1 overflow-hidden p-8">
             {activeTab === 'requests' ? (
                <div className="h-full flex flex-col space-y-6">
                    <div className="flex justify-between items-center px-4 mb-2">
                        <h3 className="font-black text-slate-800 dark:text-white uppercase text-sm tracking-widest">Workflow d'approbation</h3>
                        <div className="flex gap-2">
                            <button onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')} className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 hover:text-blue-600 transition-colors shadow-sm"><ArrowUpDown size={18}/></button>
                        </div>
                    </div>

                    <div className="overflow-y-auto flex-1 custom-scrollbar space-y-4 pr-2">
                      {sortedLeaves.map((leave) => {
                         const employee = MOCK_EMPLOYEES.find(e => e.id === leave.employeeId);
                         const isCurrentUser = leave.employeeId === currentUser?.id || leave.employeeId === 'E001';
                         const statusUI = getStatusUI(leave.status);
                         
                         return (
                            <div key={leave.id} className="group relative bg-white dark:bg-slate-900 p-6 rounded-[2rem] border-2 border-slate-50 dark:border-slate-800 hover:border-blue-100 dark:hover:border-blue-900/30 transition-all duration-300">
                               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                  <div className="flex items-center gap-5">
                                      <div className="relative flex-shrink-0">
                                          <img src={employee?.avatar || 'https://ui-avatars.com/api/?name=User'} className="w-16 h-16 rounded-2xl object-cover shadow-lg border border-slate-100 dark:border-slate-800" alt="Avatar" />
                                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${employee?.status === 'Actif' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                      </div>
                                      <div>
                                          <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter leading-none mb-2">
                                              {isCurrentUser ? 'Vous (Agent)' : `${employee?.firstName} ${employee?.lastName}`}
                                          </h4>
                                          <div className="flex flex-wrap gap-2 items-center">
                                              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-[9px] font-black uppercase tracking-widest">{leave.type}</span>
                                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{leave.duration} jours</span>
                                          </div>
                                      </div>
                                  </div>
                                  
                                  <div className="flex-1 flex flex-col md:items-center">
                                      <div className="flex items-center gap-3 text-sm font-black text-slate-600 dark:text-slate-300 uppercase tracking-tighter">
                                          <span>{new Date(leave.startDate).toLocaleDateString('fr-FR', {day:'numeric', month:'short'})}</span>
                                          <ChevronRight size={14} className="text-slate-300" />
                                          <span>{new Date(leave.endDate).toLocaleDateString('fr-FR', {day:'numeric', month:'short', year:'numeric'})}</span>
                                      </div>
                                      <p className="text-[10px] text-slate-400 mt-2 italic font-medium leading-relaxed line-clamp-1 max-w-md">"{leave.reason}"</p>
                                  </div>

                                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                                      {/* BADGE DE STATUT VISUEL */}
                                      <div className={`px-5 py-2.5 rounded-2xl border flex items-center gap-2.5 shadow-sm transition-all ${statusUI.bg} ${statusUI.text} ${statusUI.border}`}>
                                          {statusUI.icon}
                                          <span className="text-[10px] font-black uppercase tracking-[0.1em]">{statusUI.label}</span>
                                      </div>

                                      {/* ACTIONS WORKFLOW POUR LES ADMINS SUR LES DEMANDES EN ATTENTE */}
                                      {isAdmin && leave.status === 'En attente' && (
                                         <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleUpdateStatus(leave.id, 'Approuvé')}
                                                className="p-3.5 bg-green-600 text-white rounded-2xl hover:bg-green-700 shadow-lg shadow-green-500/30 transition-all hover:scale-110 active:scale-90" 
                                                title="Valider la demande"
                                            >
                                               <UserCheck size={20} />
                                            </button>
                                            <button 
                                                onClick={() => handleUpdateStatus(leave.id, 'Rejeté')}
                                                className="p-3.5 bg-slate-900 text-white rounded-2xl hover:bg-red-600 shadow-lg transition-all hover:scale-110 active:scale-90" 
                                                title="Rejeter la demande"
                                            >
                                               <UserX size={20} />
                                            </button>
                                         </div>
                                      )}
                                  </div>
                               </div>
                               <div className="absolute top-2 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">ID: {leave.id}</span>
                               </div>
                            </div>
                         );
                      })}
                    </div>
                </div>
             ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-slate-50/50 dark:bg-slate-900/30 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <Calendar size={40} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter mb-4">Vue Calendrier Synchrone</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm leading-relaxed font-medium">L'intégration du calendrier d'équipe arrive bientôt pour une meilleure visualisation des chevauchements.</p>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};