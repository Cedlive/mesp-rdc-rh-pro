
import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_SURVEYS } from '../constants';
import { Survey } from '../types';
import ResourceService from '../services/resourceService';
import { ClipboardList, Plus, Users, Calendar, ArrowRight, X, BarChart2, Filter, ArrowUpDown, Trash2, Clock, Sparkles, PieChart } from 'lucide-react';

export const Surveys = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [newSurvey, setNewSurvey] = useState({ 
      title: '', 
      deadline: '', 
      options: ['Oui', 'Non'] 
  });

  // Filtres & Tri
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Actif' | 'Clôturé'>('ALL');
  const [sortConfig, setSortConfig] = useState<'deadline_asc' | 'deadline_desc' | 'participants'>('deadline_asc');

  useEffect(() => {
      loadData();
  }, []);

  const loadData = async () => {
      try {
          const res = await ResourceService.getSurveys();
          setSurveys(res.data);
      } catch (e) {
          setSurveys(MOCK_SURVEYS);
      }
  };

  // --- ACTIONS FORMULAIRE ---
  const handleAddOption = () => {
      setNewSurvey({...newSurvey, options: [...newSurvey.options, '']});
  };

  const handleRemoveOption = (index: number) => {
      const updatedOptions = newSurvey.options.filter((_, i) => i !== index);
      setNewSurvey({...newSurvey, options: updatedOptions});
  };

  const handleOptionChange = (index: number, value: string) => {
      const updatedOptions = [...newSurvey.options];
      updatedOptions[index] = value;
      setNewSurvey({...newSurvey, options: updatedOptions});
  };

  const handleCreate = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!newSurvey.title || !newSurvey.deadline || newSurvey.options.some(o => !o.trim())) return;

      try {
          const res = await ResourceService.createSurvey({
              title: newSurvey.title,
              deadline: newSurvey.deadline,
              status: 'Actif',
              participants: 0
          });
          setSurveys([res.data, ...surveys]);
          setIsModalOpen(false);
          setNewSurvey({ title: '', deadline: '', options: ['Oui', 'Non'] });
          window.dispatchEvent(new CustomEvent('app-alert', { detail: { title: 'Sondage publié', message: 'Votre sondage est en ligne.', type: 'success' } }));
      } catch(e) { alert("Erreur création"); }
  };

  // --- LOGIQUE FILTRES ---
  const filteredSurveys = useMemo(() => {
      let result = [...surveys];
      if (statusFilter !== 'ALL') {
          result = result.filter(s => s.status === statusFilter);
      }
      result.sort((a, b) => {
          if (sortConfig === 'deadline_asc') return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
          else if (sortConfig === 'deadline_desc') return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
          else if (sortConfig === 'participants') return b.participants - a.participants;
          return 0;
      });
      return result;
  }, [surveys, statusFilter, sortConfig]);

  const getDaysLeft = (dateStr: string) => {
      const diff = new Date(dateStr).getTime() - new Date().getTime();
      const days = Math.ceil(diff / (1000 * 3600 * 24));
      return days > 0 ? days : 0;
  };

  return (
    <div className="animate-fade-in space-y-8 relative pb-10">
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
                  <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
                      <div><h3 className="font-bold text-xl text-slate-800">Nouveau Sondage</h3><p className="text-xs text-slate-500 mt-1">Créez un vote pour collecter l'avis des équipes.</p></div>
                      <button onClick={()=>setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"><X size={20}/></button>
                  </div>
                  
                  <form onSubmit={handleCreate} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                      <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Question du sondage</label><textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Quel thème pour la fête de fin d'année ?" rows={2} value={newSurvey.title} onChange={e=>setNewSurvey({...newSurvey, title: e.target.value})} required /></div>
                      <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Date limite de vote</label><div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="date" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={newSurvey.deadline} onChange={e=>setNewSurvey({...newSurvey, deadline: e.target.value})} required /></div></div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <label className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase mb-3"><span>Options de réponse</span><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px]">{newSurvey.options.length}</span></label>
                          <div className="space-y-3">{newSurvey.options.map((opt, i) => (<div key={i} className="flex gap-2 animate-in slide-in-from-left-2 duration-200"><div className="flex-1 relative"><div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-slate-300"></div><input className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none" placeholder={`Option ${i + 1}`} value={opt} onChange={e => handleOptionChange(i, e.target.value)} required /></div>{newSurvey.options.length > 2 && (<button type="button" onClick={() => handleRemoveOption(i)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>)}</div>))}</div>
                          <button type="button" onClick={handleAddOption} className="mt-4 text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2 px-2 py-1 rounded hover:bg-blue-50 transition-colors"><Plus size={16}/> Ajouter une option</button>
                      </div>
                      <div className="pt-2"><button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transform transition-all active:scale-[0.98] flex justify-center items-center gap-2"><Sparkles size={18} /> Publier le sondage</button></div>
                  </form>
              </div>
          </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div><h2 className="text-2xl font-bold text-gray-800 tracking-tight">Sondages & Votes</h2><p className="text-gray-500 mt-1">Mesurez l'engagement et collectez les avis des employés.</p></div>
        <button onClick={()=>setIsModalOpen(true)} className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2 hover:-translate-y-0.5"><Plus size={18} /> Créer un sondage</button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between sticky top-20 z-30 backdrop-blur-xl bg-white/80">
         <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <div className="p-2.5 bg-slate-100 text-slate-500 rounded-xl"><Filter size={18} /></div>
            <div className="flex bg-slate-100 p-1.5 rounded-xl">
                {['ALL', 'Actif', 'Clôturé'].map((filterVal) => (
                    <button key={filterVal} onClick={() => setStatusFilter(filterVal as any)} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${statusFilter === filterVal ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>{filterVal === 'ALL' ? 'Tous' : filterVal === 'Actif' ? 'En cours' : 'Terminés'}</button>
                ))}
            </div>
         </div>
         <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64"><ArrowUpDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" /><select className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-medium cursor-pointer" value={sortConfig} onChange={(e) => setSortConfig(e.target.value as any)}><option value="deadline_asc">Urgence (Bientôt clos)</option><option value="deadline_desc">Date (Plus loin)</option><option value="participants">Popularité (Votes)</option></select></div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSurveys.length > 0 ? filteredSurveys.map((survey, index) => {
          const daysLeft = getDaysLeft(survey.deadline);
          const isClosed = survey.status === 'Clôturé' || daysLeft === 0;
          return (
            <div key={survey.id} className="bg-white rounded-2xl shadow-card border border-slate-100 hover:shadow-xl transition-all duration-300 group flex flex-col relative overflow-hidden">
               <div className={`h-24 ${isClosed ? 'bg-slate-100' : 'bg-gradient-to-r from-blue-50 to-indigo-50'} relative overflow-hidden`}>
                   <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                   <div className="absolute top-4 left-4"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border shadow-sm ${isClosed ? 'bg-white text-slate-500 border-slate-200' : 'bg-white text-green-600 border-green-200 flex items-center gap-1'}`}>{isClosed ? 'Terminé' : <><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> En cours</>}</span></div>
                   {!isClosed && (<div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-slate-700 shadow-sm border border-white/50 flex items-center gap-1"><Clock size={12} className="text-blue-600"/> J-{daysLeft}</div>)}
               </div>
               <div className="p-6 pt-2 flex-1 flex flex-col">
                   <div className="w-12 h-12 -mt-8 mb-4 bg-white rounded-xl shadow-md flex items-center justify-center border border-slate-50 relative z-10"><div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isClosed ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white'}`}>{isClosed ? <PieChart size={20} /> : <BarChart2 size={20} />}</div></div>
                   <h3 className="font-bold text-lg text-slate-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{survey.title}</h3>
                   <div className="mt-auto pt-6 space-y-4">
                       <div><div className="flex justify-between text-xs mb-1.5"><span className="font-bold text-slate-700">{survey.participants} votes</span><span className="text-slate-400">Participation</span></div><div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-1000 ${isClosed ? 'bg-slate-400' : 'bg-gradient-to-r from-blue-500 to-indigo-500 relative'}`} style={{width: `${Math.min(100, (survey.participants/50)*100)}%`}}></div></div></div>
                       <div className="flex justify-between items-center border-t border-slate-50 pt-4"><div className="flex items-center gap-1 text-xs text-slate-400"><Calendar size={12} /> {new Date(survey.deadline).toLocaleDateString('fr-FR', {day: 'numeric', month: 'short'})}</div></div>
                       <button className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${isClosed ? 'bg-slate-50 text-slate-500 border border-slate-200' : 'bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white'}`}>{isClosed ? 'Voir les résultats' : <>Voter maintenant <ArrowRight size={16} /></>}</button>
                   </div>
               </div>
            </div>
          );
        }) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <div className="p-6 bg-slate-50 rounded-full mb-4 animate-bounce"><ClipboardList size={40} className="text-slate-300" /></div>
                <h3 className="text-lg font-bold text-slate-600">Aucun sondage trouvé</h3>
            </div>
        )}
      </div>
    </div>
  );
};
