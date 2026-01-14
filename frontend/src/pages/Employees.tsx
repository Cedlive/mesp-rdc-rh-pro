
import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_EMPLOYEES, MOCK_DEPARTMENTS } from '../constants';
import { Employee } from '../types';
import { 
    Search, Plus, User, Briefcase, ShieldCheck, 
    X, Edit2, Save, ArrowUpDown, Trash2, Power, 
    CreditCard, HeartPulse, MapPin, CheckCircle,
    LayoutGrid, Map as MapIcon, Users, Signal,
    CheckCircle2, Clock, Plane, Ban, Palmtree,
    Filter, Download, ChevronDown, Trash, RotateCcw,
    Eye, MoreVertical, ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LiveMap } from '../components/LiveMap';

export const Employees = () => {
  const { currentUser } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Employee>>({
      firstName: '', lastName: '', role: 'Agent', department: 'RH', status: 'Actif', joinDate: new Date().toISOString().split('T')[0]
  });

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('Tous');

  const isAdmin = currentUser?.role === 'Administrateur' || currentUser?.role === 'Directeur RH';

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => 
      (`${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (deptFilter === 'Tous' || emp.department === deptFilter)
    );
  }, [employees, searchTerm, deptFilter]);

  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      if (isEditMode && selectedEmployee) {
          setEmployees(prev => prev.map(emp => emp.id === selectedEmployee.id ? { ...emp, ...formData } as Employee : emp));
          window.dispatchEvent(new CustomEvent('app-alert', { detail: { title: 'Agent Mis à Jour', message: 'Les modifications ont été enregistrées avec succès.', type: 'success' } }));
      } else {
          const newAgent = { ...formData, id: `E${Date.now()}`, avatar: `https://ui-avatars.com/api/?name=${formData.lastName}+${formData.firstName}` } as Employee;
          setEmployees([newAgent, ...employees]);
          window.dispatchEvent(new CustomEvent('app-alert', { detail: { title: 'Nouvel Agent Créé', message: `${newAgent.lastName} a été ajouté au registre.`, type: 'success' } }));
      }
      setIsAddModalOpen(false);
      setIsEditMode(false);
  };

  const handleDelete = (id: string) => {
      if (confirm("Êtes-vous certain de vouloir révoquer cet accès ? Cette action est tracée dans l'audit système.")) {
          setEmployees(prev => prev.filter(e => e.id !== id));
          window.dispatchEvent(new CustomEvent('app-alert', { detail: { title: 'Accès Révoqué', message: "L'agent a été retiré de la liste active.", type: 'warning' } }));
      }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Actif': return { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', border: 'border-green-100 dark:border-green-800' };
      case 'Mission': return { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-100 dark:border-indigo-800' };
      default: return { bg: 'bg-slate-50 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-700' };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* MODAL FORMULAIRE AGENT */}
      {isAddModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
              <div className="bg-white dark:bg-slate-800 rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100 dark:border-slate-700 animate-in zoom-in-95">
                  <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                      <div>
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{isEditMode ? 'Modifier Fiche Agent' : 'Enrôlement Nouvel Agent'}</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Saisie certifiée pour l'infrastructure MESP</p>
                      </div>
                      <button onClick={()=>{setIsAddModalOpen(false); setIsEditMode(false);}} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400"><X size={24}/></button>
                  </div>
                  <form onSubmit={handleSave} className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
                      <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prénom</label>
                              <input required className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" value={formData.firstName} onChange={e=>setFormData({...formData, firstName: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom</label>
                              <input required className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" value={formData.lastName} onChange={e=>setFormData({...formData, lastName: e.target.value})} />
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service / Département</label>
                              <select className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" value={formData.department} onChange={e=>setFormData({...formData, department: e.target.value})}>
                                  {MOCK_DEPARTMENTS.map(d => <option key={d.id} value={d.title}>{d.title}</option>)}
                              </select>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fonction Officielle</label>
                              <input required className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" placeholder="ex: Analyste RH" value={formData.role} onChange={e=>setFormData({...formData, role: e.target.value})} />
                          </div>
                      </div>
                      <div className="flex gap-4 pt-6">
                          <button type="button" onClick={()=>{setIsAddModalOpen(false); setIsEditMode(false);}} className="flex-1 py-5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-[1.5rem] font-black text-xs uppercase tracking-widest">Annuler Action</button>
                          <button type="submit" className="flex-1 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                              <Save size={18}/> {isEditMode ? 'Enregistrer Modification' : 'Confirmer Enrôlement'}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* HEADER PAGE */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-8 bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-card border border-slate-50 dark:border-slate-700">
          <div className="flex items-center gap-8 shrink-0">
              <div className="p-5 bg-blue-600 text-white rounded-[2rem] shadow-2xl shadow-blue-500/40">
                  <Users size={32} />
              </div>
              <div>
                  <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter leading-none">Annuaire Agents</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Contrôle des effectifs : {filteredEmployees.length} agents trouvés.</p>
              </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center w-full justify-end">
              <div className="relative group flex-1 md:max-w-xs">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none text-sm font-bold focus:ring-2 focus:ring-blue-500 shadow-inner dark:text-white" placeholder="Chercher un agent..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>

              <select className="bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-6 py-4 text-xs font-bold focus:ring-2 focus:ring-blue-500 dark:text-white cursor-pointer shadow-inner" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
                  <option value="Tous">Tous les Services</option>
                  {MOCK_DEPARTMENTS.map(d => <option key={d.id} value={d.title}>{d.title}</option>)}
              </select>

              <div className="bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl flex shadow-inner border border-slate-200 dark:border-slate-800">
                  <button onClick={() => setViewMode('list')} className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-lg text-blue-600' : 'text-slate-500'}`}><LayoutGrid size={22} /></button>
                  <button onClick={() => setViewMode('map')} className={`p-3 rounded-xl transition-all ${viewMode === 'map' ? 'bg-white dark:bg-slate-800 shadow-lg text-blue-600' : 'text-slate-500'}`}><MapIcon size={22} /></button>
              </div>

              {isAdmin && (
                <button 
                    onClick={() => { setIsEditMode(false); setFormData({firstName:'', lastName:'', role:'Agent', department:'RH', status:'Actif'}); setIsAddModalOpen(true); }}
                    className="bg-slate-900 dark:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
                >
                    <Plus size={22} /> Nouveau
                </button>
              )}
          </div>
      </div>

      {viewMode === 'map' ? (
          <div className="h-[750px] animate-in zoom-in-95 duration-500">
              <LiveMap employees={filteredEmployees} currentUser={currentUser} />
          </div>
      ) : (
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-card border border-slate-50 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                  <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b dark:border-slate-700">
                          <tr>
                            <th className="px-10 py-8">Agent MESP</th>
                            <th className="px-6 py-8">Direction</th>
                            <th className="px-6 py-8">Rôle</th>
                            <th className="px-6 py-8">Statut</th>
                            <th className="px-10 py-8 text-right">Actions Système</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                          {filteredEmployees.map(emp => {
                              const statusStyle = getStatusStyles(emp.status);
                              return (
                                <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-6">
                                            <div className="relative">
                                                <img src={emp.avatar} className="w-14 h-14 rounded-2xl object-cover shadow-lg border-2 border-white dark:border-slate-700 group-hover:scale-105 transition-transform" />
                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${emp.status === 'Actif' ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight">{emp.lastName} {emp.firstName}</div>
                                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 block">ID: {emp.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{emp.department}</td>
                                    <td className="px-6 py-6 text-[10px] font-black text-blue-600 uppercase tracking-widest">{emp.role}</td>
                                    <td className="px-6 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border shadow-sm ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>{emp.status}</span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-4">
                                            <button 
                                                onClick={() => { setFormData(emp); setSelectedEmployee(emp); setIsEditMode(true); setIsAddModalOpen(true); }}
                                                className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                            >
                                                <Edit2 size={18}/>
                                            </button>
                                            {isAdmin && (
                                                <button 
                                                    onClick={() => handleDelete(emp.id)}
                                                    className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Trash2 size={18}/>
                                                </button>
                                            )}
                                            <button className="p-3 bg-slate-50 dark:bg-slate-700 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"><MoreVertical size={18}/></button>
                                        </div>
                                    </td>
                                </tr>
                              );
                          })}
                      </tbody>
                  </table>
                  {filteredEmployees.length === 0 && (
                      <div className="p-20 text-center flex flex-col items-center justify-center opacity-40">
                          <Users size={80} className="text-slate-200 mb-6" />
                          <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">Aucun résultat trouvé</h3>
                          <p className="text-sm font-medium mt-2">Ajustez vos filtres de recherche.</p>
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};
