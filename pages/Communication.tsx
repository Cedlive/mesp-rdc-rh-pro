
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MOCK_EMPLOYEES, MOCK_CHATS, MOCK_MESSAGES } from '../constants';
import { SocialPost, Message, ChatContact, Employee } from '../types';
import { 
  Search, PenSquare, Image, Send, MoreHorizontal, Heart, MessageCircle, 
  Share2, Phone, Video, Paperclip, Mail, Star, Inbox, Send as SendIcon, 
  Archive, Trash2, User, Menu, X, Plus, FileText, Smile, Check, CheckCheck,
  // Fix: Added Settings to lucide-react imports
  Music, Film, File, Palette, Maximize2, Mic, PhoneOff, VideoOff, Layers, Settings
} from 'lucide-react';

export const Communication = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'social' | 'chat' | 'mail'>('chat');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(MOCK_CHATS[0]?.id || null);
  const [messageInput, setMessageInput] = useState('');
  const [allMessages, setAllMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [chatBg, setChatBg] = useState('bg-slate-50/30');
  const [isCalling, setIsCalling] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulation d'envoi de fichier
  const triggerFileUpload = () => fileInputRef.current?.click();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    let type = 'file';
    if (file.type.startsWith('image/')) type = 'image';
    if (file.type.startsWith('video/')) type = 'video';
    if (file.type.startsWith('audio/')) type = 'audio';

    const newMessage: Message = {
      id: `m_${Date.now()}`,
      senderId: 'me',
      receiverId: selectedChatId || 'global',
      content: `Fichier partagé : ${file.name}`,
      type: type,
      timestamp: new Date(),
      status: 'sent'
    };
    setAllMessages([...allMessages, newMessage]);
    window.dispatchEvent(new CustomEvent('app-alert', { 
        detail: { title: 'Fichier envoyé', message: `${file.name} a été transféré avec succès.`, type: 'success' } 
    }));
  };

  const handleSendMessage = () => {
      if (!messageInput.trim() || !selectedChatId) return;
      const newMessage: Message = {
          id: `m_${Date.now()}`,
          senderId: 'me',
          receiverId: selectedChatId,
          content: messageInput,
          type: 'text',
          timestamp: new Date(),
          status: 'sent'
      };
      setAllMessages([...allMessages, newMessage]);
      setMessageInput('');
  };

  const startCall = (type: 'audio' | 'video') => {
      setCallType(type);
      setIsCalling(true);
  };

  const currentChatMessages = useMemo(() => {
      if (!selectedChatId) return [];
      return allMessages.filter(m => 
          (m.senderId === 'me' && m.receiverId === selectedChatId) ||
          (m.senderId === selectedChatId && m.receiverId === 'me') ||
          (selectedChatId === 'group' && m.receiverId === 'group') 
      ).sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [allMessages, selectedChatId]);

  const selectedContact = MOCK_CHATS.find(c => c.id === selectedChatId);

  return (
    <div className="h-[calc(100vh-10rem)] bg-white dark:bg-slate-900 rounded-[3rem] shadow-premium overflow-hidden flex flex-col md:flex-row border border-slate-100 dark:border-slate-800 animate-fade-in">
       
       {/* Modal Appel (Simulation) */}
       {isCalling && (
           <div className="fixed inset-0 z-[200] bg-slate-900 flex flex-col items-center justify-center text-white animate-in zoom-in duration-300">
               <div className="relative">
                   <div className="w-32 h-32 rounded-full border-4 border-blue-500 p-1 animate-pulse">
                        <img src={selectedContact?.avatar} className="w-full h-full rounded-full object-cover" />
                   </div>
                   {callType === 'video' && <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center"><Video size={40}/></div>}
               </div>
               <h2 className="mt-8 text-2xl font-black">{selectedContact?.name}</h2>
               <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest">Appel {callType === 'video' ? 'Vidéo' : 'Audio'} MESP Secure...</p>
               
               <div className="mt-20 flex gap-10">
                   <button onClick={() => setIsCalling(false)} className="p-6 bg-red-500 rounded-full hover:bg-red-600 transition-all shadow-xl shadow-red-900/40"><PhoneOff size={32}/></button>
                   <button className="p-6 bg-slate-700 rounded-full hover:bg-slate-600 transition-all"><Mic size={32}/></button>
                   {callType === 'video' && <button className="p-6 bg-slate-700 rounded-full hover:bg-slate-600 transition-all"><VideoOff size={32}/></button>}
               </div>
           </div>
       )}

       {/* Sidebar Navigation Mode */}
       <div className="w-full md:w-20 bg-[#0f172a] flex flex-col items-center py-10 gap-10 shrink-0 border-r border-white/5">
           <button onClick={() => setActiveTab('chat')} className={`p-4 rounded-2xl transition-all ${activeTab === 'chat' ? 'bg-blue-600 text-white shadow-xl scale-110' : 'text-slate-500 hover:text-white hover:bg-white/5'}`} title="Discussions"><MessageCircle size={26} /></button>
           <button onClick={() => setActiveTab('mail')} className={`p-4 rounded-2xl transition-all ${activeTab === 'mail' ? 'bg-blue-600 text-white shadow-xl scale-110' : 'text-slate-500 hover:text-white hover:bg-white/5'}`} title="Email Interne"><Mail size={26} /></button>
           <button onClick={() => setActiveTab('social')} className={`p-4 rounded-2xl transition-all ${activeTab === 'social' ? 'bg-blue-600 text-white shadow-xl scale-110' : 'text-slate-500 hover:text-white hover:bg-white/5'}`} title="Feed MESP"><Share2 size={26} /></button>
           <div className="mt-auto flex flex-col gap-6">
                <button onClick={() => setChatBg(prev => prev === 'bg-slate-50/30' ? 'bg-blue-900/10' : 'bg-slate-50/30')} className="p-4 rounded-2xl text-slate-500 hover:text-blue-400" title="Changer Thème Chat"><Palette size={22}/></button>
                <button className="p-4 rounded-2xl text-slate-500 hover:text-white"><Settings size={22}/></button>
           </div>
       </div>

       {activeTab === 'chat' && (
           <>
               <div className="w-full md:w-96 border-r border-slate-100 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900/50">
                   <div className="p-8 border-b border-slate-50 dark:border-slate-800">
                       <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter uppercase mb-6">MESP Connect</h2>
                       <div className="relative group">
                           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                           <input type="text" placeholder="Rechercher un agent..." className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold shadow-inner dark:text-white" />
                       </div>
                   </div>
                   <div className="flex-1 overflow-y-auto p-4 space-y-2">
                       {MOCK_CHATS.map(chat => (
                           <div key={chat.id} onClick={() => setSelectedChatId(chat.id)} className={`flex items-center gap-4 p-5 rounded-[2rem] cursor-pointer transition-all border-2 ${selectedChatId === chat.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-md' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                               <div className="relative">
                                   <img src={chat.avatar} className="w-14 h-14 rounded-2xl object-cover shadow-lg border border-white dark:border-slate-700" />
                                   <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white dark:border-slate-900 rounded-full ${chat.onlineStatus === 'online' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                               </div>
                               <div className="flex-1 min-w-0">
                                   <div className="flex justify-between items-baseline mb-0.5">
                                       <h4 className="text-sm font-black text-slate-800 dark:text-white truncate uppercase tracking-tighter">{chat.name}</h4>
                                       <span className="text-[10px] text-slate-400 font-bold">14:02</span>
                                   </div>
                                   <p className="text-xs text-slate-500 truncate font-medium">{chat.lastMessage}</p>
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
               
               <div className={`flex-1 flex flex-col ${chatBg} relative transition-colors duration-500`}>
                   {selectedChatId ? (
                       <>
                           <div className="h-24 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-10 z-10 shadow-sm">
                               <div className="flex items-center gap-5">
                                   <img src={selectedContact?.avatar} className="w-14 h-14 rounded-2xl object-cover shadow-xl border-2 border-white dark:border-slate-700" />
                                   <div>
                                       <h4 className="font-black text-lg text-slate-800 dark:text-white uppercase tracking-tighter">{selectedContact?.name}</h4>
                                       <p className="text-[10px] text-green-500 font-black uppercase tracking-widest flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Session Sécurisée</p>
                                   </div>
                               </div>
                               <div className="flex gap-4">
                                   <button onClick={() => startCall('audio')} className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white rounded-2xl transition-all shadow-sm"><Phone size={22}/></button>
                                   <button onClick={() => startCall('video')} className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white rounded-2xl transition-all shadow-sm"><Video size={22}/></button>
                                   <button className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl"><MoreHorizontal size={22}/></button>
                               </div>
                           </div>
                           
                           <div className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar">
                               {currentChatMessages.map(msg => (
                                   <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                                       <div className={`max-w-[70%] p-6 rounded-[2.5rem] shadow-premium relative border ${msg.senderId === 'me' ? 'bg-blue-600 text-white border-blue-500 rounded-tr-sm' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-slate-100 dark:border-slate-700 rounded-tl-sm'}`}>
                                           {msg.type === 'text' && <p className="text-sm font-medium leading-relaxed">{msg.content}</p>}
                                           {msg.type === 'image' && (
                                               <div className="space-y-3">
                                                   <div className="w-full h-48 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 overflow-hidden border border-white/20"><Image size={40}/></div>
                                                   <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">{msg.content}</p>
                                               </div>
                                           )}
                                           <div className={`text-[9px] mt-3 flex justify-end items-center gap-2 font-black uppercase tracking-widest ${msg.senderId === 'me' ? 'text-blue-100' : 'text-slate-400'}`}>
                                               {new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                               {msg.senderId === 'me' && <CheckCheck size={12}/>}
                                           </div>
                                       </div>
                                   </div>
                               ))}
                           </div>
                           
                           <div className="p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-10">
                               <div className="flex items-center gap-6">
                                   <div className="flex gap-2">
                                        <button onClick={triggerFileUpload} className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-blue-600 rounded-2xl transition-all shadow-inner"><Paperclip size={24}/></button>
                                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                                        <button className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-blue-600 rounded-2xl transition-all shadow-inner"><Mic size={24}/></button>
                                   </div>
                                   <div className="flex-1 relative group">
                                        <input 
                                            type="text" 
                                            value={messageInput} 
                                            onChange={e => setMessageInput(e.target.value)} 
                                            onKeyDown={e => e.key === 'Enter' && handleSendMessage()} 
                                            placeholder="Tapez un message ou une commande IA..." 
                                            className="w-full bg-slate-100 dark:bg-slate-950 border-2 border-transparent rounded-[2rem] px-8 py-5 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:bg-white dark:focus:bg-black focus:border-blue-500 shadow-inner outline-none dark:text-white transition-all" 
                                        />
                                        <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-amber-500 transition-colors"><Smile size={24}/></button>
                                   </div>
                                   <button onClick={handleSendMessage} className="p-5 bg-blue-600 text-white rounded-[2rem] shadow-2xl shadow-blue-500/30 hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all"><Send size={24}/></button>
                               </div>
                               
                               <div className="mt-6 flex justify-center gap-8 border-t border-slate-50 dark:border-slate-800 pt-4">
                                   {[
                                       { icon: Image, color: 'text-emerald-500', label: 'Média' },
                                       { icon: Film, color: 'text-indigo-500', label: 'Vidéo' },
                                       { icon: File, color: 'text-amber-500', label: 'Docs' },
                                       { icon: Layers, color: 'text-purple-500', label: 'Stickers' }
                                   ].map((m, i) => (
                                       <button key={i} className="flex items-center gap-2 group">
                                           <div className={`p-2 bg-slate-50 dark:bg-slate-800 rounded-lg ${m.color} group-hover:scale-110 transition-transform`}><m.icon size={14}/></div>
                                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-700 dark:group-hover:text-slate-200">{m.label}</span>
                                       </button>
                                   ))}
                               </div>
                           </div>
                       </>
                   ) : (
                       <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                           <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-[2.5rem] flex items-center justify-center mb-8 animate-bounce-slow shadow-xl shadow-blue-500/10">
                               <MessageCircle size={48}/>
                           </div>
                           <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">Nucleus Secure Messaging</h3>
                           <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-sm font-medium">Sélectionnez une conversation pour démarrer une session chiffrée avec vos collaborateurs MESP-RDC.</p>
                       </div>
                   )}
               </div>
           </>
       )}
    </div>
  );
};
