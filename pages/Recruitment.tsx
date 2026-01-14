
import React, { useState } from 'react';
import { MOCK_JOBS, MOCK_CANDIDATES } from '../constants';
import { Candidate, JobPost } from '../types';
import { Plus, X, Mail, Star, Calendar, Database, FileText, Save, MoreHorizontal, Filter, Search, ChevronRight } from 'lucide-react';

export const Recruitment = () => {
  const STAGES = ['Nouveau', 'Entretien RH', 'Test Technique', 'Entretien Manager', 'Offre'];
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newCandidate, setNewCandidate] = useState<Partial<Candidate>>({
      firstName: '', lastName: '', email: '', jobId: MOCK_JOBS[0].id, stage: 'Nouveau'
  });

  const handleCreateCandidate = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newCandidate.firstName || !newCandidate.lastName) return;

      const candidate: Candidate = {
          id: `C${Date.now()}`,
          jobId: newCandidate.jobId || MOCK_JOBS[0].id,
          firstName: newCandidate.firstName,
          lastName: newCandidate.lastName,
          email: newCandidate.email || '',
          stage: newCandidate.stage || 'Nouveau',
          appliedAt: new Date().toISOString().split('T')[0],
          rating: 3
      };

      setCandidates([candidate, ...candidates]);
      setIsAddModalOpen(false);
      setNewCandidate({ firstName: '', lastName: '', email: '', jobId: MOCK_JOBS[0].id, stage: 'Nouveau' });
      
      window.dispatchEvent(new CustomEvent('app-alert', { 
          detail: { title: 'Succès', message: 'Candidat ajouté au vivier.', type: 'success' } 
      }));
  };

  const filteredCandidates = candidates.filter(c => 
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-8 animate-fade-in">
       
       {/* HEADER RECRUTEMENT */}
       <div className="bg-white p-8 rounded-[2.5rem] shadow-card border border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
           <div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Gestion des Talents</h2>
               <p className="text-slate-500 font-medium mt-1">Automatisation du pipeline ATS pour la mutuelle.</p>
           </div>
           <div className="flex gap-4 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input 
                      type="text" 
                      placeholder="Chercher un candidat..." 
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none text-sm focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                   />
               </div>
               <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center gap-2"><Plus size={20} /> Nouveau</button>
           </div>
       </div>

       {/* KANBAN BOARD */}
       <div className="flex-1 overflow-x-auto pb-6">
          <div className="flex h-full gap-6 min-w-[1200px]">
             {STAGES.map((stage) => {
                const stageCandidates = filteredCandidates.filter(c => c.stage === stage);
                return (
                   <div key={stage} className="w-80 flex flex-col bg-slate-100/50 rounded-[2.5rem] border border-slate-200/60 p-4">
                      <div className="p-4 flex justify-between items-center mb-4">
                         <span className="font-black text-xs text-slate-600 uppercase tracking-widest">{stage}</span>
                         <span className="bg-white text-slate-400 text-[10px] font-black px-3 py-1 rounded-full shadow-sm">{stageCandidates.length}</span>
                      </div>
                      
                      <div className="space-y-4 overflow-y-auto flex-1 custom-scrollbar px-2">
                         {stageCandidates.map(candidate => (
                            <div key={candidate.id} className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
                               <div className="flex justify-between items-start mb-4">
                                  <div>
                                      <div className="font-black text-sm text-slate-800 group-hover:text-blue-600 transition-colors">{candidate.firstName} {candidate.lastName}</div>
                                      <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">{candidate.email}</div>
                                  </div>
                                  <button className="p-1 text-slate-300 hover:text-slate-600 transition-colors"><MoreHorizontal size={14}/></button>
                               </div>
                               <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                                  <div className="flex gap-1">
                                     {[...Array(candidate.rating || 0)].map((_, i) => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />)}
                                  </div>
                                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 text-[10px] border border-slate-200">{candidate.firstName.charAt(0)}</div>
                                </div>
                            </div>
                         ))}
                         <button className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 border-2 border-dashed border-slate-200 rounded-[1.5rem] transition-all hover:bg-white hover:border-blue-200 flex items-center justify-center gap-2 mt-4"><Plus size={14}/> Ajouter ici</button>
                      </div>
                   </div>
                )
             })}
          </div>
       </div>

       {/* MODAL AJOUT (Simplié pour la cohérence) */}
       {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl p-10">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Nouveau Talent</h3>
                    <button onClick={()=>setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all"><X size={24}/></button>
                </div>
                <form onSubmit={handleCreateCandidate} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase ml-1">Prénom</label><input className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-blue-500" value={newCandidate.firstName} onChange={e=>setNewCandidate({...newCandidate, firstName: e.target.value})} required/></div>
                        <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nom</label><input className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-blue-500" value={newCandidate.lastName} onChange={e=>setNewCandidate({...newCandidate, lastName: e.target.value})} required/></div>
                    </div>
                    <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase ml-1">Email</label><input className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-blue-500" type="email" value={newCandidate.email} onChange={e=>setNewCandidate({...newCandidate, email: e.target.value})} required/></div>
                    <button type="submit" className="w-full py-5 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3"><Save size={18}/> Enregistrer dans le vivier</button>
                </form>
            </div>
        </div>
       )}
    </div>
  );
};
