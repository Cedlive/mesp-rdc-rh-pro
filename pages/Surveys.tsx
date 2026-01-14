
import React, { useState } from 'react';
import { MOCK_SURVEYS } from '../constants';
import { Survey } from '../types';
import { ClipboardList, Plus, Users, Calendar, ArrowRight, X, CheckCircle, BarChart2 } from 'lucide-react';

export const Surveys = () => {
  const [surveys, setSurveys] = useState<Survey[]>(MOCK_SURVEYS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSurvey, setNewSurvey] = useState({ title: '', deadline: '', options: ['Option 1', 'Option 2'] });

  const handleAddOption = () => setNewSurvey({...newSurvey, options: [...newSurvey.options, `Option ${newSurvey.options.length + 1}`]});
  const handleCreate = (e: React.FormEvent) => {
      e.preventDefault();
      const s: Survey = { id: `S${Date.now()}`, title: newSurvey.title, deadline: newSurvey.deadline, status: 'Actif', participants: 0 };
      setSurveys([s, ...surveys]);
      setIsModalOpen(false);
      window.dispatchEvent(new CustomEvent('app-alert', { detail: { title: 'Sondage créé', message: 'Le sondage est maintenant en ligne.', type: 'success' } }));
  };

  return (
    <div className="animate-fade-in space-y-6 relative">
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100">
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50"><h3 className="font-bold text-slate-800">Nouveau Sondage</h3><button onClick={()=>setIsModalOpen(false)}><X size={20}/></button></div>
                  <form onSubmit={handleCreate} className="p-6 space-y-4">
                      <div><label className="text-xs font-bold text-slate-500 uppercase">Question / Titre</label><input className="w-full border rounded-xl p-3 text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none" value={newSurvey.title} onChange={e=>setNewSurvey({...newSurvey, title: e.target.value})} required /></div>
                      <div><label className="text-xs font-bold text-slate-500 uppercase">Date limite</label><input type="date" className="w-full border rounded-xl p-3 text-sm mt-1" value={newSurvey.deadline} onChange={e=>setNewSurvey({...newSurvey, deadline: e.target.value})} required /></div>
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Options de réponse</label>
                          <div className="space-y-2">{newSurvey.options.map((opt, i)=><input key={i} className="w-full border rounded-lg p-2 text-sm bg-slate-50" value={opt} onChange={e=>{const o=[...newSurvey.options];o[i]=e.target.value;setNewSurvey({...newSurvey, options:o})}} />)}</div>
                          <button type="button" onClick={handleAddOption} className="text-xs text-blue-600 font-bold mt-2 flex items-center gap-1 hover:underline"><Plus size={12}/> Ajouter une option</button>
                      </div>
                      <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700">Publier</button>
                  </form>
              </div>
          </div>
      )}

      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-bold text-gray-800">Sondages & Votes</h2><p className="text-gray-500">Engagement employé</p></div>
        <button onClick={()=>setIsModalOpen(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"><Plus size={18} /> Créer un sondage</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {surveys.map(survey => (
          <div key={survey.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:bg-blue-100 transition-colors"></div>
             <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm"><BarChart2 size={24} /></div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${survey.status === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{survey.status}</span>
             </div>
             <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{survey.title}</h3>
             <div className="w-full bg-slate-100 h-2 rounded-full mb-4 overflow-hidden"><div className="bg-blue-500 h-full rounded-full" style={{width: `${Math.random() * 100}%`}}></div></div>
             <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1"><Users size={14}/> {survey.participants} votes</span>
                <span className="flex items-center gap-1"><Calendar size={14}/> Fin: {survey.deadline}</span>
             </div>
             <button className="mt-4 w-full py-2.5 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors">Voir les résultats</button>
          </div>
        ))}
      </div>
    </div>
  );
};
