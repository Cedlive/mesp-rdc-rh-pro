import React, { useState, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, LineChart, Line,
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  Download, Terminal, Copy, Check, ShieldCheck, 
  Database, Zap, FileImage, RefreshCw 
} from 'lucide-react';
import { toPng } from 'html-to-image';

const headcountData = [
  { name: 'RH', hommes: 4, femmes: 6 }, 
  { name: 'Finance', hommes: 5, femmes: 3 }, 
  { name: 'IT', hommes: 8, femmes: 2 }, 
  { name: 'Médical', hommes: 10, femmes: 15 }, 
  { name: 'Technique', hommes: 12, femmes: 1 }
];

const performanceData = [
  { name: 'Q1', avgScore: 75 }, 
  { name: 'Q2', avgScore: 82 }, 
  { name: 'Q3', avgScore: 88 }, 
  { name: 'Q4', avgScore: 85 }
];

const expenseCategoryData = [
  { name: 'Soins Médicaux', value: 12500, color: '#10b981' },
  { name: 'Primes Mission', value: 8400, color: '#3b82f6' },
  { name: 'Carburant', value: 4200, color: '#f59e0b' },
  { name: 'Logistique', value: 3100, color: '#8b5cf6' },
  { name: 'Fournitures', value: 1800, color: '#ec4899' }
];

export const Analytics = () => {
  const [showMCode, setShowMCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const expenseChartRef = useRef<HTMLDivElement>(null);

  const token = localStorage.getItem('mesp_auth_token') || "JWT_MOCK_123456";
  const apiHost = window.location.hostname === 'localhost' ? 'http://localhost:5001' : `http://${window.location.hostname}:5001`;

  const powerBIMCode = `let
    // Script de liaison sécurisée MESP-RDC
    url = "${apiHost}/api/v1/employees?token=${token}",
    Source = Json.Document(Web.Contents(url)),
    #"Converti en Table" = Table.FromList(Source, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    #"Colonnes Développées" = Table.ExpandRecordColumn(#"Converti en Table", "Column1", 
        {"id", "firstName", "lastName", "role", "department", "status"}, 
        {"ID_Agent", "Prénom", "Nom", "Fonction", "Direction", "Statut"}
    )
in
    #"Colonnes Développées"`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(powerBIMCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadExpenseChart = async () => {
    if (expenseChartRef.current === null) return;
    
    setIsExporting(true);
    try {
      const dataUrl = await toPng(expenseChartRef.current, { 
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        style: {
          padding: '20px'
        }
      });
      const link = document.createElement('a');
      link.download = `mesp-rdc-analytics-depenses-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
      
      window.dispatchEvent(new CustomEvent('app-alert', { 
        detail: { title: 'Export réussi', message: 'Le graphique des dépenses a été exporté en PNG.', type: 'success' } 
      }));
    } catch (err) {
      console.error('Erreur exportation graphique:', err);
      window.dispatchEvent(new CustomEvent('app-alert', { 
        detail: { title: 'Erreur Export', message: 'Échec de la génération du fichier PNG.', type: 'error' } 
      }));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-card border border-slate-50 dark:border-slate-700">
        <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">Intelligence BI & Big Data</h2>
            <p className="text-slate-500 flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> 
                Passerelle API active : Prêt pour Power BI Desktop
            </p>
        </div>
        <div className="flex gap-3">
           <button 
                onClick={() => setShowMCode(!showMCode)}
                className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 flex items-center gap-2 shadow-xl transition-all"
            >
                <Terminal size={18} /> {showMCode ? 'Fermer Console' : 'Générer Code M'}
           </button>
           <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 flex items-center gap-2 shadow-xl transition-all hover:-translate-y-0.5">
               <Download size={18} /> Rapports PDF
           </button>
        </div>
      </div>

      {showMCode && (
          <div className="bg-slate-950 rounded-3xl p-8 border border-blue-500/20 animate-in zoom-in-95 duration-300 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                      <h3 className="text-blue-400 font-black uppercase text-xs tracking-widest mb-1 flex items-center gap-2"><Zap size={14} /> Script Power Query (M)</h3>
                      <p className="text-slate-400 text-xs">Copiez ce code dans Power BI : "Obtenir les données" {' > '} "Requête Vide" {' > '} "Éditeur Avancé".</p>
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all flex items-center gap-2 text-xs font-bold border border-white/5"
                  >
                    {copied ? <Check size={16} className="text-green-400"/> : <Copy size={16}/>}
                    {copied ? 'Copié !' : 'Copier le script'}
                  </button>
              </div>
              <pre className="bg-black/50 p-6 rounded-2xl text-blue-300 font-mono text-[11px] overflow-x-auto border border-white/5 leading-loose">
                  {powerBIMCode}
              </pre>
              <div className="mt-6 flex items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest relative z-10">
                  <div className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-green-500"/> Liaison Chiffrée</div>
                  <div className="flex items-center gap-1.5"><Database size={12} className="text-blue-500"/> Connecteur MongoDB Local/Cloud</div>
              </div>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-card border border-slate-50 dark:border-slate-700 flex flex-col h-full">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-widest border-b-2 border-emerald-500 pb-1 inline-block">Répartition des Dépenses</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Ventilation mensuelle par catégorie (USD)</p>
                </div>
                <button 
                    onClick={downloadExpenseChart}
                    disabled={isExporting}
                    className="p-3 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-2 group disabled:opacity-50"
                    title="Télécharger en PNG"
                >
                    {isExporting ? <RefreshCw className="animate-spin" size={18}/> : <FileImage size={18} className="group-hover:scale-110 transition-transform" />}
                    <span className="text-[10px] font-black uppercase hidden sm:inline">Exporter PNG</span>
                </button>
            </div>
            
            <div ref={expenseChartRef} className="flex-1 min-h-[300px] w-full p-4 bg-white dark:bg-slate-800 rounded-2xl">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={expenseCategoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={8}
                            dataKey="value"
                        >
                            {expenseCategoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px'}} 
                        />
                        <Legend 
                            verticalAlign="bottom" 
                            align="center"
                            iconType="circle"
                            formatter={(value) => <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-card border border-slate-50 dark:border-slate-700 flex flex-col h-full">
            <h3 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-widest mb-8 border-b-2 border-blue-500 pb-1 inline-block w-fit">Indice de Performance Globale</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} />
                  <YAxis domain={[0, 100]} axisLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)'}} />
                  <Line type="monotone" dataKey="avgScore" name="Score" stroke="#10b981" strokeWidth={5} dot={{r: 6, fill: '#10b981', strokeWidth: 3, stroke: '#fff'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
         </div>

         <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-card border border-slate-50 dark:border-slate-700">
            <h3 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-widest mb-8 border-b-2 border-purple-500 pb-1 inline-block">Répartition Effective par Service</h3>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={headcountData}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.1}/>
                        <XAxis dataKey="name" axisLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} />
                        <YAxis axisLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} />
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)'}} cursor={{fill: 'transparent'}} />
                        <Legend iconType="rect" formatter={(value) => <span className="text-[10px] font-bold uppercase tracking-widest">{value}</span>} />
                        <Bar dataKey="hommes" name="H" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                        <Bar dataKey="femmes" name="F" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
         </div>
      </div>
    </div>
  );
};
