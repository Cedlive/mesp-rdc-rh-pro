import React, { useState, useEffect } from 'react';
import { MOCK_EMPLOYEES } from '../constants';
import { Employee } from '../types';
import { Lock, ArrowRight, ShieldCheck, Mail, Eye, EyeOff, Star, Quote, Shield } from 'lucide-react';
/* Fix: Ensure Link is correctly imported from react-router-dom */
import { Link } from 'react-router-dom';

interface LoginProps {
  onLogin: (employee: Employee) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('admin@mesp.cd'); 
  const [password, setPassword] = useState('admin'); 
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Customization from localStorage/State
  const customTitle = localStorage.getItem('mesp_login_title') || 'Mutuelle de Santé des Enseignants';
  const customDesc = localStorage.getItem('mesp_login_desc') || 'La plateforme intégrée de gestion des ressources humaines pour la santé des enseignants.';
  const customBg = localStorage.getItem('mesp_login_bg') || 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80';
  const customLogo = localStorage.getItem('mesp_splash_logo');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const user = MOCK_EMPLOYEES.find(e => 
        (e.email.toLowerCase() === identifier.toLowerCase() || 
         e.firstName.toLowerCase() === identifier.toLowerCase())
      );

      if (user) {
        if (user.password && user.password !== password) {
             setError('Mot de passe incorrect.');
             setLoading(false);
             return;
        }
        if (user.status === 'Inactif') {
            setError('Votre compte est en attente d\'activation par l\'administrateur.');
            setLoading(false);
            return;
        }
        onLogin(user);
      } else {
        setError('Compte introuvable.');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
       {/* Left Side - Professional Branding Area */}
       <div className="hidden lg:flex w-5/12 relative flex-col justify-between overflow-hidden bg-slate-900">
          <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url('${customBg}')` }}></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-slate-900/95 mix-blend-multiply"></div>
          
          <div className="relative z-10 p-12 h-full flex flex-col justify-between">
             <div className="animate-in slide-in-from-top-10 duration-700">
                 <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-8 shadow-2xl overflow-hidden">
                     {customLogo ? <img src={customLogo} className="w-full h-full object-contain p-2" /> : <ShieldCheck size={32} className="text-white" />}
                 </div>
                 <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                    {customTitle.split(' ').slice(0,-1).join(' ')} <span className="text-blue-400">{customTitle.split(' ').slice(-1)}</span>
                 </h2>
                 <p className="text-blue-100 text-lg font-light max-w-sm">
                    {customDesc}
                 </p>
             </div>

             <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transform transition-all hover:bg-white/10 animate-in slide-in-from-bottom-10 duration-1000">
                 <Quote className="text-blue-400 mb-4 opacity-50" size={24} />
                 <p className="text-white text-lg font-medium italic mb-6 leading-relaxed">
                    "La digitalisation de nos processus RH permet un suivi chirurgical des agents sur tout le territoire national."
                 </p>
                 <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-0.5">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" className="w-full h-full rounded-full object-cover border-2 border-slate-900" alt="Avatar"/>
                     </div>
                     <div>
                         <p className="text-white font-bold text-sm">Coordination Générale</p>
                         <p className="text-blue-300 text-xs uppercase tracking-wider font-semibold">Direction Technique</p>
                     </div>
                 </div>
             </div>

             <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                 <p>© 2024 MESP-RDC Enterprise.</p>
                 <div className="flex gap-4">
                     <a href="#" className="hover:text-white transition-colors">Portail Sécurisé</a>
                 </div>
             </div>
          </div>
       </div>

       {/* Right Side - Login Form */}
       <div className="w-full lg:w-7/12 flex items-center justify-center p-8 bg-white relative">
          <div className="w-full max-w-md space-y-10 animate-in slide-in-from-right-8 duration-700">
              <div className="text-center lg:text-left">
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Accès Logiciel 👋</h1>
                  <p className="text-slate-500 mt-2">Authentification requise pour accéder aux services RH.</p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-center gap-3 animate-in fade-in">
                    <div className="w-2 h-2 rounded-full bg-red-600 shrink-0"></div>{error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="space-y-2">
                   <label className="block text-sm font-semibold text-slate-700">Identifiant Agent</label>
                   <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                         <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      </div>
                      <input 
                        type="text" 
                        value={identifier} 
                        onChange={(e) => setIdentifier(e.target.value)} 
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" 
                        placeholder="admin@mesp.cd" 
                        required 
                      />
                   </div>
                 </div>

                 <div className="space-y-2">
                   <div className="flex justify-between items-center">
                       <label className="block text-sm font-semibold text-slate-700">Mot de passe</label>
                       <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">Oublié ?</a>
                   </div>
                   <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                         <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      </div>
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" 
                        placeholder="••••••••" 
                        required 
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none">
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                   </div>
                 </div>

                 <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                 >
                   {loading ? (
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   ) : (
                     <>Déverrouiller le portail <ArrowRight className="ml-2 h-4 w-4" /></>
                   )}
                 </button>
              </form>

              <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                  <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-slate-500 font-medium">Nouveau sur la plateforme ?</span></div>
              </div>
              
              <div className="text-center">
                  <Link to="/register" className="inline-flex items-center justify-center w-full px-6 py-3 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-200 transition-all">
                      S'enregistrer comme Agent
                  </Link>
              </div>
          </div>
       </div>
    </div>
  );
};