
import React, { useState, useMemo } from 'react';
import { MOCK_PAYROLL, MOCK_EMPLOYEES } from '../constants';
import { PayrollEntry } from '../types';
import { formatCurrency } from '../utils';
import { 
  Banknote, Calculator, Search, Download, 
  Truck, Fuel, Stethoscope, Briefcase, Wrench,
  FileText, X, Check, Save, Printer, RefreshCw,
  CheckCircle2, AlertCircle, TrendingUp, History, ShieldCheck
} from 'lucide-react';

export const Payroll = () => {
  const [payrollEntries, setPayrollEntries] = useState<PayrollEntry[]>(MOCK_PAYROLL);
  const [exchangeRate, setExchangeRate] = useState<number>(2500);
  const [selectedEntry, setSelectedEntry] = useState<PayrollEntry | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const getConsolidatedTotal = (entry: PayrollEntry, targetCurrency: 'CDF' | 'USD') => {
    const cdfPart = entry.baseSalaryCDF + (entry.primeCDF || 0) + (entry.fuelFeeCDF || 0) + (entry.maintenanceFeeCDF || 0);
    const usdPart = entry.primeUSD + (entry.missionFeeUSD || 0) + (entry.operatingFeeUSD || 0);
    return targetCurrency === 'CDF' ? cdfPart + (usdPart * exchangeRate) : usdPart + (cdfPart / exchangeRate);
  };

  const currentAgent = selectedEntry ? MOCK_EMPLOYEES.find(e => e.id === selectedEntry.employeeId) : null;

  const handleRunPayrollCycle = () => {
      setIsProcessing(true);
      setTimeout(() => {
          setIsProcessing(false);
          window.dispatchEvent(new CustomEvent('app-alert', { 
              detail: { title: 'Cycle Terminé', message: 'Le calcul de paie mensuelle a été rafraîchi avec le taux actuel.', type: 'success' } 
          }));
      }, 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* MODAL BULLETIN DE PAIE DÉTAILLÉ */}
      {selectedEntry && currentAgent && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-[3rem] w-full max-w-4xl shadow-premium overflow-hidden flex flex-col max-h-[90vh] border border-slate-100 dark:border-slate-700 animate-in zoom-in-95">
                <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-5">
                        <img src={currentAgent.avatar} className="w-16 h-16 rounded-2xl object-cover shadow-xl border-2 border-white dark:border-slate-700" />
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Bulletin de Paie Certifié</h3>
                            <p className="text-xs text-blue-500 font-black uppercase tracking-widest mt-2">{currentAgent.firstName} {currentAgent.lastName} • {selectedEntry.month} {selectedEntry.year}</p>
                        </div>
                    </div>
                    <button onClick={()=>setSelectedEntry(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400"><X size={24}/></button>
                </div>
                
                <div className="p-10 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Gains CDF */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100 dark:border-slate-700 pb-3 mb-6">Flux Francs Congolais (CDF)</h4>
                            {[
                                { label: 'Salaire de Base', val: selectedEntry.baseSalaryCDF },
                                { label: 'Primes Spécifiques', val: selectedEntry.primeCDF },
                                { label: 'Frais Carburant SEP', val: selectedEntry.fuelFeeCDF }
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100/50 dark:border-white/5">
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter">{item.label}</span>
                                    <span className="font-mono text-sm font-black text-slate-800 dark:text-white">{(item.val || 0).toLocaleString()} FC</span>
                                </div>
                            ))}
                        </div>
                        {/* Gains USD */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100 dark:border-slate-700 pb-3 mb-6">Flux Dollars (USD)</h4>
                            {[
                                { label: 'Indemnités Mission', val: selectedEntry.missionFeeUSD },
                                { label: 'Prime de Rendement', val: selectedEntry.primeUSD },
                                { label: 'Frais Opérationnels', val: selectedEntry.operatingFeeUSD }
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-blue-50/40 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-tighter">{item.label}</span>
                                    <span className="font-mono text-sm font-black text-blue-800 dark:text-blue-300">{(item.val || 0).toLocaleString()} $</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 p-10 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700"><ShieldCheck size={180}/></div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-3">Net à Payer (Total Consolidé)</p>
                            <h3 className="text-5xl font-black tracking-tighter tabular-nums">{formatCurrency(getConsolidatedTotal(selectedEntry, 'CDF'), 'CDF')}</h3>
                            <div className="flex items-center gap-4 mt-4">
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg border border-white/10">Taux : 1$ = {exchangeRate} FC</span>
                                <span className="text-[10px] text-green-400 font-black uppercase tracking-widest flex items-center gap-1"><CheckCircle2 size={12}/> Signature Numérique OK</span>
                            </div>
                        </div>
                        <div className="flex gap-4 relative z-10 w-full md:w-auto">
                            <button className="p-5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 text-white"><Printer size={22}/></button>
                            <button className="flex-1 px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 transition-all active:scale-95"><Download size={22}/> Télécharger PDF</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-8 bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-card border border-slate-50 dark:border-slate-700">
        <div className="flex items-center gap-6 shrink-0">
            <div className="p-5 bg-slate-900 dark:bg-blue-600 text-white rounded-[2rem] shadow-2xl shadow-blue-500/40">
                <Banknote size={32} />
            </div>
            <div>
                <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none mb-2">Flux Financiers</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Pilotage de la rémunération multi-devises (CDF/USD).</p>
            </div>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center justify-end w-full lg:w-auto">
           <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 px-6 py-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-inner">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taux MESP : 1 USD =</span>
              <input 
                type="number" 
                value={exchangeRate} 
                onChange={(e) => setExchangeRate(Number(e.target.value))} 
                className="w-20 font-black text-blue-600 bg-transparent outline-none text-center border-b-2 border-blue-200 focus:border-blue-600 transition-all dark:text-blue-400" 
              />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CDF</span>
           </div>

           <button 
              onClick={handleRunPayrollCycle}
              disabled={isProcessing}
              className="bg-slate-900 dark:bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group disabled:opacity-50"
           >
               {isProcessing ? <RefreshCw className="animate-spin" size={20}/> : <Calculator size={20} className="group-hover:rotate-12 transition-transform"/>}
               Générer le Cycle
           </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-card border border-slate-50 dark:border-slate-700 overflow-hidden">
          <div className="p-8 border-b border-slate-50 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/30 flex justify-between items-center">
              <div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Registre Mensuel</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Données synchronisées avec les stations SEP provinciales</p>
              </div>
              <div className="flex gap-4">
                  <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl flex shadow-inner border border-slate-200 dark:border-slate-700">
                    <button className="px-4 py-2 bg-slate-900 dark:bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Aperçu CDF</button>
                    <button className="px-4 py-2 text-slate-400 text-[9px] font-black uppercase tracking-widest">Aperçu USD</button>
                  </div>
              </div>
          </div>
          
          <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] border-b dark:border-slate-700">
                      <tr>
                          <th className="px-10 py-8">Agent MESP / SEP</th>
                          <th className="px-6 py-8">Période</th>
                          <th className="px-6 py-8">Salaire Base (CDF)</th>
                          <th className="px-6 py-8">Total Primes (USD)</th>
                          <th className="px-6 py-8">Status Cycle</th>
                          <th className="px-6 py-8 text-right">Net à Payer (CDF)</th>
                          <th className="px-10 py-8 text-right">Détails</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                      {payrollEntries.map(entry => {
                          const emp = MOCK_EMPLOYEES.find(e => e.id === entry.employeeId);
                          const totalCDF = getConsolidatedTotal(entry, 'CDF');
                          return (
                              <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                  <td className="px-10 py-6">
                                      <div className="flex items-center gap-4">
                                          <img src={emp?.avatar} className="w-12 h-12 rounded-2xl object-cover shadow-lg border border-white dark:border-slate-700 group-hover:scale-105 transition-all" />
                                          <div>
                                              <p className="font-black text-slate-800 dark:text-white text-sm leading-none mb-1 transition-colors group-hover:text-blue-600 uppercase tracking-tight">{emp?.firstName} {emp?.lastName}</p>
                                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{emp?.affiliation || 'MESP Siège'}</p>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="px-6 py-6">
                                      <div className="font-black text-slate-700 dark:text-slate-200 text-xs uppercase">{entry.month}</div>
                                      <div className="text-[10px] text-slate-400 font-bold tracking-widest">{entry.year}</div>
                                  </td>
                                  <td className="px-6 py-6 font-mono text-xs text-slate-500">{entry.baseSalaryCDF.toLocaleString()} FC</td>
                                  <td className="px-6 py-6 font-mono text-xs text-blue-600 dark:text-blue-400 font-black">{entry.primeUSD || 0} $</td>
                                  <td className="px-6 py-6">
                                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${entry.status === 'Payé' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>{entry.status}</span>
                                  </td>
                                  <td className="px-6 py-6 text-right font-black text-slate-800 dark:text-white text-lg tracking-tighter tabular-nums">{totalCDF.toLocaleString()} FC</td>
                                  <td className="px-10 py-6 text-right">
                                      <button 
                                        onClick={() => setSelectedEntry(entry)}
                                        className="p-3 bg-slate-100 dark:bg-slate-900 text-slate-400 hover:text-blue-600 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all shadow-sm"
                                      >
                                        <FileText size={20}/>
                                      </button>
                                  </td>
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
