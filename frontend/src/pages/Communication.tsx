
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MessageCircle, Mail, Network, Search, Send, 
  Paperclip, MoreHorizontal, Image as ImageIcon, 
  Phone, Video, CheckCheck, Star, Clock, ChevronRight, X,
  User, History, PhoneIncoming, PhoneOutgoing, Heart, Plus,
  FileText, Mic, Video as VideoIcon, Music, Palette, Image as ImageIcon2,
  Maximize2, Minimize2, Smile, Settings, Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MOCK_EMPLOYEES } from '../constants';
import { VideoCallModal } from '../components/chat/VideoCallModal';

export const Communication = () => {
  const { currentUser } = useAuth();
  const { chatBackground, setChatBackground } = useTheme();
  const [activeMode, setActiveMode] = useState<'chat' | 'mail' | 'social'>('chat');
  const [selectedContact, setSelectedContact] = useState(MOCK_EMPLOYEES[1]);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');
  const [isThemePanelOpen, setIsThemePanelOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const handleSend = (type: string = 'text', content: string = input) => {
    if (type === 'text' && !content.trim()) return;
    const msg = { 
      id: Date.now(), 
      sender: 'me', 
      type,
      text: type === 'text' ? content : null,
      mediaUrl: type !== 'text' ? content : null,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
      status: 'sent' 
    };
    setMessages([...messages, msg]);
    if (type === 'text') setInput('');
    
    // Auto-reply simulation
    setTimeout(() => {
        setMessages(prev => [...prev, {
            id: Date.now() + 1,
            sender: 'other',
            type: 'text',
            text: "C'est bien reçu. Je vérifie l'information immédiatement.",
            timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            status: 'read'
        }]);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const type = file.type.startsWith('image/') ? 'image' : 
                   file.type.startsWith('video/') ? 'video' : 
                   file.type.startsWith('audio/') ? 'audio' : 'doc';
      handleSend(type, URL.createObjectURL(file));
  };

  const BACKGROUNDS = [
      'https://www.transparenttextures.com/patterns/cubes.png',
      'https://www.transparenttextures.com/patterns/carbon-fibre.png',
      'https://www.transparenttextures.com/patterns/graphy.png',
      'https://www.transparenttextures.com/patterns/subtle-white-feathers.png'
  ];

  return (
    <div className="h-[calc(100vh-8rem)] bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden flex flex-col md:flex-row relative animate-fade-in shadow-premium border border-slate-100 dark:border-slate-800">
      
      <VideoCallModal 
        isOpen={showCall} 
        onClose={() => setShowCall(false)} 
        contactName={`${selectedContact.firstName} ${selectedContact.lastName}`} 
        contactAvatar={selectedContact.avatar}
        type={callType}
      />

      {/* 1. SIDEBAR NAVIGATION - COMPACT & PRO */}
      <div className="w-20 bg-slate-900 flex flex-col items-center py-10 gap-10 shrink-0 z-30 shadow-2xl border-r border-white/5">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black mb-4 shadow-lg shadow-blue-500/20">M</div>
          <div className="flex flex-col gap-6">
            <button onClick={() => setActiveMode('chat')} className={`p-4 rounded-2xl transition-software ${activeMode === 'chat' ? 'bg-blue-600 text-white shadow-xl scale-110' : 'text-slate-500 hover:text-white hover:bg-white/5'}`} title="Messagerie Directe"><MessageCircle size={26} /></button>
            <button onClick={() => setActiveMode('mail')} className={`p-4 rounded-2xl transition-software ${activeMode === 'mail' ? 'bg-blue-600 text-white shadow-xl scale-110' : 'text-slate-500 hover:text-white hover:bg-white/5'}`} title="Courriers Internes"><Mail size={26} /></button>
            <button onClick={() => setActiveMode('social')} className={`p-4 rounded-2xl transition-software ${activeMode === 'social' ? 'bg-blue-600 text-white shadow-xl scale-110' : 'text-slate-500 hover:text-white hover:bg-white/5'}`} title="Feed d'Entreprise"><Network size={26} /></button>
          </div>
          <div className="mt-auto flex flex-col gap-6">
              <button onClick={() => setIsThemePanelOpen(!isThemePanelOpen)} className="p-4 rounded-2xl text-slate-500 hover:text-blue-400 transition-colors"><Palette size={24}/></button>
              <button className="p-4 rounded-2xl text-slate-500 hover:text-white transition-colors"><Settings size={24}/></button>
          </div>
      </div>

      {/* 2. RÉPERTOIRE & LISTE DE CONVERSATIONS */}
      <div className="w-full md:w-[380px] border-r border-slate-100 dark:border-slate-800 flex flex-col bg-white dark:bg-[#0f172a] z-20">
          <div className="p-8 border-b border-slate-50 dark:border-slate-800">
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none">Agents Connect</h2>
                  <button className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:scale-110 transition-all"><Plus size={20}/></button>
              </div>
              <div className="relative group mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 shadow-inner dark:text-white" placeholder="Chercher un agent..." />
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800">
                  <button className="flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white dark:bg-slate-800 text-blue-600 shadow-md">Direct</button>
                  <button className="flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">Groupes</button>
                  <button className="flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">Archives</button>
              </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
              {MOCK_EMPLOYEES.filter(e => e.id !== currentUser?.id).map(emp => (
                  <div 
                    key={emp.id} 
                    onClick={() => setSelectedContact(emp)}
                    className={`flex items-center gap-4 p-5 rounded-[2rem] cursor-pointer transition-software group border-2 ${selectedContact.id === emp.id ? 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm'}`}
                  >
                      <div className="relative flex-shrink-0">
                          <img src={emp.avatar} className="w-14 h-14 rounded-2xl object-cover shadow-lg border-2 border-white dark:border-slate-700" alt="Avatar" />
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white dark:border-slate-900 rounded-full ${emp.status === 'Actif' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                      </div>
                      <div className="min-w-0 flex-1">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <h4 className="font-black text-sm text-slate-800 dark:text-white truncate uppercase tracking-tighter">{emp.lastName}</h4>
                            <span className="text-[9px] font-bold text-slate-400">10:45</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase truncate tracking-widest">{emp.department}</p>
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* 3. CENTRE DE DISCUSSION & WORKSPACE */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#0b0e14] relative">
          
          {/* Panneau de Personnalisation Flottant */}
          {isThemePanelOpen && (
              <div className="absolute top-24 left-10 z-50 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 animate-in slide-in-from-left duration-300 w-64">
                  <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-black uppercase tracking-widest">Fond de chat</h4>
                      <button onClick={() => setIsThemePanelOpen(false)}><X size={14}/></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                      {BACKGROUNDS.map((bg, i) => (
                          <button 
                            key={i} 
                            onClick={() => setChatBackground(bg)}
                            className={`h-16 rounded-xl border-2 transition-all overflow-hidden ${chatBackground === bg ? 'border-blue-600 scale-105 shadow-lg' : 'border-slate-100'}`}
                          >
                              <div className="w-full h-full bg-slate-50" style={{ backgroundImage: `url('${bg}')`, backgroundSize: '20px' }}></div>
                          </button>
                      ))}
                  </div>
              </div>
          )}

          {/* Chat Header */}
          <div className="h-24 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between px-10 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
              <div className="flex items-center gap-6">
                  <div className="relative">
                    <img src={selectedContact.avatar} className="w-16 h-16 rounded-[1.5rem] object-cover shadow-2xl border-2 border-white dark:border-slate-700" />
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full border-2 border-white dark:border-slate-800"><CheckCheck size={10}/></span>
                  </div>
                  <div>
                      <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter leading-none">{selectedContact.firstName} {selectedContact.lastName}</h3>
                      <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{selectedContact.role}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">En ligne</span>
                      </div>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                  <button onClick={() => { setShowCall(true); setCallType('audio'); }} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-software shadow-sm"><Phone size={22} /></button>
                  <button onClick={() => { setShowCall(true); setCallType('video'); }} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-software shadow-sm"><VideoIcon size={22} /></button>
                  <button className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-software"><MoreHorizontal size={22} /></button>
              </div>
          </div>

          {/* Chat Body avec Fond Dynamique */}
          <div ref={chatRef} className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar relative">
              <div className="absolute inset-0 z-0 pointer-events-none chat-bg-pattern dark:invert" style={{ backgroundImage: `url('${chatBackground}')` }}></div>
              
              {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6 relative z-10">
                      <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-[2.5rem] flex items-center justify-center animate-bounce-slow">
                        <MessageCircle size={48}/>
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">Nucleus Secure Chat</h4>
                        <p className="text-xs text-slate-400 font-bold uppercase mt-2 max-w-xs">Toutes les discussions sont chiffrées de bout en bout pour la sécurité de la MESP-RDC.</p>
                      </div>
                  </div>
              )}

              {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 relative z-10`}>
                      <div className={`max-w-[70%] p-6 rounded-[2.5rem] shadow-2xl relative border ${msg.sender === 'me' ? 'bg-blue-600 text-white border-blue-500 rounded-tr-sm shadow-blue-500/20' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-slate-100 dark:border-slate-700 rounded-tl-sm'}`}>
                          
                          {/* Handling different message types */}
                          {msg.type === 'text' && <p className="text-[15px] font-medium leading-relaxed">{msg.text}</p>}
                          
                          {msg.type === 'image' && (
                              <div className="rounded-2xl overflow-hidden mb-2">
                                  <img src={msg.mediaUrl} className="w-full h-auto max-h-80 object-cover cursor-pointer hover:scale-105 transition-transform" />
                              </div>
                          )}

                          {msg.type === 'video' && (
                              <div className="rounded-2xl overflow-hidden mb-2 bg-black aspect-video flex items-center justify-center relative group">
                                  <VideoIcon size={40} className="text-white/50 group-hover:scale-125 transition-transform" />
                                  <div className="absolute inset-0 bg-black/20"></div>
                              </div>
                          )}

                          {msg.type === 'doc' && (
                              <div className="flex items-center gap-4 p-4 bg-slate-900/10 rounded-2xl border border-white/10 mb-2">
                                  <div className="p-3 bg-red-500 rounded-xl text-white shadow-lg"><FileText size={20}/></div>
                                  <div className="flex-1 min-w-0">
                                      <p className="text-xs font-bold truncate">Note_Service_042.pdf</p>
                                      <p className="text-[9px] uppercase font-black opacity-50">Document PDF • 2.4 MB</p>
                                  </div>
                                  <button className="p-2 hover:bg-white/20 rounded-lg transition-colors"><Download size={16}/></button>
                              </div>
                          )}

                          <div className={`mt-4 flex items-center justify-between opacity-50`}>
                              <span className="text-[9px] font-black uppercase tracking-widest">{msg.timestamp}</span>
                              {msg.sender === 'me' && <CheckCheck size={14} className="text-blue-100" />}
                          </div>
                      </div>
                  </div>
              ))}
          </div>

          {/* Chat Controls */}
          <div className="p-10 bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800 z-20">
              <div className="flex items-center gap-6">
                  <div className="flex gap-2">
                    <button onClick={() => fileInputRef.current?.click()} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-blue-600 transition-software border border-transparent hover:border-blue-100"><Paperclip size={24}/></button>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*,video/*,application/pdf" />
                    <button className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-blue-600 transition-software border border-transparent hover:border-blue-100"><Mic size={24}/></button>
                  </div>
                  <div className="flex-1 relative group">
                      <input 
                        value={input} 
                        onChange={e => setInput(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        className="w-full bg-slate-100 dark:bg-slate-950 border-2 border-transparent rounded-[2rem] px-10 py-6 text-[15px] font-bold focus:ring-4 focus:ring-blue-500/10 focus:bg-white dark:focus:bg-black focus:border-blue-500 shadow-inner transition-software outline-none dark:text-white" 
                        placeholder="Tapez votre message ici..." 
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <button onClick={() => setShowEmoji(!showEmoji)} className="p-3 text-slate-400 hover:text-amber-500 transition-colors"><Smile size={24}/></button>
                        <button onClick={() => handleSend()} className="p-4 bg-blue-600 text-white rounded-[1.5rem] shadow-2xl shadow-blue-500/40 hover:bg-blue-500 hover:scale-105 active:scale-90 transition-software"><Send size={22}/></button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
