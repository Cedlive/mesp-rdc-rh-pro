
import React, { useState, useMemo } from 'react';
import { MOCK_ROLES, MOCK_EMPLOYEES } from '../constants';
import { Role, ModulePermission, Employee } from '../types';
import { 
  Shield, Lock, Users, Check, Save, Plus, AlertCircle, 
  Trash2, ShieldCheck, Eye, ShieldAlert, UserCheck, 
  ChevronRight, Info, Search, Mail, Building2, LayoutGrid, Sparkles, X,
  User, Briefcase, FileText, ClipboardCheck
} from 'lucide-react';

// Définition des modèles de permissions par défaut
const ROLE_TEMPLATES = {
    employee: { 
        id: 'employee', 
        name: 'Modèle Employé', 
        icon: User,
        desc: 'Accès minimal : Consultation annuaire, documents personnels et communication.', 
        perms: [
            { module: 'Employees', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
            { module: 'Communication', canView: true, canCreate: true, canEdit: false, canDelete: false, canApprove: false },
            { module: 'Settings', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
        ]
    },
    manager: { 
        id: 'manager', 
        name: 'Modèle Manager', 
        icon: Briefcase,
        desc: 'Consultation RH étendue, Analytics et validation des demandes (Approve).', 
        perms: [
            { module: 'Employees', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
            { module: 'Analytics', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
            { module: 'Communication', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: false },
            { module: 'Payroll', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: true },
        ]
    },
    hr_assistant: { 
        id: 'hr_assistant', 
        name: 'Assistant RH', 
        icon: FileText,
        desc: 'Gestion opérationnelle des dossiers employés et du recrutement (sans suppression).', 
        perms: [
            { module: 'Employees', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: false },
            { module: 'Recruitment', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: false },
            { module: 'Communication', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: false },
        ]
    },
    audit: { 
        id: 'audit', 
        name: 'Modèle Audit', 
        icon: ClipboardCheck,
        desc: 'Accès "Lecture Seule" universel sur tous les modules financiers et RH.', 
        perms: [
            { module: 'Employees', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
            { module: 'Payroll', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
            { module: 'Recruitment', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
            { module: 'Analytics', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
        ]
    }
};

export const Roles = () => {
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
  const [selectedRole, setSelectedRole] = useState<Role>(MOCK_ROLES[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('employee');

  const MODULES = ['Employees', 'Payroll', 'Medical', 'Recruitment', 'Settings', 'Analytics', 'Communication'];

  const assignedUsers = useMemo(() => {
    return MOCK_EMPLOYEES.filter(emp => emp.role === selectedRole.name);
  }, [selectedRole]);

  const getPermission = (role: Role, module: string) => 
    role.permissions.find(p => p.module === module) || 
    { module, canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false };

  const handleToggle = (module: string, field: keyof Omit<ModulePermission, 'module'>) => {
    if (selectedRole.id === 'admin') return;

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
    
    const updatedRole = { ...selectedRole, permissions: updatedPerms };
    setSelectedRole(updatedRole);
    setRoles(roles.map(r => r.id === selectedRole.id ? updatedRole : r));
  };

  const handleAddRole = (e: React.FormEvent) => {
      e.preventDefault();
      const template = ROLE_TEMPLATES[selectedTemplateId as keyof typeof ROLE_TEMPLATES];
      
      const nr: Role = { 
          id: `role_${Date.now()}`, 
          name: newRoleName, 
          description: template.name, 
          isSystem: false, 
          usersCount: 0, 
          permissions: JSON.parse(JSON.stringify(template.perms)) // Deep clone des perms du template
      };
      
      setRoles([...roles, nr]);
      setSelectedRole(nr);
      setIsModalOpen(false);
      setNewRoleName('');
      setSelectedTemplateId('employee');
      
      window.dispatchEvent(new CustomEvent('app-alert', { 
          detail: { title: 'Rôle créé', message: `Le rôle ${nr.name} a été initialisé avec le modèle choisi.`, type: 'success' } 
      }));
  };

  return (
    <div className="animate-fade-in space-y-8 pb-20">
      {/* Modal de création avancée */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-800 rounded-[3rem] w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
                <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Nouveau Rôle</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Configurez les droits d'accès initiaux via nos modèles</p>
                    </div>
                    <button onClick={()=>setIsModalOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all text-slate-400"><X size={24}/></button>
                </div>

                <form onSubmit={handleAddRole} className="p-10 space-y-10 overflow-y-auto custom-scrollbar">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Intitulé du rôle</label>
                        <input 
                            className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white" 
                            placeholder="Ex: Responsable des Primes Spécifiques" 
                            value={newRoleName} 
                            onChange={e=>setNewRoleName(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Modèle de permissions (Pré-réglages)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.values(ROLE_TEMPLATES).map((t) => {
                                const Icon = t.icon;
                                return (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => setSelectedTemplateId(t.id)}
                                        className={`p-6 rounded-[2rem] text-left border-2 transition-all flex gap-5 relative overflow-hidden group ${selectedTemplateId === t.id ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 shadow-xl' : 'border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 bg-white dark:bg-slate-900'}`}
                                    >
                                        <div className={`p-4 rounded-2xl shrink-0 transition-colors ${selectedTemplateId === t.id ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-blue-500'}`}>
                                            <Icon size={24} />
                                        </div>
                                        <div className="flex flex-col justify-center min-w-0">
                                            <span className={`text-xs font-black uppercase tracking-tight ${selectedTemplateId === t.id ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'}`}>{t.name}</span>
                                            <span className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1 line-clamp-2">{t.desc}</span>
                                        </div>
                                        {selectedTemplateId === t.id && (
                                            <div className="absolute top-4 right-4">
                                                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
                                                    <Check size={12} strokeWidth={4}/>
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-slate-50 dark:border-slate-700">
                        <button type="button" onClick={()=>setIsModalOpen(false)} className="flex-1 py-5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Annuler</button>
                        <button type="submit" className="flex-1 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                            <Sparkles size={18}/> Initialiser le rôle
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Header Page */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-card border border-slate-50 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none">Matrice de Sécurité</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Gestion RBAC (Role-Based Access Control) pour l'infrastructure MESP-RDC.</p>
        </div>
        <button onClick={()=>setIsModalOpen(true)} className="bg-slate-900 dark:bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-3"><Plus size={18}/> Créer un rôle</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Liste des Rôles */}
        <div className="lg:col-span-4 space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-4 mb-2">Rôles Définis</h4>
            <div className="space-y-3">
              {roles.map(role => (
                 <div 
                    key={role.id} 
                    onClick={() => setSelectedRole(role)} 
                    className={`p-6 rounded-[2rem] cursor-pointer transition-all border-2 group ${selectedRole.id === role.id ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-500/20' : 'bg-white dark:bg-slate-800 border-transparent hover:border-slate-100 dark:hover:border-slate-700'}`}
                 >
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-black text-sm uppercase tracking-widest">{role.name}</h4>
                        {role.isSystem ? <Shield size={14} className={selectedRole.id === role.id ? 'text-blue-200' : 'text-slate-300'} /> : <button className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>}
                    </div>
                    <p className={`text-[10px] font-bold ${selectedRole.id === role.id ? 'text-blue-100' : 'text-slate-400'} uppercase tracking-tight`}>{role.description}</p>
                 </div>
              ))}
            </div>
        </div>

        {/* Matrice de Permissions */}
        <div className="lg:col-span-8 space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-card border border-slate-50 dark:border-slate-700 overflow-hidden">
                <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/30">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/30"><Lock size={20}/></div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">{selectedRole.name}</h3>
                    </div>
                    <button className="px-8 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 transition-all active:scale-95"><Save size={16} /> Enregistrer les droits</button>
                </div>
                
                <div className="p-0 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-700">
                            <tr>
                                <th className="px-8 py-5">Module Système</th>
                                <th className="py-5 text-center">Voir</th>
                                <th className="py-5 text-center">Créer</th>
                                <th className="py-5 text-center">Éditer</th>
                                <th className="py-5 text-center">Effacer</th>
                                <th className="py-5 text-center">Approuver</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                            {MODULES.map(module => {
                                const perm = getPermission(selectedRole, module);
                                return (
                                    <tr key={module} className="hover:bg-slate-50/30 dark:hover:bg-slate-700/20 transition-colors group">
                                        <td className="px-8 py-5 font-black text-slate-800 dark:text-slate-200 text-xs uppercase tracking-tight group-hover:text-blue-600 transition-colors">{module}</td>
                                        {['canView', 'canCreate', 'canEdit', 'canDelete', 'canApprove'].map((field) => (
                                            <td key={field} className="py-5 text-center">
                                                <button 
                                                    onClick={() => handleToggle(module, field as any)}
                                                    disabled={selectedRole.id === 'admin'}
                                                    className={`w-7 h-7 rounded-xl mx-auto flex items-center justify-center transition-all ${perm[field as keyof Omit<ModulePermission, 'module'>] ? (field === 'canApprove' ? 'bg-indigo-600 text-white shadow-indigo-500/30' : 'bg-blue-600 text-white shadow-blue-500/30') : 'bg-slate-100 dark:bg-slate-700 text-slate-300'} ${selectedRole.id === 'admin' ? 'cursor-not-allowed opacity-80' : 'hover:scale-110 active:scale-90 shadow-sm'}`}
                                                >
                                                    {field === 'canApprove' ? <ShieldCheck size={14}/> : <Check size={14} strokeWidth={4} />}
                                                </button>
                                            </td>
                                        ))}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                {selectedRole.id === 'admin' && (
                    <div className="p-6 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-100 dark:border-amber-900/50 flex items-center gap-3">
                        <ShieldAlert className="text-amber-600" size={20}/>
                        <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Le rôle Administrateur possède les droits universels permanents non révocables.</p>
                    </div>
                )}
            </div>

            {/* Liste des Collaborateurs liés */}
            <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-card border border-slate-50 dark:border-slate-700 p-8">
                <div className="flex justify-between items-center mb-8 border-b border-slate-50 dark:border-slate-700 pb-6">
                    <div className="flex items-center gap-3">
                        <Users className="text-slate-400" size={20}/>
                        <h3 className="font-black text-sm uppercase tracking-widest text-slate-800 dark:text-white">Agents associés à ce rôle</h3>
                    </div>
                    <span className="bg-slate-100 dark:bg-slate-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-slate-500">{assignedUsers.length} Agents</span>
                </div>

                {assignedUsers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {assignedUsers.map(user => (
                            <div key={user.id} className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all group">
                                <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover shadow-sm grayscale group-hover:grayscale-0 transition-all" />
                                <div className="min-w-0">
                                    <p className="text-xs font-black text-slate-800 dark:text-white truncate uppercase tracking-tight">{user.firstName} {user.lastName}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase">{user.department}</p>
                                </div>
                                <button className="ml-auto p-2 text-slate-300 hover:text-blue-600"><ChevronRight size={16}/></button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                            <UserCheck className="text-slate-200 dark:text-slate-700" size={32}/>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aucun agent actif n'est lié à ce rôle.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
