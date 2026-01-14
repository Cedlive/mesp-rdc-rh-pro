import React, { useMemo, useState, useEffect } from 'react';
import { MOCK_EXPENSES } from '../constants';
import { CreditCard, Plus, Filter, Download, DollarSign, PieChart as PieChartIcon, X, Search, UploadCloud, Calendar, FileText, CheckCircle2, AlertOctagon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import ResourceService from '../services/resourceService';
import { Expense } from '../types';
import { formatCurrency } from '../utils';

export const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
      loadData();
  }, []);

  const loadData = async () => {
      try {
          const res = await ResourceService.getExpenses();
          setExpenses(res.data);
      } catch (e) {
          setExpenses(MOCK_EXPENSES);
      }
  };

  const trendData = [{ month: 'Mai', amount: 3200 }, { month: 'Juin', amount: 4100 }, { month: 'Juil', amount: 3800 }, { month: 'Août', amount: 5200 }, { month: 'Sep', amount: 4800 }, { month: 'Oct', amount: 5900 }];
  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    expenses.forEach(expense => {
      const amountUSD = expense.currency === 'CDF' ? expense.amount / 2500 : expense.amount;
      data[expense.category] = (data[expense.category] || 0) + amountUSD;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }));
  }, [expenses]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
  const filteredExpenses = expenses.filter(ex => ex.description.toLowerCase().includes(filterQuery.toLowerCase()) || ex.category.toLowerCase().includes(filterQuery.toLowerCase()));

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          setIsModalOpen(false);
          window.dispatchEvent(new CustomEvent('app-alert', { detail: { title: 'Dépense ajoutée', message: 'La note de frais a été soumise pour validation.', type: 'success' } }));
      } catch(e) { alert("Erreur"); }
  };

  return (
    <div className="animate-fade-in space-y-6 relative">
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2"><CreditCard size={20} className="text-blue-600"/> Nouvelle Note de Frais</h3>
                    <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-200 rounded-full"><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Motif de la dépense</label><input type="text" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Déjeuner client" required /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Montant</label><input type="number" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0.00" required /></div>
                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Devise</label><select className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"><option>USD</option><option>CDF</option></select></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Catégorie</label><select className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"><option>Repas</option><option>Transport</option><option>Matériel</option><option>Autre</option></select></div>
                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label><input type="date" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" required /></div>
                    </div>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer">
                        <UploadCloud size={24} className="mb-2"/> <span className="text-xs font-medium">Glisser le reçu ou cliquer pour upload</span>
                    </div>
                    <button type="submit" className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-all flex justify-center items-center gap-2"><CheckCircle2 size={18}/> Soumettre pour validation</button>
                </form>
            </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div><h2 className="text-2xl font-bold text-gray-800">Dépenses & Frais</h2><p className="text-gray-500">Suivi budgétaire et remboursements</p></div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center gap-2"><Plus size={18} /> Nouvelle Dépense</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
             {[{label: 'En attente', val: formatCurrency(120, 'USD'), color: 'text-amber-600', bg: 'bg-amber-50', icon: AlertOctagon}, {label: 'Remboursé (Mois)', val: formatCurrency(45000, 'CDF'), color: 'text-green-600', bg: 'bg-green-50', icon: DollarSign}, {label: 'Top Catégorie', val: 'Repas', color: 'text-blue-600', bg: 'bg-blue-50', icon: PieChartIcon}].map((k, i) => (
                 <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
                     <div className="flex justify-between items-start"><div className={`p-2.5 rounded-xl ${k.bg} ${k.color}`}><k.icon size={20}/></div></div>
                     <div><h3 className="text-2xl font-bold text-slate-800">{k.val}</h3><p className="text-xs text-slate-500 font-medium uppercase mt-1">{k.label}</p></div>
                 </div>
             ))}
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center items-center relative overflow-hidden">
             <h4 className="text-sm font-bold text-slate-500 absolute top-5 left-5">Budget Mensuel</h4>
             <div className="relative w-32 h-32 mt-4"><svg className="w-full h-full" viewBox="0 0 36 36"><path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8" /><path className="text-blue-600" strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8" /></svg><div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"><span className="text-xl font-bold text-slate-800">75%</span></div></div>
             <p className="text-xs text-slate-400 mt-2">Consommé</p>
         </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
         <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Transactions Récentes</h3>
            <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input type="text" placeholder="Rechercher..." className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-0 w-64" value={filterQuery} onChange={e=>setFilterQuery(e.target.value)}/></div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold"><tr><th className="px-6 py-4">Description</th><th className="px-6 py-4">Catégorie</th><th className="px-6 py-4">Date</th><th className="px-6 py-4 text-right">Montant</th><th className="px-6 py-4 text-center">Statut</th><th className="px-6 py-4 text-center">Reçu</th></tr></thead>
               <tbody className="divide-y divide-slate-100">
                  {filteredExpenses.map(ex => (
                     <tr key={ex.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800">{ex.description}</td>
                        <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs border border-slate-200">{ex.category}</span></td>
                        <td className="px-6 py-4 text-slate-500">{ex.date}</td>
                        <td className="px-6 py-4 text-right font-bold font-mono">{formatCurrency(ex.amount, ex.currency)}</td>
                        <td className="px-6 py-4 text-center"><span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${ex.status === 'Approuvé' ? 'bg-green-100 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{ex.status}</span></td>
                        <td className="px-6 py-4 text-center"><button className="text-slate-400 hover:text-blue-600"><FileText size={16}/></button></td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};