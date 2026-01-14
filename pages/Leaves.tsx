
import React, { useState, useMemo } from 'react';
import { MOCK_LEAVES, MOCK_EMPLOYEES } from '../constants';
import { LeaveRequest } from '../types';
import { 
  Calendar, Clock, Palmtree, Stethoscope, Briefcase, 
  Plus, X, Save, CheckCircle2, UserX, ArrowUpDown,
  Filter, Timer, History, AlertCircle, Check, Ban,
  FileSignature, PieChart, Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Leaves = () => {
  const { currentUser } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>(MOCK_LEAVES as LeaveRequest[]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLeave, setNewLeave] = useState<Partial<LeaveRequest>>({
      type: 'Congé Annuel', startDate: '', endDate: '', reason: ''
  });

  const isAdmin = currentUser?.role === 'Administrateur' || currentUser?.role === 'Directeur RH';

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const request: LeaveRequest = {
        id: `LR-${Date.now()}`,
        employeeId: currentUser?.id || 'E001',
        type: newLeave.type as any,
        startDate: newLeave.startDate!,
        endDate: newLeave.endDate!,
        duration: 15,
        status: 'En attente',
        reason: newLeave.reason!
    };
    setLeaves([request, ...leaves]);
    setIsModalOpen(false);
    window.dispatchEvent(new CustomEvent('app-alert', { 
        detail: { title: 'Dossier Soumis', message: 'Votre demande est en cours d\'audit par le département RH.', type: 'info' } 
    }));
  };

  const handleUpdateStatus = (id: string, newStatus: 'Approuvé' | 'Rejeté') => {
      setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
      window.dispatchEvent(new CustomEvent('app-alert', { 
          detail: { title: `Action ${newStatus}`, message: `Le workflow a été mis à jour avec succès.`, type: newStatus === 'Approuvé' ? 'success' : 'warning' } 
      }));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* MODAL GOUVERNANCE ABSENCES */}
      {isModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
              <div className="bg-white dark:bg-slate-800 rounded-[3rem] w-full max-w-xl shadow-premium overflow-hidden border border-slate-100 dark:border-slate-700 animate-in zoom-in-95">
                  <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                      <div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Planifier Absence</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Audit interne MESP-RDC</p>
                      </div>
                      <button onClick={()=>setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400"><X size={24}/></button>
                  </div>
                  <form onSubmit={handleCreateRequest} className="p-10 space-y-6">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type d'acte d'absence</label>
                          <select className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all" value={newLeave.type} onChange={e=>setNewLeave({...newLeave, type: e.target.value as any})}>
                              <option>Congé Annuel</option>
                              <option>Maladie</option>
                              <option>Mission Officielle</option>
                              <option>Circonstance</option>
                              <option>Récupération</option>
                          </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date de départ</label>
                            <input type="date" className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" value={newLeave.startDate} onChange={e=>setNewLeave({...newLeave, startDate: e.target.value})} required />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date de retour</label>
                            <input type="date" className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" value={newLeave.endDate} onChange={e=>setNewLeave({...newLeave, endDate: e.target.value})} required />
                          </div>
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Justification / Motif détaillé</label>
                          <textarea className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none dark:text-white min-h-[120px] resize-none" placeholder="Veuillez expliciter votre demande pour l'audit RH..." value={newLeave.reason} onChange={e=>setNewLeave({...newLeave, reason: e.target.value})} required></textarea>
                      </div>
                      <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
                          <FileSignature size={20}/> Soumettre le Dossier
                      </button>
                  </form>
              </div>
          </div>
      )}

      {/* HEADER SECTION */}
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] shadow-premium border border-slate-50 dark:border-slate-800 flex flex-col xl:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-8">
            <div className="p-6 bg-slate-900 dark:bg-blue-600 text-white rounded-[2rem] shadow-2xl">
                <Calendar size={42} />
            </div>
            <div>
                <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none">Absences & Temps</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Pilotage centralisé des flux de présence et soldes de congés.</p>
            </div>
        </div>
        <button onClick={()=>setIsModalOpen(true)} className="bg-slate-900 dark:bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group">
            <Plus size={24} className="group-hover:rotate-90 transition-transform"/> Nouvelle Demande
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* STATS & QUOTAS SIDEBAR */}
          <div className="space-y-6">
              {[
                  { label: 'Congés Payés', val: '18.5 j', progress: 65, icon: Palmtree, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Maladie (Restant)', val: '05 j', progress: 20, icon: Stethoscope, color: 'text-rose-600', bg: 'bg-rose-50' },
                  { label: 'Récupérations', val: '02 j', progress: 40, icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50' }
              ].map((s, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-card border border-slate-50 dark:border-slate-800 group hover:shadow-xl transition-all">
                      <div className="flex justify-between items-center mb-6">
                        <div className={`p-4 rounded-2xl ${s.bg} dark:bg-slate-800 ${s.color} shadow-sm group-hover:scale-110 transition-transform`}><s.icon size={24}/></div>
                        <h4 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">{s.val}</h4>
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{s.label}</p>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className={`h-full ${s.color.replace('text', 'bg')} transition-all duration-1000`} style={{ width: `${s.progress}%` }}></div>
                      </div>
                  </div>
              ))}
              
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group h-[240px] flex flex-col justify-center">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><PieChart size={100}/></div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-6">Résumé Analytique</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">Votre taux de présence moyen sur les 30 derniers jours est de 98%.</p>
                  <button className="mt-8 text-blue-400 text-[9px] font-black uppercase tracking-widest hover:underline text-left">Générer rapport annuel</button>
              </div>
          </div>

          {/* REGISTRE PRINCIPAL */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-card border border-slate-50 dark:border-slate-800 overflow-hidden flex flex-col">
              <div className="p-10 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Registre des Demandes</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Audit et traçabilité des absences</p>
                  </div>
                  <div className="flex gap-4">
                      <button className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-blue-600 transition-all"><Filter size={20}/></button>
                      <button className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-blue-600 transition-all"><ArrowUpDown size={20}/></button>
                  </div>
              </div>
              
              <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left">
                      <thead className="bg-slate-50/50 dark:bg-slate-900/80 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100 dark:border-slate-800">
                          <tr>
                              <th className="px-10 py-8">Agent MESP</th>
                              <th className="px-6 py-8">Période</th>
                              <th className="px-6 py-8">Catégorie</th>
                              <th className="px-6 py-8 text-center">Audit Status</th>
                              <th className="px-10 py-8 text-right">Gouvernance</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                          {leaves.map(l => {
                              const emp = MOCK_EMPLOYEES.find(e => e.id === l.employeeId);
                              return (
                                <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-6">
                                            <div className="relative">
                                                <img src={emp?.avatar} className="w-14 h-14 rounded-2xl object-cover shadow-lg border-2 border-white dark:border-slate-700" alt="Avatar"/>
                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${emp?.status === 'Actif' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-tight group-hover:text-blue-600 transition-colors">{emp?.lastName} {emp?.firstName}</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Matricule: {emp?.insuranceNumber}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase leading-none">{new Date(l.startDate).toLocaleDateString('fr-FR', {day:'numeric', month:'short'})} <span className="text-slate-400">→</span> {new Date(l.endDate).toLocaleDateString('fr-FR', {day:'numeric', month:'short'})}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest">{l.duration} jours calibrés</p>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">{l.type}</span>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm ${
                                            l.status === 'Approuvé' ? 'bg-green-50 text-green-700 border-green-200' : 
                                            l.status === 'Rejeté' ? 'bg-red-50 text-red-700 border-red-200' : 
                                            'bg-amber-50 text-amber-700 border-amber-200'
                                        }`}>
                                            {l.status === 'En attente' && <Timer size={12} className="animate-spin" />}
                                            <span className="text-[10px] font-black uppercase tracking-widest">{l.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-4">
                                            {isAdmin && l.status === 'En attente' && (
                                                <>
                                                    <button onClick={()=>handleUpdateStatus(l.id, 'Approuvé')} className="p-3.5 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 shadow-xl transition-all hover:scale-110"><Check size={20}/></button>
                                                    <button onClick={()=>handleUpdateStatus(l.id, 'Rejeté')} className="p-3.5 bg-slate-900 text-white rounded-2xl hover:bg-red-600 shadow-xl transition-all hover:scale-110"><Ban size={20}/></button>
                                                </>
                                            )}
                                            <button className="p-3.5 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl hover:bg-slate-200 transition-all shadow-sm"><History size={20}/></button>
                                        </div>
                                    </td>
                                </tr>
                              );
                          })}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
    </div>
  );
};
