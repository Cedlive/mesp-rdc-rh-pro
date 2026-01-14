
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Share, Grid, Settings } from 'lucide-react';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactName: string;
  contactAvatar: string;
  type: 'audio' | 'video';
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({ isOpen, onClose, contactName, contactAvatar, type }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(type === 'audio');
  const [duration, setDuration] = useState(0);
  
  useEffect(() => {
    let timer: any;
    if (isOpen) {
      setDuration(0);
      timer = setInterval(() => setDuration(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col animate-in fade-in duration-300">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20 bg-gradient-to-b from-black/60 to-transparent h-32">
            <div className="flex items-center gap-3">
                <div className="bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2 shadow-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                    <span className="text-white font-mono font-bold tracking-widest">{formatTime(duration)}</span>
                </div>
            </div>
            <div className="flex gap-2">
                <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-md"><Grid size={20}/></button>
                <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-md"><Settings size={20}/></button>
            </div>
        </div>

        {/* Main Video Area */}
        <div className="flex-1 relative bg-slate-900 flex items-center justify-center overflow-hidden">
            {/* Background Blur Effect */}
            <div className="absolute inset-0 z-0">
                <img src={contactAvatar} className="w-full h-full object-cover opacity-30 blur-3xl scale-110" />
            </div>

            {/* Remote Stream */}
            <div className="relative z-10 w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 mx-4">
                {!isVideoOff ? (
                    <img 
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
                        className="w-full h-full object-cover"
                        alt="Remote"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800">
                        <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-purple-600 mb-4">
                            <img src={contactAvatar} className="w-full h-full rounded-full object-cover border-4 border-slate-800" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">{contactName}</h2>
                        <p className="text-slate-400 mt-2 animate-pulse">{type === 'audio' ? 'Appel Audio en cours...' : 'Caméra désactivée'}</p>
                    </div>
                )}
                
                {/* Name Label */}
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-white text-sm font-medium">
                    {contactName}
                </div>
            </div>

            {/* Local Stream (PiP) */}
            {!isVideoOff && (
                <div className="absolute bottom-24 right-8 w-48 aspect-video bg-slate-800 rounded-xl border-2 border-slate-700 shadow-2xl overflow-hidden hidden md:block z-20 hover:scale-105 transition-transform cursor-pointer">
                     <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover transform scale-x-[-1]" />
                     <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white">Vous</div>
                </div>
            )}
        </div>

        {/* Control Bar (Dock Style) */}
        <div className="h-24 bg-slate-900 border-t border-slate-800 flex items-center justify-center z-30">
            <div className="flex items-center gap-4 bg-slate-800/80 backdrop-blur-xl px-8 py-4 rounded-2xl border border-white/5 shadow-2xl transform -translate-y-4">
                <button 
                    onClick={() => setIsMuted(!isMuted)} 
                    className={`p-4 rounded-full transition-all ${isMuted ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
                    title={isMuted ? "Activer micro" : "Couper micro"}
                >
                    {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </button>
                
                <button 
                    onClick={() => setIsVideoOff(!isVideoOff)} 
                    className={`p-4 rounded-full transition-all ${isVideoOff ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
                    title={isVideoOff ? "Activer caméra" : "Couper caméra"}
                >
                    {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                </button>

                <button className="p-4 rounded-full bg-slate-700 text-white hover:bg-slate-600 hidden sm:block" title="Partager l'écran">
                    <Share size={24} />
                </button>

                <button 
                    onClick={onClose} 
                    className="px-8 py-4 rounded-full bg-red-600 text-white hover:bg-red-700 transform hover:scale-105 transition-all shadow-xl shadow-red-600/40 font-bold flex items-center gap-2"
                >
                    <PhoneOff size={24} /> <span className="hidden sm:inline">Raccrocher</span>
                </button>
            </div>
        </div>
    </div>
  );
};
