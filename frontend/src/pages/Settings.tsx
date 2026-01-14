
import React, { useState, useRef, useEffect } from 'react';
import { 
  Monitor, ShieldCheck, Save, User, ShieldAlert, Smartphone, History, 
  Database, Zap, ArrowRight, Shield, CreditCard,
  Building2, Scale, Fingerprint, Activity, Map as MapIcon, 
  Truck, Signal, Gauge, Battery, Search, Filter,
  Navigation2, Satellite, Eye, Lock, Globe, X,
  FileText, Landmark, HeartPulse, Briefcase, Clock, Wallet, Maximize2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MOCK_EMPLOYEES } from '../constants';
import { LoginAttempt, Vehicle, Employee } from '../types';
import { LiveMap } from '../components/LiveMap';

const MOCK_LOGIN_HISTORY: LoginAttempt[] = [
    { id: '1', date: '2023-11-25', time: '14:32', device: 'Chrome v122 (Windows 11)', ip: '197.157.240.12', location: 'Kinshasa, Gombe', status: 'success' },
    { id: '2', date: '2023-11-25', time: '09:15', device: 'MESP Mobile App (Android)', ip: '105.157.2.44', location: 'Lubumbashi, Haut-Katanga', status: 'success' },
    { id: '3', date: '2023-11-24', time: '22:10', device: 'Unknown Browser (Linux)', ip: '102.64.12.55', location: 'Goma, Nord-Kivu', status: 'failed' }
];

const MOCK_VEHICLE: Vehicle = {
    id: 'V-042',
    plate: '0432BG/01',
    model: 'Toyota Land Cruiser V8',
    status: 'En mouvement',
    fuelLevel: 65,
    lastLat: -4.325,
    lastLng: 15.322,
    speed: 45
};

interface SettingsProps {
  currentLogo: string | null;
  onLogoChange: (logo: string | null) => void;
}

export const Settings: React.FC<SettingsProps> = ({ currentLogo, onLogoChange }) => {
  const { currentUser } = useAuth();
  const { mode, toggleMode, primaryColor } = useTheme();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'tracking'>('profile');
  const [filterQuery, setFilterQuery] = useState('');

  const filteredHistory = MOCK_LOGIN_HISTORY.filter(h => 
    h.ip.includes(filterQuery) || h.location.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-premium border border-slate-50 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8">
              <div className="p-6 bg-slate-900 dark:bg-blue-600 text-white rounded-[2rem] shadow-2xl">
                  <Monitor size={42} />
              </div>
              <div>
                <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none">Console Système</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Dossier collaborateur et centre opérationnel de sécurité.</p>
              </div>
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-800/50 p-2 rounded-[2.5rem] shadow-inner border dark:border-slate-800">
              <button onClick={() => setActiveTab('profile')} className={`px-10 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-white dark:bg-slate-900 shadow-xl text-blue-600' : 'text-slate-500'}`}>Mon Dossier</button>
              <button onClick={() => setActiveTab('security')} className={`px-10 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'security' ? 'bg-white dark:bg-slate-900 shadow-xl text-blue-600' : 'text-slate-500'}`}>Sécurité & Audit</button>
              <button onClick={() => setActiveTab('tracking')} className={`px-10 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'tracking' ? 'bg-white dark:bg-slate-900 shadow-xl text-blue-600' : 'text-slate-500'}`}>GPRS & Flotte</button>
          </div>
      </div>

      {activeTab === 'profile' && (
        <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-10">
            <div className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] shadow-premium border border-slate-50 dark:border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none"><User size={400}/></div>
                <div className="flex flex-col lg:flex-row gap-16 relative z-10">
                    <div className="flex flex-col items-center gap-8">
                        <div className="relative group">
                            <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[3.5rem] blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <img src={currentUser?.avatar} className="relative w-48 h-48 rounded-[3rem] object-cover shadow-2xl border-4 border-white dark:border-slate-700" alt="Avatar" />
                            <div className="absolute -bottom-3 -right-3 p-4 bg-blue-600 text-white rounded-2xl shadow-xl border-4 border-white dark:border-slate-900"><ShieldCheck size={20}/></div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{currentUser?.lastName} {currentUser?.firstName}</h3>
                            <p className="text-blue-500 font-black uppercase text-xs tracking-[0.3em] mt-2">{currentUser?.role}</p>
                            <span className="inline-block mt-4 px-4 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-100">Dossier Certifié</span>
                        </div>
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] border-b pb-4 flex items-center gap-2"><Briefcase size={16} className="text-blue-500"/> Informations Professionnelles</h4>
                            <div className="grid grid-cols-1 gap-6">
                                {[
                                    { label: 'Matricule MESP', val: currentUser?.insuranceNumber, icon: Fingerprint },
                                    { label: 'SEP de Rattachement', val: currentUser?.affiliation || 'Kinshasa - Siège', icon: Building2 },
                                    { label: 'Type de Contrat', val: currentUser?.contractType || 'CDI', icon: FileText },
                                    { label: 'Date d\'Entrée', val: currentUser?.joinDate, icon: Clock }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-5 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-transparent hover:border-blue-100 transition-all">
                                        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm text-blue-600"><item.icon size={18}/></div>
                                        <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p><p className="text-sm font-black text-slate-800 dark:text-white uppercase mt-0.5">{item.val}</p></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-8">
                            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] border-b pb-4 flex items-center gap-2"><HeartPulse size={16} className="text-rose-500"/> Données Sociales & Santé</h4>
                            <div className="grid grid-cols-1 gap-6">
                                {[
                                    { label: 'Groupe Sanguin', val: currentUser?.bloodGroup || 'O+', icon: HeartPulse },
                                    { label: 'Numéro CNSS', val: currentUser?.cnssNumber || '2345-6789-0123', icon: Scale },
                                    { label: 'Banque de Paiement', val: currentUser?.bankName || 'Equity BCDC', icon: Landmark },
                                    { label: 'Compte Bancaire', val: currentUser?.bankAccount || '0012 3456 7890 12', icon: Wallet }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-5 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-transparent hover:border-rose-100 transition-all">
                                        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm text-rose-600"><item.icon size={18}/></div>
                                        <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p><p className="text-sm font-black text-slate-800 dark:text-white uppercase mt-0.5">{item.val}</p></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-16 pt-10 border-t border-slate-50 dark:border-slate-800 flex justify-end gap-4">
                    <button className="px-10 py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Exporter Fiche PDF</button>
                    <button className="px-12 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                        <Save size={18}/> Enregistrer les modifications
                    </button>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden h-full flex flex-col justify-between">
                        <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={80} className="text-blue-500"/></div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Noyau Genius 5.1</h3>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed">Infrastructure sécurisée avec chiffrement AES-256. Mode Nucleus hybride actif.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest"><span className="text-slate-500">Version OS</span><span className="text-blue-400">v5.7.0 Stable</span></div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest"><span className="text-slate-500">Dernière MaJ</span><span className="text-blue-400">24/11/2023</span></div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest"><span className="text-slate-500">Statut API</span><span className="text-green-500">Opérationnel</span></div>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-premium border border-slate-50 dark:border-slate-800 flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Audit de Connexion</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Traçabilité complète des accès au compte</p>
                        </div>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                className="pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-500 w-64 shadow-inner dark:text-white" 
                                placeholder="Filtrer par IP ou lieu..." 
                                value={filterQuery}
                                onChange={e => setFilterQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/80 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-4">Horodatage</th>
                                    <th className="px-6 py-4">IP / Géoloc</th>
                                    <th className="px-6 py-4">Terminal</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {filteredHistory.map(log => (
                                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-5 text-[10px] font-black dark:text-white uppercase">{log.date} <span className="text-slate-400 ml-1">@{log.time}</span></td>
                                        <td className="px-6 py-5">
                                            <p className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{log.ip}</p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase">{log.location}</p>
                                        </td>
                                        <td className="px-6 py-5 text-[10px] font-bold text-slate-500 dark:text-slate-400">{log.device}</td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${log.status === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>{log.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'tracking' && (
        <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-8 h-[800px] flex flex-col">
            <div className="flex-1 rounded-[4rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-premium relative">
                <LiveMap employees={MOCK_EMPLOYEES as Employee[]} />
                <div className="absolute top-10 right-10 z-[500] flex flex-col gap-4">
                    <div className="bg-slate-900/95 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-2xl border border-white/10 w-[300px]">
                        <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2"><Satellite size={14}/> Surveillance Satellite</h4>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center text-[11px] font-black text-white uppercase">
                                <span>Flux Véhiculaire Actif</span>
                                <div className="w-10 h-5 bg-blue-600 rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-start mb-3">
                                    <Truck size={20} className="text-blue-500" />
                                    <span className="text-[9px] font-black text-green-500 animate-pulse uppercase tracking-widest">Live: {MOCK_VEHICLE.speed} km/h</span>
                                </div>
                                <p className="text-xs font-black text-white uppercase">{MOCK_VEHICLE.plate}</p>
                                <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">{MOCK_VEHICLE.model}</p>
                                <div className="mt-4 flex justify-between items-center text-[9px] font-black text-slate-400 uppercase">
                                    <span>Carburant SEP</span>
                                    <span className="text-blue-400">{MOCK_VEHICLE.fuelLevel}%</span>
                                </div>
                                <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
                                    <div className="h-full bg-blue-600" style={{ width: `${MOCK_VEHICLE.fuelLevel}%` }}></div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Précision Géodésique</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[95%]"></div></div>
                                    <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">1.2m</span>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all">Télécharger Itinéraire GPRS</button>
                    </div>
                    <div className="bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl p-2 rounded-[2.5rem] shadow-2xl flex flex-col gap-2 pointer-events-auto">
                        <button className="p-5 bg-blue-600 text-white rounded-[2rem] shadow-lg"><Satellite size={24}/></button>
                        <button className="p-5 text-slate-400 hover:text-blue-600 transition-colors"><MapIcon size={24}/></button>
                        <button className="p-5 text-slate-400 hover:text-blue-600 transition-colors"><Maximize2 size={24}/></button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
