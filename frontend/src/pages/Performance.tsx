
import React, { useState } from 'react';
import { MOCK_REVIEWS, MOCK_EMPLOYEES } from '../constants';
import { PerformanceReview } from '../types';
import { TrendingUp, Award, Target, ChevronRight, Plus, X, Save, CheckSquare, Clock } from 'lucide-react';

export const Performance = () => {
  const [reviews, setReviews] = useState<PerformanceReview[]>(MOCK_REVIEWS);
  
  // Reviews Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReview, setNewReview] = useState<Partial<PerformanceReview>>({
      employeeId: '',
      period: 'Q4 2023',
      reviewer: 'Jean Ilunga',
      score: 0,
      goals: []
  });

  // Goals State
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goals, setGoals] = useState([
      { id: 1, title: 'Finaliser la migration Paie', progress: 80, deadline: '2023-11-30' },
      { id: 2, title: 'Recrutement 5 nouveaux médecins', progress: 40, deadline: '2023-12-15' },
      { id: 3, title: 'Formation continue équipe RH', progress: 10, deadline: '2023-12-31' }
  ]);
  const [newGoalForm, setNewGoalForm] = useState({
      title: '',
      deadline: '',
      progress: 0
  });

  const handleCreateReview = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newReview.employeeId) return;

      const review: PerformanceReview = {
          id: `PR${Date.now()}`,
          employeeId: newReview.employeeId,
          period: newReview.period || 'Q4 2023',
          reviewer: newReview.reviewer || 'Admin',
          score: newReview.score || 0,
          status: 'En cours',
          goals: []
      };

      setReviews([review, ...reviews]);
      setIsModalOpen(false);
      setNewReview({ employeeId: '', period: 'Q4 2023', reviewer: 'Jean Ilunga', score: 0, goals: [] });

      window.dispatchEvent(new CustomEvent('app-alert', {
        detail: {
            title: 'Évaluation Créée',
            message: `L'évaluation de performance a été initialisée.`,
            type: 'success'
        }
      }));
  };

  const handleAddGoal = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newGoalForm.title || !newGoalForm.deadline) return;

      const newGoal = {
          id: Date.now(),
          title: newGoalForm.title,
          deadline: newGoalForm.deadline,
          progress: newGoalForm.progress
      };

      setGoals([...goals, newGoal]);
      setIsGoalModalOpen(false);
      setNewGoalForm({ title: '', deadline: '', progress: 0 });

      window.dispatchEvent(new CustomEvent('app-alert', {
        detail: {
            title: 'Objectif ajouté',
            message: `Nouvel objectif "${newGoal.title}" enregistré.`,
            type: 'success'
        }
      }));
  };

  const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="animate-fade-in space-y-6 relative">
      
      {/* NEW REVIEW MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800">Nouvelle Évaluation</h3>
                    <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-200 rounded-full transition-colors"><X size={20}/></button>
                </div>
                <form onSubmit={handleCreateReview} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employé à évaluer</label>
                        <select 
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newReview.employeeId}
                            onChange={(e) => setNewReview({...newReview, employeeId: e.target.value})}
                            required
                        >
                            <option value="">Sélectionner un employé...</option>
                            {MOCK_EMPLOYEES.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
                            <select 
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newReview.period}
                                onChange={(e) => setNewReview({...newReview, period: e.target.value})}
                            >
                                <option value="Q1 2023">Q1 2023</option>
                                <option value="Q2 2023">Q2 2023</option>
                                <option value="Q3 2023">Q3 2023</option>
                                <option value="Q4 2023">Q4 2023</option>
                                <option value="Annuel 2023">Annuel 2023</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Évaluateur</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                value={newReview.reviewer}
                                readOnly
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Note Globale (0-100)</label>
                        <input 
                            type="number" 
                            min="0" max="100"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newReview.score}
                            onChange={(e) => setNewReview({...newReview, score: parseInt(e.target.value)})}
                        />
                    </div>
                    
                    <div className="pt-2">
                        <button type="submit" className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2">
                            <Save size={18} /> Créer l'évaluation
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* NEW GOAL MODAL */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-900 text-white">
                    <h3 className="font-bold flex items-center gap-2"><Target size={18}/> Nouvel Objectif</h3>
                    <button onClick={() => setIsGoalModalOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors"><X size={20}/></button>
                </div>
                <form onSubmit={handleAddGoal} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Intitulé de l'objectif</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Ex: Réduire les coûts de 10%"
                            value={newGoalForm.title}
                            onChange={(e) => setNewGoalForm({...newGoalForm, title: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date limite</label>
                        <input 
                            type="date" 
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            value={newGoalForm.deadline}
                            onChange={(e) => setNewGoalForm({...newGoalForm, deadline: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Progression initiale</label>
                            <span className="text-xs font-bold text-blue-600">{newGoalForm.progress}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" max="100"
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            value={newGoalForm.progress}
                            onChange={(e) => setNewGoalForm({...newGoalForm, progress: parseInt(e.target.value)})}
                        />
                    </div>
                    
                    <div className="pt-2">
                        <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2 text-sm">
                            <Save size={16} /> Ajouter
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Performance & Évaluations</h2>
          <p className="text-gray-500">Suivi des objectifs et compétences des employés</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <Target size={18} />
          Nouvelle Évaluation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* KPI Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-green-100 text-green-600 rounded-xl"><Award size={24} /></div>
            <div>
                <p className="text-sm text-gray-500">Score Moyen (Q3)</p>
                <h3 className="text-2xl font-bold text-gray-800">88.5/100</h3>
            </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-blue-100 text-blue-600 rounded-xl"><Target size={24} /></div>
            <div>
                <p className="text-sm text-gray-500">Objectifs Atteints</p>
                <h3 className="text-2xl font-bold text-gray-800">76%</h3>
            </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-purple-100 text-purple-600 rounded-xl"><TrendingUp size={24} /></div>
            <div>
                <p className="text-sm text-gray-500">Évaluations en cours</p>
                <h3 className="text-2xl font-bold text-gray-800">{reviews.filter(r => r.status === 'En cours').length}</h3>
            </div>
            </div>
          </div>

          {/* My Goals Widget */}
          <div className="lg:row-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                      <CheckSquare size={20} className="text-green-400" /> Mes Objectifs
                  </h3>
                  <button 
                    onClick={() => setIsGoalModalOpen(true)}
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
                    title="Ajouter un objectif"
                  >
                      <Plus size={16} />
                  </button>
              </div>
              
              <div className="space-y-5 overflow-y-auto max-h-[300px] custom-scrollbar pr-2 flex-1">
                  {goals.map(goal => (
                      <div key={goal.id} className="group">
                          <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-slate-100">{goal.title}</span>
                              <span className="text-xs font-bold text-blue-300">{goal.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                              <div className="bg-blue-500 h-2 rounded-full transition-all duration-500 relative" style={{ width: `${goal.progress}%` }}>
                                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              </div>
                          </div>
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                  <Clock size={10} /> Date limite: {formatDate(goal.deadline)}
                              </div>
                              {goal.progress === 100 && <span className="text-[10px] text-green-400 font-bold flex items-center gap-1"><CheckSquare size={10}/> Terminé</span>}
                          </div>
                      </div>
                  ))}
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                  <p className="text-xs text-slate-400">Gardez le cap sur vos priorités trimestrielles.</p>
              </div>
          </div>

          {/* Reviews Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-lg text-gray-800">Évaluations Récentes</h3>
            </div>
            <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                    <th className="px-6 py-4">Employé</th>
                    <th className="px-6 py-4">Période</th>
                    <th className="px-6 py-4">Évaluateur</th>
                    <th className="px-6 py-4 text-center">Score</th>
                    <th className="px-6 py-4 text-center">Statut</th>
                    <th className="px-6 py-4"></th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {reviews.map(review => {
                    const emp = MOCK_EMPLOYEES.find(e => e.id === review.employeeId);
                    return (
                    <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <img src={emp?.avatar} className="w-8 h-8 rounded-full" alt="" />
                            <span className="font-medium text-gray-800">{emp?.firstName} {emp?.lastName}</span>
                        </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{review.period}</td>
                        <td className="px-6 py-4 text-gray-600">{review.reviewer}</td>
                        <td className="px-6 py-4 text-center">
                        <span className={`font-bold ${review.score >= 90 ? 'text-green-600' : review.score >= 75 ? 'text-blue-600' : 'text-amber-600'}`}>
                            {review.score}/100
                        </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${review.status === 'Finalisé' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {review.status}
                        </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-blue-600">
                            <ChevronRight size={20} />
                        </button>
                        </td>
                    </tr>
                    )
                })}
                </tbody>
            </table>
            </div>
        </div>
      </div>
    </div>
  );
};
