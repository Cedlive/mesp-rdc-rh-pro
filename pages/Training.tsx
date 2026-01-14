
import React, { useState } from 'react';
import { MOCK_TRAININGS, MOCK_EMPLOYEES } from '../constants';
import { GraduationCap, Calendar, MapPin, Users, Plus, CheckCircle, Clock, DollarSign, X, Save } from 'lucide-react';
import { TrainingSession } from '../types';

export const Training = () => {
  const [trainings, setTrainings] = useState<TrainingSession[]>(MOCK_TRAININGS);
  const [filter, setFilter] = useState<'ALL' | 'PLAN' | 'DONE'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Training Form State
  const [newTraining, setNewTraining] = useState<Partial<TrainingSession>>({
    title: '',
    type: 'Technique',
    provider: '',
    startDate: '',
    endDate: '',
    location: '',
    capacity: 10,
    cost: 0
  });

  const filteredTrainings = trainings.filter(t => {
    if (filter === 'PLAN') return t.status === 'Planifié' || t.status === 'En cours';
    if (filter === 'DONE') return t.status === 'Terminé';
    return true;
  });

  const handleCreateTraining = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTraining.title || !newTraining.startDate) return;

      const session: TrainingSession = {
          id: `TR${Date.now()}`,
          title: newTraining.title || '',
          type: newTraining.type as any,
          provider: newTraining.provider || '',
          startDate: newTraining.startDate || '',
          endDate: newTraining.endDate || '',
          location: newTraining.location || '',
          status: 'Planifié',
          attendees: [],
          capacity: newTraining.capacity || 10,
          cost: newTraining.cost || 0
      };

      setTrainings([session, ...trainings]);
      setIsModalOpen(false);
      setNewTraining({ title: '', type: 'Technique', provider: '', startDate: '', endDate: '', location: '', capacity: 10, cost: 0 });

      const event = new CustomEvent('app-alert', {
        detail: {
            title: 'Formation Créée',
            message: `La session "${session.title}" a été ajoutée au calendrier.`,
            type: 'success'
        }
      });
      window.dispatchEvent(event);
  };

  return (
    <div className="animate-fade-in space-y-6 relative">
      
      {/* NEW TRAINING MODAL */}
      {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800">Planifier une Formation</h3>
                    <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-200 rounded-full transition-colors"><X size={20}/></button>
                </div>
                <form onSubmit={handleCreateTraining} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titre de la formation</label>
                        <input 
                            type="text" 
                            required
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Sécurité Incendie"
                            value={newTraining.title}
                            onChange={(e) => setNewTraining({...newTraining, title: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select 
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newTraining.type}
                                onChange={(e) => setNewTraining({...newTraining, type: e.target.value as any})}
                            >
                                <option value="Technique">Technique</option>
                                <option value="Management">Management</option>
                                <option value="Soft Skills">Soft Skills</option>
                                <option value="Santé">Santé</option>
                                <option value="Sécurité">Sécurité</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prestataire</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ex: Interne ou Cabinet X"
                                value={newTraining.provider}
                                onChange={(e) => setNewTraining({...newTraining, provider: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date Début</label>
                            <input 
                                type="date" 
                                required
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newTraining.startDate}
                                onChange={(e) => setNewTraining({...newTraining, startDate: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date Fin</label>
                            <input 
                                type="date" 
                                required
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newTraining.endDate}
                                onChange={(e) => setNewTraining({...newTraining, endDate: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Salle de conférence"
                            value={newTraining.location}
                            onChange={(e) => setNewTraining({...newTraining, location: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Capacité</label>
                            <input 
                                type="number" 
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newTraining.capacity}
                                onChange={(e) => setNewTraining({...newTraining, capacity: parseInt(e.target.value)})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Coût Estimé ($)</label>
                            <input 
                                type="number" 
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newTraining.cost}
                                onChange={(e) => setNewTraining({...newTraining, cost: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2">
                            <Save size={18} /> Planifier
                        </button>
                    </div>
                </form>
            </div>
         </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Formation & Développement</h2>
          <p className="text-gray-500">Plan de renforcement des capacités du personnel</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Nouvelle Formation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-white/20 rounded-xl">
                  <GraduationCap size={24} />
               </div>
               <span className="bg-white/20 px-2 py-1 rounded text-xs font-medium">2023</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{trainings.length}</h3>
            <p className="text-blue-100 text-sm">Sessions organisées</p>
         </div>
         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                  <Users size={24} />
               </div>
               <span className="text-gray-400 text-xs font-medium">Taux de participation</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">85%</h3>
            <p className="text-gray-500 text-sm">Employés formés cette année</p>
         </div>
         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                  <DollarSign size={24} />
               </div>
               <span className="text-gray-400 text-xs font-medium">Budget Consommé</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">$4,850</h3>
            <p className="text-gray-500 text-sm">Sur un budget de $10,000</p>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
         <button 
            onClick={() => setFilter('ALL')}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${filter === 'ALL' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
         >
            Toutes les sessions
         </button>
         <button 
            onClick={() => setFilter('PLAN')}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${filter === 'PLAN' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
         >
            À venir & En cours
         </button>
         <button 
            onClick={() => setFilter('DONE')}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${filter === 'DONE' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
         >
            Terminées
         </button>
      </div>

      {/* List */}
      <div className="space-y-4">
         {filteredTrainings.map(training => (
            <div key={training.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
               <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                  <div className="flex items-start gap-4">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                        training.type === 'Technique' ? 'bg-blue-100 text-blue-600' :
                        training.type === 'Management' ? 'bg-purple-100 text-purple-600' :
                        'bg-green-100 text-green-600'
                     }`}>
                        {training.title.charAt(0)}
                     </div>
                     <div>
                        <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">{training.title}</h3>
                        <p className="text-gray-500 text-sm">{training.provider} • <span className="font-medium">{training.type}</span></p>
                     </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold self-start md:self-center ${
                     training.status === 'Planifié' ? 'bg-blue-50 text-blue-600' :
                     training.status === 'En cours' ? 'bg-amber-50 text-amber-600' :
                     'bg-gray-100 text-gray-600'
                  }`}>
                     {training.status}
                  </span>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-t border-b border-gray-50">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                     <Calendar size={18} className="text-gray-400" />
                     {new Date(training.startDate).toLocaleDateString('fr-FR')} - {new Date(training.endDate).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                     <MapPin size={18} className="text-gray-400" />
                     {training.location}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                     <Users size={18} className="text-gray-400" />
                     {training.attendees.length} / {training.capacity} participants
                  </div>
               </div>

               <div className="mt-4 flex items-center gap-2">
                  <div className="flex -space-x-2">
                     {training.attendees.map(empId => {
                        const emp = MOCK_EMPLOYEES.find(e => e.id === empId);
                        if(!emp) return null;
                        return (
                           <img key={empId} src={emp.avatar} alt={emp.lastName} className="w-8 h-8 rounded-full border-2 border-white" title={`${emp.firstName} ${emp.lastName}`} />
                        );
                     })}
                     {training.attendees.length < 3 && (
                        <button className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-gray-400 text-xs hover:bg-gray-200">
                           <Plus size={12} />
                        </button>
                     )}
                  </div>
                  <span className="text-xs text-gray-400 ml-2">Participants inscrits</span>
                  
                  <div className="flex-1 text-right">
                     <button className="text-blue-600 text-sm font-medium hover:underline">Gérer les inscriptions</button>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};
