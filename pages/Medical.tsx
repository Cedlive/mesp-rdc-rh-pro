import React, { useState } from 'react';
import { 
    HeartPulse, ShieldCheck, 
    Plus, Search, Download, Building, 
    UserCheck, Activity, Filter, ChevronRight 
} from 'lucide-react';
import { MOCK_MEDICAL } from '../constants';
import { formatCurrency } from '../utils';

export const Medical = () => {
  const [vouchers] = useState(MOCK_MEDICAL);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header Premium Médical */}
      <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-card border border-slate-50 dark:border-slate-700 flex flex-col xl:flex-row justify-between items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 dark:bg-emerald-900/10 rounded-full blur-[100px] opacity-50 translate-x-1/2 -translate-y-1/2"></div>
          <div className="flex items-center gap-8 relative z-10">
              <div className="p-6 bg-emerald-600 text-white rounded-[2rem] shadow-2xl shadow-emerald-600/40 animate-in zoom-in duration-500">
                  <HeartPulse size={48} />
              </div>
              <div>
                  <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Pôle Médical <span className="text-emerald-600">.</span></h1>
                  <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 max-w-md">Orchestration des soins, bons de consultation et suivi sanitaire des affiliés MESP-RDC.</p>
              </div>
          </div>
          <div className="flex gap-4 relative z-10">
              {/* Bouton d'ajout iconique */}
              <button className="bg-slate-900 dark:bg-emerald-600 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group">
                  <div className="relative">
                      <HeartPulse size={22} className="group-hover:scale-110 transition-transform"/>
                      <div className="absolute -top-1 -right-1 bg-white text-emerald-600 rounded-full p-0.5 shadow-sm">
                        <Plus size={10} strokeWidth={4} />
                      </div>
                  </div>
                  Nouveau Bon (BC)
              </button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-card border border-slate-50 dark:border-slate-700 group hover:shadow-2xl transition-all">
                  <div className="flex justify-between items-start mb-6">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl group-hover:rotate-12 transition-transform"><UserCheck size={24}/></div>
                      <span className="text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full border border-green-100 dark:border-green-800">Actif Live</span>
                  </div>
                  <h4 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">12.4k</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Enseignants Affiliés</p>
              </div>
              
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><ShieldCheck size={80}/></div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-8 flex items-center gap-2"><Activity size={14}/> Master BI Analytics</h4>
                  <div className="space-y-2">
                      <p className="text-3xl font-black font-mono tracking-tighter">1.8%</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed tracking-wider">Taux de sinistralité sectoriel mensuel sous contrôle.</p>
                  </div>
                  <button className="mt-8 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all">Détails de consommation</button>
              </div>
          </div>

          <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-[3rem] shadow-card border border-slate-50 dark:border-slate-700 overflow-hidden">
              <div className="p-10 border-b border-slate-50 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center bg-slate-50/30 dark:bg-slate-900/30 gap-6">
                  <div>
                      <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Registre des Bons (BC)</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Archive numérique sécurisée MESP-Guard</p>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                      <div className="relative flex-1 md:w-80">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm dark:text-white transition-all" placeholder="Rechercher par ID, Agent ou Hôpital..." />
                      </div>
                      <button className="p-3.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl hover:bg-slate-200 transition-all"><Filter size={20}/></button>
                  </div>
              </div>
              
              <div className="overflow-x-auto">
                  <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-900/80 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b dark:border-slate-700">
                          <tr>
                              <th className="px-10 py-6">ID du Bon</th>
                              <th className="px-6 py-6">Agent Enseignant</th>
                              <th className="px-6 py-6">Établissement de Soins</th>
                              <th className="px-6 py-6">Type d'Acte</th>
                              <th className="px-6 py-6 text-center">Status</th>
                              <th className="px-10 py-6 text-right">Action</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                          {vouchers.map(bc => (
                              <tr key={bc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors group">
                                  <td className="px-10 py-6 font-mono text-sm font-black text-blue-600 tracking-tighter">#{bc.id}</td>
                                  <td className="px-6 py-6">
                                      <div className="font-black text-slate-800 dark:text-white text-xs uppercase">{bc.teacherName}</div>
                                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{bc.date}</div>
                                  </td>
                                  <td className="px-6 py-6">
                                      <div className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-300">
                                          <Building size={16} className="text-slate-300 dark:text-slate-600"/> 
                                          <span className="uppercase tracking-tight">{bc.facilityName}</span>
                                      </div>
                                  </td>
                                  <td className="px-6 py-6">
                                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest border dark:border-slate-600">{bc.type}</span>
                                  </td>
                                  <td className="px-6 py-6 text-center">
                                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${bc.status === 'Validé' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                          {bc.status}
                                      </span>
                                  </td>
                                  <td className="px-10 py-6 text-right">
                                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-4">
                                          <button className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Download size={18}/></button>
                                          <button className="p-3 bg-slate-50 dark:bg-slate-700 text-slate-400 rounded-xl hover:bg-slate-200 transition-all shadow-sm"><ChevronRight size={18}/></button>
                                      </div>
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