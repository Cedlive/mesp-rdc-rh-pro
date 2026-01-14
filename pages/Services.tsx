
import React, { useState } from 'react';
import { MOCK_DEPARTMENTS, MOCK_EMPLOYEES } from '../constants';
import { ServiceDepartment } from '../types';
import { ChevronRight, Users, User, Crown, MapPin, ListChecks, History, TrendingUp, Plus, X, Save, Building2, Network } from 'lucide-react';

export const Services = () => {
  // State for Departments
  const [departments, setDepartments] = useState<ServiceDepartment[]>(MOCK_DEPARTMENTS);
  const [viewMode, setViewMode] = useState<'grid' | 'tree'>('grid');
  
  // State for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    headRole: '',
    managerId: '',
    region: 'Kinshasa - Siège',
    roles: '', // Will be parsed by comma
  });

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    
    const roleList = newService.roles.split(',').map(r => r.trim()).filter(r => r !== '');

    const newDept: ServiceDepartment = {
        id: newService.title.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 100),
        title: newService.title,
        headRole: newService.headRole || 'Chef de service',
        managerId: newService.managerId,
        region: newService.region,
        roles: roleList.length > 0 ? roleList : ['Assistant'],
        tasks: [],
        archives: [],
        icon: Building2
    };

    setDepartments([newDept, ...departments]);
    setIsModalOpen(false);
    setNewService({ title: '', headRole: '', managerId: '', region: 'Kinshasa - Siège', roles: '' });

    const event = new CustomEvent('app-alert', {
        detail: {
            title: 'Service Créé',
            message: `Le département "${newDept.title}" a été ajouté avec succès.`,
            type: 'success'
        }
    });
    window.dispatchEvent(event);
  };

  const handleQuickAddRole = (deptId: string) => {
    const roleName = prompt("Nom du nouveau poste à ajouter :");
    if (roleName) {
        setDepartments(departments.map(dept => {
            if (dept.id === deptId) {
                return { ...dept, roles: [...dept.roles, roleName] };
            }
            return dept;
        }));
    }
  };

  const getManagerInfo = (managerId?: string) => {
    if(!managerId) return null;
    return MOCK_EMPLOYEES.find(e => e.id === managerId);
  }

  return (
    <div className="animate-fade-in space-y-6 relative">
      
      {/* MODAL: CREATE NEW SERVICE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800">Ajouter un Département</h3>
                    <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-200 rounded-full transition-colors"><X size={20}/></button>
                </div>
                <form onSubmit={handleCreateService} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Service / Département</label>
                        <input 
                            required
                            type="text" 
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            placeholder="Ex: Service Logistique"
                            value={newService.title}
                            onChange={(e) => setNewService({...newService, title: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Titre du Poste (Head)</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                placeholder="Ex: Chef de Division"
                                value={newService.headRole}
                                onChange={(e) => setNewService({...newService, headRole: e.target.value})}
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Responsable (Employé)</label>
                            <select 
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                value={newService.managerId}
                                onChange={(e) => setNewService({...newService, managerId: e.target.value})}
                            >
                                <option value="">-- Aucun --</option>
                                {MOCK_EMPLOYEES.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            value={newService.region}
                            onChange={(e) => setNewService({...newService, region: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Postes Initiaux (séparés par virgule)</label>
                        <textarea 
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            placeholder="Ex: Assistant Logistique, Magasinier, Chauffeur"
                            rows={3}
                            value={newService.roles}
                            onChange={(e) => setNewService({...newService, roles: e.target.value})}
                        ></textarea>
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2">
                            <Save size={18} /> Enregistrer le Service
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestion des Services</h2>
          <p className="text-gray-500">Organigramme et structure hiérarchique de la MESP-RDC</p>
        </div>
        <div className="flex gap-3">
             <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center gap-2 hover:scale-105 active:scale-95 transform"
             >
              <Plus size={18} />
              Nouveau Service
            </button>
            <div className="bg-white p-1 rounded-xl border border-gray-200 flex">
                <button 
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-slate-900 text-white shadow' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    <Building2 size={18} />
                </button>
                <button 
                    onClick={() => setViewMode('tree')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'tree' ? 'bg-slate-900 text-white shadow' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    <Network size={18} />
                </button>
            </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {departments.map((dept) => {
              const Icon = dept.icon || Users;
              const efficiency = dept.id.length * 12 % 25 + 75; // Random-ish number
              const satisfaction = 4.2;
              const manager = getManagerInfo(dept.managerId);

              return (
                <div key={dept.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 group flex flex-col h-full animate-in fade-in slide-in-from-bottom-4">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                        <Icon size={24} />
                      </div>
                      <span className="text-[10px] font-bold tracking-wider text-gray-400 bg-white border border-gray-200 px-2 py-1 rounded-md shadow-sm">
                        {dept.id}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 leading-tight mb-2">{dept.title}</h3>
                    
                    {/* Region Display */}
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-xs font-medium">{dept.region}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-5 flex-1">
                    
                    {/* Performance Section */}
                    <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 group-hover:border-blue-100 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                <TrendingUp size={12} className="text-blue-500" /> Performance
                            </h4>
                            <span className="text-xs font-bold text-slate-700">{efficiency}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2 overflow-hidden">
                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${efficiency}%` }}></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400">
                            <span>Efficacité: Haute</span>
                            <span>NPS: {satisfaction}/5</span>
                        </div>
                    </div>

                    {/* Chef de Service */}
                    {(dept.headRole || manager) && (
                      <div className="flex items-center gap-3">
                          {manager ? (
                              <div className="relative">
                                <img src={manager.avatar} alt={manager.lastName} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white">
                                    <Crown size={10} />
                                </div>
                              </div>
                          ) : (
                            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                                <User size={14} />
                            </div>
                          )}
                          
                          <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Responsable</p>
                              <p className="text-sm font-semibold text-gray-800">
                                {manager ? `${manager.firstName} ${manager.lastName}` : dept.headRole}
                              </p>
                              {manager && dept.headRole && <p className="text-[10px] text-gray-500">{dept.headRole}</p>}
                          </div>
                      </div>
                    )}

                    {/* Sub-roles */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <Users size={14} />
                            Équipe & Postes
                          </h4>
                          <button 
                            onClick={() => handleQuickAddRole(dept.id)}
                            className="p-1 rounded bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-colors"
                            title="Ajouter un poste"
                          >
                             <Plus size={12} />
                          </button>
                      </div>
                      <ul className="flex flex-wrap gap-2">
                        {dept.roles.map((role, index) => (
                          <li key={index} className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-100 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-default">
                            {role}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Specific Tasks */}
                    {dept.tasks && dept.tasks.length > 0 && (
                      <div className="pt-4 border-t border-gray-100">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <ListChecks size={14} />
                          Attributions & Tâches
                        </h4>
                        <ul className="grid grid-cols-1 gap-2.5">
                          {dept.tasks.map((task, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 group/task">
                               <div className="mt-0.5 text-blue-500 transition-transform group-hover/task:scale-110">
                                  <task.icon size={16} />
                               </div>
                               <span className="text-sm text-gray-600 leading-tight group-hover/task:text-gray-900 transition-colors">{task.label}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Historique */}
                    {dept.archives && dept.archives.length > 0 && (
                        <div className="pt-4 border-t border-gray-100">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <History size={14} />
                            Historique
                            </h4>
                            
                            <div className="relative pl-3 ml-1 border-l border-gray-100 space-y-4">
                                {dept.archives.slice(0, 2).map((doc, idx) => (
                                    <div key={idx} className="relative group/archive cursor-pointer">
                                        <div className="absolute -left-[18px] top-1 w-2.5 h-2.5 rounded-full bg-gray-300 border-2 border-white group-hover/archive:bg-blue-400 transition-colors"></div>
                                        <div className="flex justify-between items-start bg-gray-50 p-2 rounded-lg border border-transparent group-hover/archive:border-blue-100 group-hover/archive:bg-blue-50/30 transition-all hover:translate-x-1">
                                            <div>
                                                <p className="text-xs text-gray-600 font-medium group-hover/archive:text-blue-700">{doc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center group-hover:bg-blue-50/30 transition-colors mt-auto">
                    <span className="text-xs text-gray-400 font-medium">
                      {dept.roles.length + (dept.headRole ? 1 : 0)} postes • {dept.tasks?.length || 0} tâches
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 p-2 rounded-full hover:bg-white hover:shadow-sm transition-all transform group-hover:translate-x-1">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
      ) : (
          /* Tree View Implementation */
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 overflow-x-auto min-h-[600px] flex justify-center">
              <div className="flex flex-col items-center space-y-10 animate-in fade-in zoom-in-95">
                  {/* Root Node: DG */}
                  <div className="flex flex-col items-center relative">
                      <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-blue-600 w-64 flex items-center gap-3 relative z-10">
                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">DG</div>
                          <div>
                              <p className="font-bold text-slate-800">Direction Générale</p>
                              <p className="text-xs text-slate-500">Top Management</p>
                          </div>
                      </div>
                      {/* Vertical connector */}
                      <div className="h-10 w-0.5 bg-slate-300"></div>
                  </div>

                  {/* Departments Level */}
                  <div className="flex gap-8 items-start relative">
                      {/* Horizontal Bar connecting depts */}
                      <div className="absolute top-0 left-10 right-10 h-0.5 bg-slate-300 -mt-0.5"></div>

                      {departments.slice(0, 4).map((dept, idx) => (
                          <div key={dept.id} className="flex flex-col items-center relative pt-6">
                              {/* Connector to parent */}
                              <div className="absolute top-0 h-6 w-0.5 bg-slate-300"></div>
                              
                              {/* Dept Node */}
                              <div className="bg-white p-3 rounded-xl shadow-md border border-slate-100 w-56 flex flex-col items-center text-center gap-2 hover:border-blue-400 transition-colors cursor-pointer group">
                                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                      {dept.icon ? <dept.icon size={20} /> : <Building2 size={20} />}
                                  </div>
                                  <p className="font-bold text-sm text-slate-800 leading-tight">{dept.title}</p>
                                  <div className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded">
                                      {dept.headRole}
                                  </div>
                              </div>

                              {/* Roles below */}
                              <div className="h-6 w-0.5 bg-slate-200"></div>
                              <div className="space-y-2">
                                  {dept.roles.slice(0, 3).map((role, rIdx) => (
                                      <div key={rIdx} className="bg-white px-3 py-1.5 rounded-lg border border-slate-100 text-xs text-slate-600 shadow-sm w-48 text-center truncate">
                                          {role}
                                      </div>
                                  ))}
                                  {dept.roles.length > 3 && (
                                      <div className="text-[10px] text-slate-400 text-center">
                                          + {dept.roles.length - 3} autres postes
                                      </div>
                                  )}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
