import React, { useState, useMemo } from 'react';
import { MOCK_ROLES } from '../constants';
import { Role, ModulePermission } from '../types';
import { Shield, Lock, Users, Check, Save, Plus, AlertCircle, Edit, Trash2, X, ArrowUpDown, ShieldCheck, ShieldAlert } from 'lucide-react';

export const Roles = () => {
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
  const [selectedRole, setSelectedRole] = useState<Role>(MOCK_ROLES[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc'|'desc' }>({ key: 'name', direction: 'asc' });

  // Liste complète des modules applicatifs
  const modules = ['Employees', 'Payroll', 'Medical', 'Recruitment', 'Settings', 'Analytics', 'Communication'];

  const sortedRoles = useMemo(() => [...roles].sort((a, b) => sortConfig.direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)), [roles, sortConfig]);

  const getPermission = (role: Role, module: string): ModulePermission => 
    role.permissions.find(p => p.module === module) || 
    { module, canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false };

  const handlePermissionChange = (module: string, field: keyof Omit<ModulePermission, 'module'>) => {
    if (selectedRole.isSystem && selectedRole.id === 'admin') return;
    
    const updatedPerms = [...selectedRole.permissions];
    const idx = updatedPerms.findIndex(p => p.module === module);
    
    if(idx >= 0) {
        updatedPerms[idx] = { ...updatedPerms[idx], [field]: !updatedPerms[idx][field] };
    } else {
        const newPerm: ModulePermission = { 
            module, 
            canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false,
            [field]: true 
        };
        updatedPerms.push(newPerm);
    }
    
    const updated = { ...selectedRole, permissions: updatedPerms };
    setSelectedRole(updated);
    setRoles(roles.map(r => r.id === selectedRole.id ? updated : r));
  };

  const handleAddRole = (e: React.FormEvent) => {
      e.preventDefault();
      const nr: Role = { id: `role_${Date.now()}`, name: newRoleName, description: 'Nouveau rôle personnalisé', isSystem: false, usersCount: 0, permissions: [] };
      setRoles([...roles, nr]);
      setSelectedRole(nr);
      setIsModalOpen(false);
      setNewRoleName('');
      window.dispatchEvent(new CustomEvent('app-alert', { 
        detail: { title: 'Rôle créé', message: `${nr.name} a été ajouté au système.`, type: 'success' } 
      }));
  };

  return (
    <div className="animate-fade-in space-y-6 h-[calc(100vh-8rem)] relative pb-10">
      {/* Modal de création de rôle */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] w-full max-w-sm shadow-2xl p-10 border border-slate-100 dark:border-slate-700 animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-black text-2xl text-slate-900 dark:text-white uppercase tracking-tighter">Nouveau Profil</h3>
                    <button onClick={()=>setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 transition-colors"><X size={24}/></button>
                </div>
                <form onSubmit={handleAddRole}>
                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2 block">Intitulé du rôle</label>
                            <input 
                                className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" 
                                placeholder="Ex: Agent de Liaison" 
                                value={newRoleName} 
                                onChange={e=>setNewRoleName(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button type="button" onClick={()=>setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold text-sm">Annuler</button>
                            <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all">Créer</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Header Page */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-card border border-slate-50 dark:border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-[100px] opacity-40 translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10">
            <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none">Matrice de Sécurité</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Contrôle d'accès granulaire et gestion des droits d'approbation stratégiques.</p>
        </div>
        <button onClick={()=>setIsModalOpen(true)} className="relative z-10 bg-slate-900 dark:bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"><Plus size={20}/> Créer un Profil</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 h-full pb-10">
        {/* Liste latérale des rôles */}
        <div className="lg:w-1/3 bg-white dark:bg-slate-800 rounded-[3rem] shadow-card border border-slate-50 dark:border-slate-700 overflow-hidden flex flex-col h-full max-h-[700px]">
           <div className="p-8 border-b border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
              <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Profils Définis ({roles.length})</h3>
           </div>
           <div className="overflow-y-auto flex-1 p-4 space-y-2 custom-scrollbar">
              {sortedRoles.map(role => (
                 <div 
                    key={role.id} 
                    onClick={() => setSelectedRole(role)} 
                    className={`p-6 rounded-[2rem] cursor-pointer transition-all border-2 flex items-center justify-between group ${selectedRole.id === role.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-md' : 'bg-white dark:bg-slate-800 border-transparent hover:border-slate-100 dark:hover:border-slate-700'}`}
                 >
                    <div>
                        <h4 className={`font-black text-sm uppercase tracking-tight ${selectedRole.id === role.id ? 'text-blue-700 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>{role.name}</h4>
                        <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase mt-1.5 tracking-widest"><Users size={12} /> {role.usersCount} agents associés</div>
                    </div>
                    {role.isSystem ? <Shield size={18} className="text-slate-300 dark:text-slate-600" /> : <button className="text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"><Trash2 size={18}/></button>}
                 </div>
              ))}
           </div>
        </div>

        {/* Détails du rôle et matrice des permissions */}
        <div className="lg:w-2/3 bg-white dark:bg-slate-800 rounded-[3rem] shadow-card border border-slate-50 dark:border-slate-700 flex flex-col overflow-hidden h-full max-h-[700px]">
           <div className="p-10 border-b border-slate-50 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center bg-slate-50/30 dark:bg-slate-900/30 gap-6">
              <div className="flex items-center gap-6">
                  <div className="p-5 bg-blue-600 text-white rounded-[1.5rem] shadow-2xl shadow-blue-500/40"><Lock size={24}/></div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter leading-none">{selectedRole.name}</h3>
                    {selectedRole.isSystem && <span className="bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mt-2 inline-block border border-blue-100 dark:border-blue-900">Ressource Système Native</span>}
                  </div>
              </div>
              <button className="px-10 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3 hover:scale-105 transition-all active:scale-95"><Save size={18} /> Enregistrer la Matrix</button>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar">
              {selectedRole.id === 'admin' && (
                  <div className="m-8 p-8 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 rounded-[2rem] border border-amber-100 dark:border-amber-900/50 flex items-center gap-6 font-bold text-xs uppercase tracking-wider">
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm"><ShieldAlert size={28} className="text-amber-600"/></div>
                      <p className="leading-relaxed">Le profil Administrateur Central possède l'autorité suprême. Ses droits sont hérités nativement et ne peuvent pas être révoqués pour garantir la pérennité du système.</p>
                  </div>
              )}
              
              <div className="overflow-x-auto p-2">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] border-b dark:border-slate-700">
                        <tr>
                            <th className="px-10 py-8">Module Applicatif</th>
                            <th className="px-4 py-8 text-center">Consulter</th>
                            <th className="px-4 py-8 text-center">Créer</th>
                            <th className="px-4 py-8 text-center">Modifier</th>
                            <th className="px-4 py-8 text-center">Supprimer</th>
                            <th className="px-4 py-8 text-center">Approuver</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                        {modules.map(module => {
                        const perm = getPermission(selectedRole, module);
                        return (
                            <tr key={module} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all group">
                                <td className="px-10 py-6 font-black text-slate-700 dark:text-slate-300 text-xs uppercase tracking-tight group-hover:text-blue-600 transition-colors">{module}</td>
                                {(['canView', 'canCreate', 'canEdit', 'canDelete', 'canApprove'] as const).map(f => (
                                    <td key={f} className="px-4 py-6 text-center">
                                        <button 
                                            onClick={() => handlePermissionChange(module, f)} 
                                            disabled={selectedRole.id === 'admin'}
                                            className={`w-11 h-7 mx-auto rounded-full p-1 transition-all flex items-center shadow-inner ${perm[f] ? (f === 'canApprove' ? 'bg-indigo-600 dark:bg-indigo-500 shadow-indigo-500/20' : 'bg-blue-600 dark:bg-blue-500 shadow-blue-500/20') : 'bg-slate-200 dark:bg-slate-700'} ${selectedRole.id === 'admin' ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 active:scale-90 shadow-sm'}`}
                                        >
                                            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-all duration-300 ${perm[f] ? 'translate-x-4 scale-110' : 'translate-x-0'}`}>
                                                {perm[f] && <Check size={12} className={`mx-auto mt-1 ${f === 'canApprove' ? 'text-indigo-600' : 'text-blue-600'}`} strokeWidth={4} />}
                                            </div>
                                        </button>
                                    </td>
                                ))}
                            </tr>
                        )
                        })}
                    </tbody>
                </table>
              </div>
           </div>
           
           <div className="p-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between">
               <div className="flex items-center gap-3">
                    <ShieldCheck className="text-blue-600" size={20} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Nucleus MESP-RDC v3.5</p>
               </div>
               <span className="text-[10px] font-bold text-slate-500 italic">ID Traçabilité : {selectedRole.id}</span>
           </div>
        </div>
      </div>
    </div>
  );
};
