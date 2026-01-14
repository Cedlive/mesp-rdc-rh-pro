
import React, { useState, useMemo } from 'react';
import { MOCK_MISSIONS, MOCK_EMPLOYEES } from '../constants';
import { Plane, Car, MapPin, Locate, Download, Search, LayoutGrid, Map as MapIcon, Plus, ChevronRight } from 'lucide-react';
import { LiveMap } from '../components/LiveMap';

export const Missions = () => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchTerm, setSearchTerm] = useState('');

  const agentsInMission = useMemo(() => {
    const activeNames = MOCK_MISSIONS.filter(m => m.status === 'En cours').map(m => m.agentName);
    return MOCK_EMPLOYEES.filter(e => activeNames.includes(`${e.firstName} ${e.lastName}`));
  }, []);

  const handleLocate = (agentName: string) => {
    const agent = MOCK_EMPLOYEES.find(e => `${e.firstName} ${e.lastName}` === agentName);
    if (agent && agent.lastLocation) {
        setViewMode('map');
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('map-fly-to', { detail: { lat: agent.lastLocation!.lat, lng: agent.lastLocation!.lng } }));
        }, 200);
    } else {
        alert("Position indisponible pour cet agent.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-card border border-slate-50 dark:border-slate-700 flex flex-col xl:flex-row justify-between items-center gap-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-[100px] opacity-40 translate-x-1/2 -translate-y-1/2"></div>
          <div className="flex items-center gap-8 relative z-10">
              <div className="p-6 bg-slate-900 dark:bg-blue-600 text-white rounded-[2rem] shadow-2xl">
                  <Plane size={48} />
              </div>
              <div>
                  <h1 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Déploiements</h1>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Tracking provincial des agents en mission SEP.</p>
              </div>
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl flex shadow-inner border border-slate-200 dark:border-slate-800">
                <button onClick={() => setViewMode('list')} className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-lg text-blue-600' : 'text-slate-500'}`}><LayoutGrid size={22} /></button>
                <button onClick={() => setViewMode('map')} className={`p-3 rounded-xl transition-all ${viewMode === 'map' ? 'bg-white dark:bg-slate-800 shadow-lg text-blue-600' : 'text-slate-500'}`}><MapIcon size={22} /></button>
            </div>
            <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-2"><Plus size={18}/> Nouvelle Mission</button>
          </div>
      </div>

      {viewMode === 'map' ? (
          <div className="h-[700px] rounded-[3rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-premium">
              <LiveMap employees={agentsInMission} />
          </div>
      ) : (
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-card border border-slate-50 dark:border-slate-700 overflow-hidden">
              <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b dark:border-slate-700">
                      <tr>
                          <th className="px-10 py-6">ID</th>
                          <th className="px-6 py-6">Agent en Mission</th>
                          <th className="px-6 py-6">Destination</th>
                          <th className="px-6 py-6">Période</th>
                          <th className="px-6 py-6">Statut</th>
                          <th className="px-10 py-6 text-right">Action</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                      {MOCK_MISSIONS.map(m => (
                          <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                              <td className="px-10 py-6 font-mono text-sm font-black text-blue-600">#{m.id}</td>
                              <td className="px-6 py-6 font-black text-slate-800 dark:text-white text-xs uppercase">{m.agentName}</td>
                              <td className="px-6 py-6">
                                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase"><MapPin size={14} className="text-red-500"/> {m.destination}</div>
                              </td>
                              <td className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.startDate} au {m.endDate}</td>
                              <td className="px-6 py-6">
                                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${m.status === 'En cours' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-green-50 text-green-700'}`}>{m.status}</span>
                              </td>
                              <td className="px-10 py-6 text-right">
                                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                      {m.status === 'En cours' && <button onClick={() => handleLocate(m.agentName)} className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"><Locate size={18}/></button>}
                                      <button className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Download size={18}/></button>
                                      <button className="p-3 bg-slate-50 dark:bg-slate-700 text-slate-400 rounded-xl hover:bg-slate-200 transition-all"><ChevronRight size={18}/></button>
                                  </div>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      )}
    </div>
  );
};
