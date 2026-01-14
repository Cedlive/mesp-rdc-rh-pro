
import React, { useState, useEffect } from 'react';
import { MOCK_TRAININGS, MOCK_EMPLOYEES } from '../constants';
import { TrainingSession } from '../types';
import ResourceService from '../services/resourceService';
import { GraduationCap, Calendar, MapPin, Users, Plus, CheckCircle, Clock, DollarSign, X, Save, Search, User } from 'lucide-react';

export const Training = () => {
  const [trainings, setTrainings] = useState<TrainingSession[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'PLAN' | 'DONE'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
  
  // New Training Form State
  const [newTraining, setNewTraining] = useState<Partial<TrainingSession>>({ title: '', type: 'Technique', startDate: '', endDate: '' });

  useEffect(() => {
      loadTrainings();
  }, []);

  const loadTrainings = async () => {
      try {
          const res = await ResourceService.getTrainings();
          setTrainings(res.data);
      } catch (e) { setTrainings(MOCK_TRAININGS); }
  };

  const handleCreateTraining = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const res = await ResourceService.createTraining(newTraining);
          setTrainings([res.data, ...trainings]);
          setIsModalOpen(false);
          window.dispatchEvent(new CustomEvent('app-alert', { detail: { title: 'Formation créée', message: 'Session planifiée.', type: 'success' } }));
      } catch (e) { alert("Erreur création"); }
  };

  const filteredTrainings = trainings.filter(t => {
    if (filter === 'PLAN') return t.status === 'Planifié' || t.status === 'En cours';
    if (filter === 'DONE') return t.status === 'Terminé';
    return true;
  });

  const getAttendeesDetails = (attendeeIds: string[]) => {
      return MOCK_EMPLOYEES.filter(emp => attendeeIds.includes(emp.id));
  };

  return (
    <div className="animate-fade-in space-y-6 relative">
      
      {/* PARTICIPANTS LIST MODAL */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="font-bold text-gray-800">Liste des Participants</h3>
                        <p className="text-xs text-gray-500">{selectedSession.title}</p>
                    </div>
                    <button onClick={() => setSelectedSession(null)} className="p-1 hover:bg-gray-200 rounded-full transition-colors"><X size={20}/></button>
                </div>
                
                <div className="p-0 overflow-y-auto flex-1 custom-scrollbar">
                    {selectedSession.attendees.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {getAttendeesDetails(selectedSession.attendees).map(emp => (
                                <div key={emp.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 border border-slate-200">
                                        <img src={emp.avatar} alt={emp.lastName} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm text-slate-800">{emp.firstName} {emp.lastName}</h4>
                                        <p className="text-xs text-slate-500 truncate">{emp.role} • {emp.department}</p>
                                    </div>
                                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${emp.status === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {emp.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <Users size={48} className="opacity-20 mb-3" />
                            <p className="text-sm">Aucun participant inscrit pour le moment.</p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase">Total: {selectedSession.attendees.length} / {selectedSession.capacity}</span>
                    <button onClick={() => setSelectedSession(null)} className="px-4 py-2 bg-white border border-gray-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50">Fermer</button>
                </div>
            </div>
        </div>
      )}

      {/* NEW TRAINING MODAL */}
      {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6">
                <div className="flex justify-between mb-4"><h3 className="font-bold">Planifier Formation</h3><button onClick={() => setIsModalOpen(false)}><X/></button></div>
                <form onSubmit={handleCreateTraining} className="space-y-4">
                    <input className="w-full border p-2 rounded" placeholder="Titre" value={newTraining.title} onChange={e => setNewTraining({...newTraining, title: e.target.value})} required />
                    <div className="grid grid-cols-2 gap-4"><input type="date" className="border p-2 rounded" value={newTraining.startDate} onChange={e => setNewTraining({...newTraining, startDate: e.target.value})} /><input type="date" className="border p-2 rounded" value={newTraining.endDate} onChange={e => setNewTraining({...newTraining, endDate: e.target.value})} /></div>
                    <button className="w-full bg-blue-600 text-white py-2 rounded font-bold">Enregistrer</button>
                </form>
            </div>
         </div>
      )}

      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-bold text-gray-800">Formation</h2><p className="text-gray-500">Plan de développement</p></div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg flex items-center gap-2"><Plus size={18} /> Nouvelle Session</button>
      </div>

      <div className="space-y-4">
         {filteredTrainings.map(training => (
            <div key={training.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
               <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-4"><div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><GraduationCap size={24}/></div><div><h3 className="font-bold text-lg text-gray-800">{training.title}</h3><p className="text-sm text-gray-500">{training.type}</p></div></div>
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold">{training.status}</span>
               </div>
               <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 border-t pt-4">
                  <div className="flex items-center gap-2"><Calendar size={16}/> {new Date(training.startDate).toLocaleDateString()}</div>
                  <div className="flex items-center gap-2"><MapPin size={16}/> {training.location || 'Sur site'}</div>
                  <div className="flex items-center gap-2"><Users size={16}/> {training.capacity} places</div>
               </div>
               
               {/* Footer with Attendees Preview and Action */}
               <div className="mt-4 pt-4 border-t border-dashed border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                         {training.attendees.slice(0, 4).map(empId => {
                            const emp = MOCK_EMPLOYEES.find(e => e.id === empId);
                            if(!emp) return null;
                            return (
                               <img key={empId} src={emp.avatar} alt={emp.lastName} className="w-8 h-8 rounded-full border-2 border-white object-cover" title={`${emp.firstName} ${emp.lastName}`} />
                            );
                         })}
                         {training.attendees.length > 4 && (
                            <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                                +{training.attendees.length - 4}
                            </div>
                         )}
                      </div>
                      <span className="text-xs text-gray-400 ml-1">{training.attendees.length} inscrits</span>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedSession(training)}
                    className="text-blue-600 text-sm font-bold hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                     Voir les participants
                  </button>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};
