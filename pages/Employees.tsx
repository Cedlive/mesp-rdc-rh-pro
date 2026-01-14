
import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_EMPLOYEES, MOCK_DEPARTMENTS } from '../constants';
import { Employee } from '../types';
import { 
    Search, Plus, User, Edit2, Save, Trash2, 
    LayoutGrid, Map as MapIcon, Users, Download, 
    X, CheckCircle2, Filter, ArrowUpDown, ChevronRight,
    Briefcase, Building2, Smartphone, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LiveMap } from '../components/LiveMap';

export const Employees = () => {
  const { currentUser } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('Tous');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Employee>>({
      firstName: '', lastName: '', role: '', department: 'RH', status: 'Actif', email: '', phone: '', insuranceNumber: ''
  });

  const isAdmin = currentUser?.role === 'Administrateur' || currentUser?.role === 'Directeur RH';

  const filtered = useMemo(() => {
    return employees.filter(emp => 
      (`${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
       emp.insuranceNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (deptFilter === 'Tous' || emp.department === deptFilter) &&
      (statusFilter === 'Tous' || emp.status === statusFilter)
    );
  }, [employees, searchTerm, deptFilter, statusFilter]);

  const handleOpenModal = (emp: Employee | null = null) => {
      if (emp) {
          setEditingEmployee(emp);
          setFormData(emp);
      } else {
          setEditingEmployee(null);
          setFormData({ firstName: '', lastName: '', role: '', department: 'RH', status: 'Actif', email: '', phone: '', insuranceNumber: `MESP-${new Date().getFullYear()}-${Math.floor(100+Math.random()*900)}` });
      }
      setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingEmployee) {
          setEmployees(prev => prev.map(e => e.id === editingEmployee.id ? { ...e, ...formData } as Employee : e));
          window.dispatchEvent(new CustomEvent('app-alert', { detail: { title: 'Agent mis à jour', message: 'La fiche a été modifiée avec succès.', type: 'success' } }));
      } else {
          const newEmp = { ...formData, id: `E${Date.now()}`, avatar: `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=random` } as Employee;
          setEmployees([newEmp, ...employees]);
          window.dispatchEvent(new CustomEvent('app-alert', { detail: { title: 'Nouvel Agent', message: `${newEmp.lastName} a été enrôlé.`, type: 'success' } }));
      }
      setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
      if (window.confirm("Action critique : Voulez-vous révoquer l'accès de cet agent ?")) {
          setEmployees(prev => prev.filter(e => e.id !== id));
          window.dispatchEvent(new CustomEvent('app-alert', { detail: { title: 'Accès Révoqué', message: "L'agent a été retiré du système actif.", type: 'warning' } }));
      }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Actif': return 'bg-green-50 text-green-700 border-green-100';
      case 'Mission': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'En Congé': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Modal Fiche Agent (Add/Edit) */}
      {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
              <div className="bg-white dark:bg-slate-800 rounded-[3rem] w-full max-w-2xl shadow-premium overflow-hidden animate-in zoom-in-95">
                  <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{editingEmployee ? 'Modifier l\'Agent' : 'Enrôlement Nouvel Agent'}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Infrastructure MESP-RDC Registry</p>
                      </div>
                      <button onClick={()=>setIsModalOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"><X size={24}/></button>
                  </div>
                  <form onSubmit={handleSave} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                      <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prénom</label>
                              <input required className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" value={formData.firstName} onChange={e=>setFormData({...formData, firstName: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom de famille</label>
                              <input required className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" value={formData.lastName} onChange={e=>setFormData({...formData, lastName: e.target.value})} />
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Matricule MESP</label>
                              <input required className="w-full bg-slate-100 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold text-slate-500 cursor-not-allowed" value={formData.insuranceNumber} readOnly />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Direction / Service</label>
                              <select className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" value={formData.department} onChange={e=>setFormData({...formData, department: e.target.value})}>
                                  {MOCK_DEPARTMENTS.map(d => <option key={d.id} value={d.title}>{d.title}</option>)}
                              </select>
                          </div>
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Titre du Poste</label>
                          <input required className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" placeholder="ex: Analyste HR" value={formData.role} onChange={e=>setFormData({...formData, role: e.target.value})} />
                      </div>
                      <div className="flex gap-4 pt-4 border-t border-slate-50 dark:border-slate-700">
                          <button type="button" onClick={()=>setIsModalOpen(false)} className="flex-1 py-5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest">Annuler</button>
                          <button type="submit" className="flex-1 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                              <Save size={18}/> Enregistrer l'Agent
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Header Register */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-8 bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-card border border-slate-50 dark:border-slate-700">
          <div className="flex items-center gap-6">
              <div className="p-5 bg-blue-600 text-white rounded-[2rem] shadow-2xl shadow-blue-500/40 transform rotate-3">
                  <Users size={32} />
              </div>
              <div>
                  <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter leading-none">Annuaire Agents</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Contrôle des effectifs certifiés : {filtered.length} agents trouvés.</p>
              </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-end w-full lg:w-auto">
              <div className="relative flex-1 md:w-80 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Matricule ou nom d'agent..." className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none text-sm font-bold shadow-inner focus:ring-2 focus:ring-blue-500 transition-all dark:text-white" />
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
                <button onClick={()=>handleOpenModal()} className="bg-slate-900 dark:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                    <Plus size={22}/> Nouveau
                </button>
              )}
          </div>
      </div>

      {viewMode === 'map' ? (
          <div className="h-[750px] animate-in zoom-in-95 duration-500">
              <LiveMap employees={filtered} currentUser={currentUser} />
          </div>
      ) : (
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-card border border-slate-50 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b dark:border-slate-700">
                          <tr>
                              <th className="px-10 py-8">Agent MESP</th>
                              <th className="px-6 py-8">Direction</th>
                              <th className="px-6 py-8">Rôle Officiel</th>
                              <th className="px-6 py-8">Status</th>
                              <th className="px-10 py-8 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                          {filtered.map(emp => (
                              <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all group">
                                  <td className="px-10 py-6">
                                      <div className="flex items-center gap-6">
                                          <div className="relative">
                                            <img src={emp.avatar} className="w-14 h-14 rounded-2xl object-cover shadow-lg border-2 border-white dark:border-slate-700 group-hover:scale-105 transition-all" />
                                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${emp.status === 'Actif' ? 'bg-green-500 shadow-green-500/20' : 'bg-slate-400'} shadow-md`}></div>
                                          </div>
                                          <div>
                                              <p className="font-black text-slate-900 dark:text-white text-base leading-none mb-2 transition-colors uppercase tracking-tight group-hover:text-blue-600">{emp.lastName} {emp.firstName}</p>
                                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">{emp.insuranceNumber}</span>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="px-6 py-6 text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{emp.department}</td>
                                  <td className="px-6 py-6 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase group-hover:underline cursor-pointer">{emp.role}</td>
                                  <td className="px-6 py-6">
                                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${getStatusStyles(emp.status)}`}>{emp.status}</span>
                                  </td>
                                  <td className="px-10 py-6 text-right">
                                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-4">
                                          <button onClick={()=>handleOpenModal(emp)} className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Edit2 size={18}/></button>
                                          {isAdmin && (
                                              <button onClick={()=>handleDelete(emp.id)} className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"><Trash2 size={18}/></button>
                                          )}
                                          <button className="p-3 bg-slate-50 dark:bg-slate-700 text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all shadow-sm"><ChevronRight size={18}/></button>
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                  {filtered.length === 0 && (
                      <div className="p-20 text-center flex flex-col items-center justify-center opacity-30">
                          <Users size={80} className="text-slate-300 mb-6" />
                          <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">Aucun agent répertorié</h3>
                          <p className="text-sm font-medium mt-2">Ajustez vos filtres ou effectuez une nouvelle recherche.</p>
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};
