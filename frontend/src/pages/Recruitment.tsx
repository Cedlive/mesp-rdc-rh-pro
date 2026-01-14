import React, { useState, useEffect } from 'react';
import ResourceService from '../services/resourceService';
import { PipelineStage, Candidate, JobPost } from '../types';
import { Plus, X, Mail, Star, Calendar, Database, FileText, Save, MoreHorizontal } from 'lucide-react';

export const Recruitment = () => {
  const STAGES: PipelineStage[] = ['Nouveau', 'Entretien RH', 'Test Technique', 'Entretien Manager', 'Offre'];
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [newCandidate, setNewCandidate] = useState<Partial<Candidate>>({
      firstName: '', lastName: '', email: '', jobId: '', stage: 'Nouveau'
  });

  useEffect(() => {
      loadData();
  }, []);

  const loadData = async () => {
      try {
          const [resCand, resJobs] = await Promise.all([
              ResourceService.getCandidates(),
              ResourceService.getJobs()
          ]);
          setCandidates(resCand.data);
          setJobs(resJobs.data);
          if (resJobs.data.length > 0) setNewCandidate(prev => ({ ...prev, jobId: resJobs.data[0].id }));
      } catch (e) { console.error(e); }
  };

  const handleCreateCandidate = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          await ResourceService.createCandidate(newCandidate);
          loadData();
          setIsAddModalOpen(false);
          window.dispatchEvent(new CustomEvent('app-alert', { detail: { title: 'Succès', message: 'Candidat ajouté', type: 'success' } }));
      } catch (e) { alert('Erreur création candidat'); }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6 animate-fade-in relative">
       {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6">
                <div className="flex justify-between mb-4"><h3 className="font-bold">Nouveau Candidat</h3><button onClick={()=>setIsAddModalOpen(false)}><X/></button></div>
                <form onSubmit={handleCreateCandidate} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input className="border p-2 rounded" placeholder="Prénom" value={newCandidate.firstName} onChange={e=>setNewCandidate({...newCandidate, firstName: e.target.value})} required/>
                        <input className="border p-2 rounded" placeholder="Nom" value={newCandidate.lastName} onChange={e=>setNewCandidate({...newCandidate, lastName: e.target.value})} required/>
                    </div>
                    <input className="w-full border p-2 rounded" placeholder="Email" type="email" value={newCandidate.email} onChange={e=>setNewCandidate({...newCandidate, email: e.target.value})} required/>
                    <select className="w-full border p-2 rounded" value={newCandidate.jobId} onChange={e=>setNewCandidate({...newCandidate, jobId: e.target.value})}>
                        {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                    </select>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold">Enregistrer</button>
                </form>
            </div>
        </div>
       )}

       <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Recrutement (ATS)</h2>
          <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold flex items-center gap-2"><Plus size={16} /> Ajouter Candidat</button>
       </div>

       <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex h-full gap-4 min-w-[1000px]">
             {STAGES.map((stage) => (
                   <div key={stage} className="w-72 flex flex-col bg-slate-100/50 rounded-xl border border-slate-200/60 max-h-full">
                      <div className="p-3 border-b border-slate-200/60 bg-slate-50 rounded-t-xl font-bold text-xs text-slate-600 uppercase">{stage} ({candidates.filter(c=>c.stage===stage).length})</div>
                      <div className="p-2 space-y-2 overflow-y-auto flex-1 custom-scrollbar">
                         {candidates.filter(c => c.stage === stage).map(candidate => (
                            <div key={candidate.id} onClick={() => setSelectedCandidate(candidate)} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:shadow-md">
                               <div className="font-semibold text-sm text-slate-800">{candidate.firstName} {candidate.lastName}</div>
                               <div className="text-xs text-slate-500 mb-2">{candidate.email}</div>
                               <div className="flex gap-1">{[...Array(candidate.rating || 0)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>)}</div>
                            </div>
                         ))}
                      </div>
                   </div>
             ))}
          </div>
       </div>
    </div>
  );
};