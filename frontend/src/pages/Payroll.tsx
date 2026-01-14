
import React, { useState, useMemo } from 'react';
import { MOCK_PAYROLL, MOCK_EMPLOYEES } from '../constants';
import { PayrollEntry } from '../types';
import { formatCurrency } from '../utils';
import { 
  Banknote, Calculator, Search, Download, 
  Truck, Fuel, Stethoscope, Briefcase, Wrench,
  FileText, X, Check, Save, Printer, RefreshCw,
  CheckCircle2, AlertCircle
} from 'lucide-react';

export const Payroll = () => {
  const [payrollEntries, setPayrollEntries] = useState<PayrollEntry[]>(MOCK_PAYROLL as any);
  const [exchangeRate, setExchangeRate] = useState<number>(2500);
  const [selectedEntry, setSelectedEntry] = useState<PayrollEntry | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const getConsolidatedTotal = (entry: PayrollEntry, targetCurrency: 'CDF' | 'USD') => {
    const cdfPart = Number(entry.baseSalaryCDF || 0) + Number(entry.primeCDF || 0) + Number(entry.fuelFeeCDF || 0);
    const usdPart = Number(entry.primeUSD || 0) + Number(entry.missionFeeUSD || 0);
    return targetCurrency === 'CDF' ? cdfPart + (usdPart * exchangeRate) : usdPart + (cdfPart / exchangeRate);
  };

  const handleRunPayroll = () => {
      setIsProcessing(true);
      setTimeout(() => {
          setIsProcessing(false);
          window.dispatchEvent(new CustomEvent('app-alert', { 
            detail: { title: 'Cycle Terminé', message: 'Le calcul de paie mensuelle a été rafraîchi.', type: 'success' } 
          }));
      }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* MODAL BULLETIN */}
      {selectedEntry && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-[3rem] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100 dark:border-slate-700">
                <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Bulletin de Paie Certifié</h3>
                    <button onClick={()=>setSelectedEntry(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 transition-colors"><X size={24}/></button>
                </div>
                <div className="p-10 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2 mb-4">Flux Francs (CDF)</h4>
                            <div className="flex justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl"><span className="text-xs font-bold">Base</span><span className="font-mono text-sm font-black">{selectedEntry.baseSalaryCDF.toLocaleString()} FC</span></div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2 mb-4">Flux Dollars (USD)</h4>
                            <div className="flex justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl"><span className="text-xs font-bold text-blue-600">Primes</span><span className="font-mono text-sm font-black text-blue-700">{selectedEntry.primeUSD}$</span></div>
                        </div>
                    </div>
                    <div className="mt-12 p-10 bg-slate-900 rounded-[2.5rem] text-white flex justify-between items-center shadow-2xl">
                        <div>
                            <p className="text-[10px] font-black text-blue-400 uppercase mb-2">Net à Payer Consolidé</p>
                            <h3 className="text-5xl font-black">{formatCurrency(getConsolidatedTotal(selectedEntry, 'CDF'), 'CDF')}</h3>
                        </div>
                        <button className="px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 transition-all"><Download size={20}/> Exporter PDF</button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-card border border-slate-50 dark:border-slate-700 flex flex-col xl:flex-row justify-between items-center gap-8">
        <div>
           <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none mb-2">Cycle de Rémunération</h2>
           <p className="text-slate-500 dark:text-slate-400 font-medium">Gestion multi-flux MESP synchronisée (CDF/USD).</p>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
           <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 px-6 py-4 rounded-2xl shadow-inner border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taux: 1$ =</span>
              <input type="number" value={exchangeRate} onChange={e=>setExchangeRate(Number(e.target.value))} className="w-16 bg-transparent font-black text-blue-600 outline-none text-center" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">FC</span>
           </div>
           <button 
              onClick={handleRunPayroll}
              disabled={isProcessing}
              className="bg-slate-900 dark:bg-blue-600 text-white px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 hover:scale-105 transition-all disabled:opacity-50"
           >
               {isProcessing ? <RefreshCw className="animate-spin" size={20}/> : <Calculator size={20}/>}
               Calculer le mois
           </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-card border border-slate-50 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b dark:border-slate-700">
                      <tr>
                          <th className="px-10 py-8">Collaborateur</th>
                          <th className="px-6 py-8">Base (CDF)</th>
                          <th className="px-6 py-8">Primes (USD)</th>
                          <th className="px-6 py-8">Statut</th>
                          <th className="px-6 py-8 text-right">Net CDF</th>
                          <th className="px-10 py-8 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                      {payrollEntries.map(entry => {
                          const emp = MOCK_EMPLOYEES.find(e => e.id === entry.employeeId);
                          return (
                              <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                  <td className="px-10 py-6">
                                      <div className="flex items-center gap-4">
                                          <img src={emp?.avatar} className="w-12 h-12 rounded-2xl object-cover shadow-sm" />
                                          <div><p className="font-black text-slate-800 dark:text-white text-sm leading-none mb-1">{emp?.lastName} {emp?.firstName}</p><p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{entry.month} {entry.year}</p></div>
                                      </div>
                                  </td>
                                  <td className="px-6 py-6 font-mono text-xs text-slate-500">{entry.baseSalaryCDF.toLocaleString()} FC</td>
                                  <td className="px-6 py-6 font-mono text-xs text-blue-600 font-black">{entry.primeUSD || 0} $</td>
                                  <td className="px-6 py-6">
                                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${entry.status === 'Payé' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>{entry.status}</span>
                                  </td>
                                  <td className="px-6 py-6 text-right font-black text-slate-800 dark:text-white text-lg tracking-tighter">{(getConsolidatedTotal(entry, 'CDF')).toLocaleString()} FC</td>
                                  <td className="px-10 py-6 text-right"><button onClick={()=>setSelectedEntry(entry)} className="p-3 bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-blue-600 rounded-xl transition-all"><FileText size={18}/></button></td>
                              </tr>
                          );
                      })}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};
