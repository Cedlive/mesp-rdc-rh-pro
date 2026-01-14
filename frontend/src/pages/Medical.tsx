import React, { useState } from 'react';
import { 
    HeartPulse, ShieldCheck, Plus, Search, Download, Building, 
    UserCheck, Activity, Filter, ChevronRight, X, User,
    Stethoscope, FileText, Check, AlertCircle, Save
} from 'lucide-react';
import { MOCK_MEDICAL, MOCK_EMPLOYEES } from '../constants';
import { formatCurrency } from '../utils';

export const Medical = () => {
  const [vouchers, setVouchers] = useState(MOCK_MEDICAL);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBC, setNewBC] = useState({
      teacherId: '',
      facilityName: '',
      type: 'Consultation',
      amount: 25,
      currency: 'USD'
  });

  const handleCreateBC = (e: React.FormEvent) => {
      e.preventDefault();
      const teacher = MOCK_EMPLOYEES.find(e => e.id === newBC.teacherId);
      const voucher: any = {
          id: `BC-${Math.floor(1000 + Math.random() * 9000)}`,
          teacherName: teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Agent MESP',
          ...newBC,
          status: 'Validé',
          date: new Date().toLocaleDateString('fr-FR')
      };
      setVouchers([voucher, ...vouchers]);
      setIsModalOpen(false);
      window.dispatchEvent(new CustomEvent('app-alert', { 
          detail: { title: 'Bon Généré', message: 'Le Bon de Consultation a été émis et envoyé à l\'affilié.', type: 'success' } 
      }));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* MODAL NOUVEAU BON */}
      {isModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
              <div className="bg-white dark:bg-slate-800 rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 border border-slate-100 dark:border-slate-700">
                  <div className="px-10 py-8 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                      <div>
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Émission Bon de Soins</h3>
                          <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-widest">Génération de BC sécurisé MESP-Guard</p>
                      </div>
                      <button onClick={()=>setIsModalOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400"><X size={24}/></button>
                  </div>
                  <form onSubmit={handleCreateBC} className="p-10 space-y-6">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Agent / Affilié</label>
                          <select required className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white" value={newBC.teacherId} onChange={e=>setNewBC({...newBC, teacherId: e.target.value})}>
                              <option value="">Sélectionner un agent...</option>
                              {MOCK_EMPLOYEES.map(emp => <option key={emp.id} value={emp.id}>{emp.lastName} {emp.firstName}</option>)}
                          </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prestataire (Hôpital)</label>
                              <input required className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white" placeholder="Nom de l'hôpital" value={newBC.facilityName} onChange={e=>setNewBC({...newBC, facilityName: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type d'acte</label>
                              <select className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white" value={newBC.type} onChange={e=>setNewBC({...newBC, type: e.target.value})}>
                                  <option>Consultation</option>
                                  <option>Pharmacie</option>
                                  <option>Hospitalisation</option>
                                  <option>Laboratoire</option>
                              </select>
                          </div>
                      </div>
                      <div className="flex gap-4 pt-6">
                          <button type="button" onClick={()=>setIsModalOpen(false)} className="flex-1 py-5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-[1.5rem] font-black text-xs uppercase tracking-widest">Annuler</button>
                          <button type="submit" className="flex-1 py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                              <Save size={18}/> Valider & Émettre
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* HEADER SECTION */}
      <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-card border border-slate-50 dark:border-slate-700 flex flex-col xl:flex-row justify-between items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 dark:bg-emerald-900/10 rounded-full blur-[100px] opacity-50 translate-x-1/2 -translate-y-1/2"></div>
          <div className="flex items-center gap-8 relative z-10">
              <div className="p-6 bg-emerald-600 text-white rounded-[2rem] shadow-2xl shadow-emerald-600/40">
                  <HeartPulse size={48} />
              </div>
              <div>
                  <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Pôle Médical <span className="text-emerald-600">.</span></h1>
                  <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 max-w-md">Orchestration des soins et suivi sanitaire des affiliés MESP-RDC.</p>
              </div>
          </div>
          <button onClick={()=>setIsModalOpen(true)} className="relative z-10 bg-slate-900 dark:bg-emerald-600 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group">
              <Plus size={22} className="group-hover:rotate-90 transition-transform" /> Nouveau Bon (BC)
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-card border border-slate-50 dark:border-slate-700">
                  <div className="flex justify-between items-start mb-6">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl"><UserCheck size={24}/></div>
                      <span className="text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full border border-green-100">Live</span>
                  </div>
                  <h4 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">12.4k</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Agents Affiliés</p>
              </div>
              
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><ShieldCheck size={80}/></div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-8 flex items-center gap-2"><Activity size={14}/> Analytics</h4>
                  <div className="space-y-2">
                      <p className="text-3xl font-black font-mono tracking-tighter">1.8%</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed tracking-wider">Taux de sinistralité sectoriel.</p>
                  </div>
              </div>
          </div>

          <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-[3rem] shadow-card border border-slate-50 dark:border-slate-700 overflow-hidden">
              <div className="p-10 border-b border-slate-50 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center bg-slate-50/30 dark:bg-slate-900/30 gap-6">
                  <div>
                      <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Registre des Bons (BC)</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Historique numérique certifié</p>
                  </div>
                  <div className="relative w-full md:w-80">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm dark:text-white" placeholder="Chercher un agent ou bon..." />
                  </div>
              </div>
              
              <div className="overflow-x-auto">
                  <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-900/80 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b dark:border-slate-700">
                          <tr>
                              <th className="px-10 py-6">ID Bon</th>
                              <th className="px-6 py-6">Agent</th>
                              <th className="px-6 py-6">Hôpital</th>
                              <th className="px-6 py-6 text-center">Status</th>
                              <th className="px-10 py-6 text-right">Action</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                          {vouchers.map(bc => (
                              <tr key={bc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors group">
                                  <td className="px-10 py-6 font-mono text-sm font-black text-blue-600 tracking-tighter">#{bc.id}</td>
                                  <td className="px-6 py-6 font-black text-slate-800 dark:text-white text-xs uppercase">{bc.teacherName}</td>
                                  <td className="px-6 py-6 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase">{bc.facilityName}</td>
                                  <td className="px-6 py-6 text-center">
                                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${bc.status === 'Validé' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                          {bc.status}
                                      </span>
                                  </td>
                                  <td className="px-10 py-6 text-right">
                                      <button className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Download size={18}/></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
    </div>
  );
};