
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import { Employee } from '../types';
import L from 'leaflet';
import { 
  LocateFixed, Navigation, Signal, SignalHigh, User, 
  Layers, Filter, Target, Activity, 
  Map as MapIcon, Satellite, ShieldCheck, HeartPulse, 
  Calculator, Briefcase, Palmtree, Zap, Eye, EyeOff,
  // Fix: Added Clock to imports
  Maximize2, Crosshair, RefreshCw, Clock
} from 'lucide-react';

// Création de marqueurs personnalisés avec effet pulsé
const createMarkerIcon = (color: string, isPulsing: boolean) => {
    return L.divIcon({
        className: 'custom-div-icon',
        html: `
            <div class="relative flex items-center justify-center">
                ${isPulsing ? `<div class="absolute w-12 h-12 rounded-full bg-${color}-500/40 marker-pulse"></div>` : ''}
                <div class="relative w-10 h-10 rounded-2xl bg-${color}-600 border-2 border-white shadow-2xl flex items-center justify-center text-white overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=Agent&background=transparent&color=fff" class="w-full h-full object-cover" />
                </div>
                <div class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
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
                const color = emp.status === 'Actif' ? 'blue' : emp.status === 'Mission' ? 'indigo' : 'slate';
                return (
                    <Marker 
                        key={emp.id} 
                        position={[emp.lastLocation!.lat, emp.lastLocation!.lng]} 
                        icon={createMarkerIcon(color, emp.status === 'Actif')}
                    >
                        <Popup className="mesp-custom-popup">
                            <div className="p-4 min-w-[240px]">
                                <div className="flex items-center gap-4 mb-4">
                                    <img src={emp.avatar} className="w-12 h-12 rounded-xl object-cover shadow-lg border-2 border-blue-500" alt="Avatar"/>
                                    <div>
                                        <h4 className="font-black text-slate-900 text-sm leading-none">{emp.lastName}</h4>
                                        <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1">{emp.role}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col items-center">
                                        <Signal size={12} className="text-green-500 mb-1" />
                                        <span className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">Signal</span>
                                        <span className="text-[10px] font-bold text-slate-700">Excellent</span>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col items-center">
                                        <Clock size={12} className="text-blue-500 mb-1" />
                                        <span className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">Dernière MaJ</span>
                                        <span className="text-[10px] font-bold text-slate-700">{emp.lastLocation?.timestamp}</span>
                                    </div>
                                </div>
                                <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                                    <Crosshair size={14}/> Recentrer Tracker
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>

        {/* --- DOCK DE COMMANDE HAUTE RÉSOLUTION --- */}
        <div className="absolute inset-0 pointer-events-none z-[500] p-10 flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div className="bg-slate-900/90 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-2xl border border-white/10 flex items-center gap-6 pointer-events-auto group hover:scale-105 transition-software">
                    <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl">
                        <Activity size={28} className="animate-pulse"/>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">Surveillance Opérationnelle</p>
                        <p className="text-2xl font-black text-white tracking-tighter">{locatedEmployees.length} AGENTS <span className="text-slate-400 font-normal">TRACKÉS</span></p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 pointer-events-auto">
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-2 rounded-[2rem] shadow-2xl border border-white/10 flex flex-col gap-2">
                        <button onClick={handleCenterOnMe} className="p-4 hover:bg-blue-600 hover:text-white rounded-2xl transition-software text-blue-600" title="Ma Position"><LocateFixed size={26}/></button>
                        <div className="h-px bg-slate-100 dark:bg-slate-800 mx-3"></div>
                        <button onClick={handleRefresh} className={`p-4 hover:bg-blue-600 hover:text-white rounded-2xl transition-software text-slate-500 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} title="Rafraîchir Flux GPS"><RefreshCw size={26}/></button>
                    </div>

                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-2 rounded-[2rem] shadow-2xl border border-white/10 flex flex-col gap-2">
                        <button onClick={() => setMapType('osm')} className={`p-4 rounded-2xl transition-software ${mapType === 'osm' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><MapIcon size={26}/></button>
                        <button onClick={() => setMapType('satellite')} className={`p-4 rounded-2xl transition-software ${mapType === 'satellite' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><Satellite size={26}/></button>
                        <button onClick={() => setMapType('dark')} className={`p-4 rounded-2xl transition-software ${mapType === 'dark' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}><Zap size={26}/></button>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="bg-slate-900/90 backdrop-blur-2xl px-12 py-6 rounded-[3rem] shadow-2xl border border-white/10 flex items-center gap-12 pointer-events-auto">
                    {[
                        { label: 'En Poste', color: 'bg-green-500', count: locatedEmployees.filter(e => e.status === 'Actif').length },
                        { label: 'En Mission', color: 'bg-indigo-500', count: locatedEmployees.filter(e => e.status === 'Mission').length },
                        { label: 'Hors Ligne', color: 'bg-slate-500', count: employees.length - locatedEmployees.length }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                            <div className={`w-3 h-3 rounded-full ${item.color} shadow-lg ring-4 ring-white/5`}></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest leading-none mb-1">{item.label}</span>
                                <span className="text-lg font-black text-white leading-none">{item.count}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};
