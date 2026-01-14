import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Bell, Search, ChevronDown, CheckCircle, Menu, Wifi, WifiOff } from 'lucide-react';
/* Fix: Ensure useLocation is correctly imported from react-router-dom */
import { useLocation } from 'react-router-dom';
import { MOCK_EMPLOYEES } from '../constants';
import { Employee } from '../types';
import { AIAssistant } from './AIAssistant';

interface LayoutProps {
  children: React.ReactNode;
  companyLogo?: string | null;
  currentUser?: Employee | null;
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, companyLogo, currentUser, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCompact, setIsSidebarCompact] = useState(() => {
    const saved = localStorage.getItem('mesp_sidebar_compact');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const location = useLocation();
  
  // REAL-TIME GEOLOCATION ENGINE
  useEffect(() => {
    if (!currentUser || currentUser.status === 'Inactif' || !navigator.geolocation) return;

    const trackingEnabled = localStorage.getItem(`mesp_geo_tracking_${currentUser.id}`) === 'true';
    if (!trackingEnabled) return;

    const options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const emp = MOCK_EMPLOYEES.find(e => e.id === currentUser.id);
        if (emp) {
          emp.lastLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: new Date().toLocaleTimeString(),
            address: 'Position Live Active',
            signalStrength: position.coords.accuracy < 20 ? 'strong' : 'medium'
          };
          window.dispatchEvent(new CustomEvent('geo-update'));
        }
      },
      (error) => console.warn('GPS MESP:', error.message),
      options
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [currentUser]);

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800">
      <Sidebar 
        companyLogo={companyLogo || null} 
        currentUser={currentUser} 
        onLogout={onLogout} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        isCompact={isSidebarCompact}
        toggleCompact={() => setIsSidebarCompact(!isSidebarCompact)}
      />
      
      <AIAssistant />

      <div className={`flex flex-col min-h-screen transition-all duration-300 ${isSidebarCompact ? 'md:ml-20' : 'md:ml-64'}`}>
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
             <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
                <Menu size={24} />
             </button>
             <h2 className="font-black text-lg text-slate-800 tracking-tighter uppercase truncate">
                MESP-RDC <span className="text-blue-600">RH Suite</span>
             </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
              <span className="text-[10px] font-black uppercase text-slate-500">{isOnline ? 'Serveur Actif' : 'Mode Local'}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-lg border border-white">
               {currentUser?.firstName[0]}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};