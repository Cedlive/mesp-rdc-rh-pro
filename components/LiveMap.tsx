
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import { Employee } from '../types';
import L from 'leaflet';
import { 
  LocateFixed, Navigation, Signal, SignalHigh, User, 
  Layers, Filter, Target, Activity, 
  Map as MapIcon, Satellite, ShieldCheck, HeartPulse, 
  Calculator, Briefcase, Palmtree, Zap, Eye, EyeOff,
  // Fix: Added Clock and MessageCircle to imports
  Maximize2, Crosshair, RefreshCw, Smartphone, Clock, MessageCircle
} from 'lucide-react';

// Création de marqueurs personnalisés complexes
const createMarkerIcon = (emp: Employee, isPulsing: boolean) => {
    const color = emp.status === 'Actif' ? 'blue' : emp.status === 'Mission' ? 'indigo' : 'slate';
    return L.divIcon({
        className: 'custom-div-icon',
        html: `
            <div class="relative flex items-center justify-center group">
                ${isPulsing ? `<div class="absolute w-14 h-14 rounded-full bg-${color}-500/30 marker-pulse"></div>` : ''}
                <div class="relative w-12 h-12 rounded-2xl bg-${color}-600 border-2 border-white shadow-2xl flex items-center justify-center text-white overflow-hidden transition-all group-hover:scale-110">
                    <img src="${emp.avatar}" class="w-full h-full object-cover" />
                </div>
                <div class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-lg"></div>
                <div class="absolute -bottom-8 bg-slate-900 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-xl">
                    ${emp.lastName}
                </div>
            </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 24]
    });
};

const MapController = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5, easeLinearity: 0.25 });
  }, [center, zoom, map]);

  useEffect(() => {
    const handleFlyTo = (e: any) => {
        const { lat, lng, zoom: targetZoom } = e.detail;
        map.flyTo([lat, lng], targetZoom || 16, { duration: 1.5 });
    };
    window.addEventListener('map-fly-to', handleFlyTo);
    return () => window.removeEventListener('map-fly-to', handleFlyTo);
  }, [map]);

  return null;
};

interface LiveMapProps {
  employees: Employee[];
  currentUser?: Employee | null;
  className?: string;
}

export const LiveMap: React.FC<LiveMapProps> = ({ employees, currentUser, className }) => {
  const [center, setCenter] = useState<[number, number]>([-4.325, 15.322]);
  const [zoom, setZoom] = useState(13);
  const [mapType, setMapType] = useState<'osm' | 'satellite' | 'dark'>('osm');
  const [isSyncing, setIsSyncing] = useState(false);

  const locatedEmployees = employees.filter(e => e.lastLocation?.lat);

  const handleCenterOnMe = () => {
      if (currentUser?.lastLocation) {
          setCenter([currentUser.lastLocation.lat, currentUser.lastLocation.lng]);
          setZoom(17);
      } else {
          setCenter([-4.325, 15.322]); // Fallback Kinshasa
      }
  };

  const handleRefresh = () => {
      setIsSyncing(true);
      setTimeout(() => setIsSyncing(false), 1200);
  };

  return (
    <div className={`relative rounded-[3rem] overflow-hidden shadow-premium border-4 border-white dark:border-slate-800 bg-slate-100 ${className}`} style={{ height: '100%' }}>
        <MapContainer 
            center={center} 
            zoom={zoom} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
        >
            <ZoomControl position="bottomright" />
            
            {mapType === 'osm' && <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />}
            {mapType === 'satellite' && <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution='&copy; Esri' />}
            {mapType === 'dark' && <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />}
            
            <MapController center={center} zoom={zoom} />

            {locatedEmployees.map(emp => {
                return (
                    <Marker 
                        key={emp.id} 
                        position={[emp.lastLocation!.lat, emp.lastLocation!.lng]} 
                        icon={createMarkerIcon(emp, emp.status === 'Actif' || emp.status === 'Mission')}
                    >
                        <Popup className="mesp-custom-popup">
                            <div className="p-4 min-w-[280px] bg-white dark:bg-slate-900 rounded-3xl">
                                <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-50 dark:border-slate-800">
                                    <img src={emp.avatar} className="w-14 h-14 rounded-[1.5rem] object-cover shadow-xl border-2 border-blue-500" alt="Avatar"/>
                                    <div>
                                        <h4 className="font-black text-slate-900 dark:text-white text-base leading-none uppercase tracking-tighter">{emp.lastName} {emp.firstName}</h4>
                                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest mt-1.5">{emp.role}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center">
                                        <Signal size={14} className="text-green-500 mb-1" />
                                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Connecté</span>
                                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Smartphone</span>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center">
                                        <Clock size={14} className="text-blue-500 mb-1" />
                                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Temps réel</span>
                                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{emp.lastLocation?.timestamp}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                                        <Crosshair size={16}/> Lock on Agent
                                    </button>
                                    <button className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                                        <MessageCircle size={16}/> Ouvrir Chat
                                    </button>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>

        {/* --- DOCK DE COMMANDE STRATÉGIQUE --- */}
        <div className="absolute inset-0 pointer-events-none z-[500] p-10 flex flex-col justify-between">
            <div className="flex justify-between items-start">
                {/* Status Panel */}
                <div className="bg-slate-900/95 backdrop-blur-2xl p-8 rounded-[3rem] shadow-premium border border-white/10 flex items-center gap-8 pointer-events-auto group hover:scale-[1.02] transition-all duration-500">
                    <div className="p-5 bg-blue-600 text-white rounded-[1.5rem] shadow-2xl shadow-blue-500/40 relative overflow-hidden">
                        <Activity size={32} className="relative z-10 animate-pulse"/>
                        <div className="absolute inset-0 bg-white/20 animate-ping opacity-20"></div>
                    </div>
                    <div>
                        <p className="text-[11px] font-black text-blue-400 uppercase tracking-[0.4em] mb-1">MESP Operational Hub</p>
                        <p className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
                            {locatedEmployees.length} Agents <span className="text-slate-500 font-normal">Actifs</span>
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                            <span className="flex items-center gap-1.5 text-[9px] font-black text-green-500 uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Sync Native
                            </span>
                            <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                <ShieldCheck size={12}/> Secure 256-bit
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Controls */}
                <div className="flex flex-col gap-6 pointer-events-auto">
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-2.5 rounded-[2.5rem] shadow-premium border border-white/10 flex flex-col gap-2">
                        <button onClick={handleCenterOnMe} className="p-5 hover:bg-blue-600 hover:text-white rounded-[2rem] transition-all text-blue-600" title="Ma Position"><LocateFixed size={28}/></button>
                        <div className="h-px bg-slate-100 dark:bg-slate-800 mx-4"></div>
                        <button onClick={handleRefresh} className={`p-5 hover:bg-blue-600 hover:text-white rounded-[2rem] transition-all text-slate-500 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} title="Rafraîchir Flux GPS"><RefreshCw size={28}/></button>
                    </div>

                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-2.5 rounded-[2.5rem] shadow-premium border border-white/10 flex flex-col gap-2">
                        <button onClick={() => setMapType('osm')} className={`p-5 rounded-[2rem] transition-all ${mapType === 'osm' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`} title="Standard Map"><MapIcon size={28}/></button>
                        <button onClick={() => setMapType('satellite')} className={`p-5 rounded-[2rem] transition-all ${mapType === 'satellite' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`} title="Satellite View"><Satellite size={28}/></button>
                        <button onClick={() => setMapType('dark')} className={`p-5 rounded-[2rem] transition-all ${mapType === 'dark' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`} title="Night Ops"><Zap size={28}/></button>
                    </div>
                </div>
            </div>

            {/* Bottom Legend Dock */}
            <div className="flex justify-center">
                <div className="bg-slate-900/95 backdrop-blur-3xl px-16 py-7 rounded-[4rem] shadow-premium border border-white/10 flex items-center gap-16 pointer-events-auto">
                    {[
                        { label: 'En Poste (Actif)', color: 'bg-green-500', count: locatedEmployees.filter(e => e.status === 'Actif').length },
                        { label: 'Déployé (Mission)', color: 'bg-indigo-500', count: locatedEmployees.filter(e => e.status === 'Mission').length },
                        { label: 'Hors Ligne / Inactif', color: 'bg-slate-500', count: employees.length - locatedEmployees.length }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-5 group cursor-help">
                            <div className={`w-4 h-4 rounded-full ${item.color} shadow-lg ring-4 ring-white/5 transition-transform group-hover:scale-125`}></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] leading-none mb-2">{item.label}</span>
                                <span className="text-2xl font-black text-white leading-none tracking-tighter">{item.count} <span className="text-xs text-slate-600 font-medium">unités</span></span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};
