import React, { useState } from 'react';
import { MOCK_EMPLOYEES } from '../constants';
import { Employee } from '../types';
import { Lock, User, ArrowRight, ShieldCheck, Mail, Eye, EyeOff, Palette, Image as ImageIcon, Type, X, Check } from 'lucide-react';
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

  // Customization State
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [themeColor, setThemeColor] = useState('blue'); // blue, purple, emerald
  const [bgImage, setBgImage] = useState('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80');
  const [welcomeTitle, setWelcomeTitle] = useState('Mutuelle de Santé des Enseignants');
  const [welcomeMsg, setWelcomeMsg] = useState('Gérez vos ressources humaines, la paie et l\'administration avec notre suite d\'outils sécurisée et performante.');

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
            setError('Compte en attente d\'activation.');
            setLoading(false);
            return;
        }
        onLogin(user);
      } else {
        setError('Compte introuvable.');
      }
      setLoading(false);
    }, 1200);
  };

  const getColorClass = (type: 'bg' | 'text' | 'ring') => {
      if (type === 'bg') return themeColor === 'purple' ? 'bg-purple-600' : themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-blue-600';
      if (type === 'text') return themeColor === 'purple' ? 'text-purple-600' : themeColor === 'emerald' ? 'text-emerald-600' : 'text-blue-600';
      if (type === 'ring') return themeColor === 'purple' ? 'focus:ring-purple-500' : themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-blue-500';
      return '';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
       
       {/* THEME CUSTOMIZER DRAWER */}
       <div className={`fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 border-r border-slate-100 ${showCustomizer ? 'translate-x-0' : '-translate-x-full'}`}>
           <div className="p-6 h-full flex flex-col overflow-y-auto">
               <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Palette size={18}/> Personnaliser</h3>
                   <button onClick={() => setShowCustomizer(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={18}/></button>
               </div>
               
               <div className="space-y-6">
                   <div>
                       <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Couleur Principale</label>
                       <div className="flex gap-3">
                           {['blue', 'purple', 'emerald'].map(c => (
                               <button 
                                key={c} 
                                onClick={() => setThemeColor(c)}
                                className={`w-8 h-8 rounded-full border-2 ${themeColor === c ? 'border-slate-800 scale-110' : 'border-transparent'} ${c === 'blue' ? 'bg-blue-600' : c === 'purple' ? 'bg-purple-600' : 'bg-emerald-600'} transition-all`}
                               />
                           ))}
                       </div>
                   </div>

                   <div>
                       <label className="text-xs font-bold text-slate-500 uppercase mb-3 block flex items-center gap-2"><ImageIcon size={14}/> Image de fond</label>
                       <div className="grid grid-cols-2 gap-2">
                           <img onClick={() => setBgImage('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80')} src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60" className={`h-16 w-full object-cover rounded-lg cursor-pointer border-2 ${bgImage.includes('1497366') ? 'border-blue-500' : 'border-transparent'}`} />
                           <img onClick={() => setBgImage('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')} src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60" className={`h-16 w-full object-cover rounded-lg cursor-pointer border-2 ${bgImage.includes('1486406') ? 'border-blue-500' : 'border-transparent'}`} />
                           <img onClick={() => setBgImage('https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')} src="https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60" className={`h-16 w-full object-cover rounded-lg cursor-pointer border-2 ${bgImage.includes('1554200') ? 'border-blue-500' : 'border-transparent'}`} />
                           <div className="h-16 bg-slate-800 rounded-lg flex items-center justify-center text-xs text-white cursor-pointer" onClick={() => alert("Upload custom image...")}>Upload</div>
                       </div>
                   </div>

                   <div>
                       <label className="text-xs font-bold text-slate-500 uppercase mb-3 block flex items-center gap-2"><Type size={14}/> Contenu</label>
                       <input className="w-full text-sm border rounded mb-2 p-2" value={welcomeTitle} onChange={e => setWelcomeTitle(e.target.value)} />
                       <textarea className="w-full text-sm border rounded p-2 h-24" value={welcomeMsg} onChange={e => setWelcomeMsg(e.target.value)} />
                   </div>
               </div>
               
               <div className="mt-auto pt-6">
                   <button onClick={() => setShowCustomizer(false)} className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                       <Check size={16} /> Appliquer
                   </button>
               </div>
           </div>
       </div>

       {/* Left Side - Visual / Branding */}
       <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden transition-all duration-500">
          <div className="absolute inset-0">
             <div className={`absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full blur-[150px] opacity-40 transition-colors duration-500 ${themeColor === 'purple' ? 'bg-purple-600' : themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-blue-600'}`}></div>
             <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-20 transition-all duration-500" style={{ backgroundImage: `url('${bgImage}')` }}></div>
          </div>
          
          <button 
            onClick={() => setShowCustomizer(true)}
            className="absolute top-6 left-6 p-2 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full text-white z-50 transition-all"
            title="Personnaliser l'apparence"
          >
              <Palette size={20} />
          </button>

          <div className="relative z-10 px-12 text-center max-w-xl">
             <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-8 mx-auto shadow-xl animate-in zoom-in duration-700">
                 <ShieldCheck size={40} className="text-white" />
             </div>
             <h2 className="text-4xl font-bold text-white mb-6 leading-tight drop-shadow-lg">{welcomeTitle}</h2>
             <p className="text-blue-50 text-lg leading-relaxed max-w-md mx-auto font-light drop-shadow-md">
                {welcomeMsg}
             </p>
             <div className="mt-12 flex justify-center gap-4">
                 <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10 shadow-lg hover:bg-white/20 transition-all transform hover:-translate-y-1">
                    <p className="text-3xl font-bold text-white">5k+</p>
                    <p className="text-xs text-blue-100 uppercase tracking-wider font-medium">Membres</p>
                 </div>
                 <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10 shadow-lg hover:bg-white/20 transition-all transform hover:-translate-y-1">
                    <p className="text-3xl font-bold text-white">99%</p>
                    <p className="text-xs text-blue-100 uppercase tracking-wider font-medium">Satisfaction</p>
                 </div>
             </div>
          </div>
          
          <div className="absolute bottom-6 w-full text-center">
             <p className="text-xs text-slate-400 font-medium">© 2024 MESP-RDC Enterprise Portal</p>
          </div>
       </div>

       {/* Right Side - Form */}
       <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
          <div className="w-full max-w-md space-y-8 animate-in slide-in-from-right-10 duration-700">
              <div className="text-center lg:text-left">
                  <h1 className="text-3xl font-bold text-slate-900">Connexion</h1>
                  <p className="text-slate-500 mt-2">Accédez à votre espace de travail personnel.</p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-center gap-3 animate-in fade-in">
                    <div className="w-2 h-2 rounded-full bg-red-600"></div>{error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="space-y-2">
                   <label className="block text-sm font-semibold text-slate-700">Email ou Identifiant</label>
                   <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                         <Mail className={`h-5 w-5 text-slate-400 group-focus-within:${getColorClass('text')} transition-colors`} />
                      </div>
                      <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-opacity-20 focus:border-transparent transition-all ${getColorClass('ring')}`} placeholder="exemple@mesp.cd" required />
                   </div>
                 </div>

                 <div className="space-y-2">
                   <div className="flex justify-between items-center">
                       <label className="block text-sm font-semibold text-slate-700">Mot de passe</label>
                       <a href="#" className={`text-sm font-medium hover:underline ${getColorClass('text')}`}>Oublié ?</a>
                   </div>
                   <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                         <Lock className={`h-5 w-5 text-slate-400 group-focus-within:${getColorClass('text')} transition-colors`} />
                      </div>
                      <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className={`block w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-opacity-20 focus:border-transparent transition-all ${getColorClass('ring')}`} placeholder="••••••••" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
                   </div>
                 </div>

                 <button type="submit" disabled={loading} className={`w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed ${getColorClass('bg')} hover:opacity-90 ${getColorClass('ring')}`}>
                   {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Accéder au portail <ArrowRight className="ml-2 h-4 w-4" /></>}
                 </button>
              </form>

              <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div><div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-slate-500">Nouveau sur la plateforme ?</span></div></div>
              <div className="text-center"><Link to="/register" className="inline-block px-6 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all">Créer un compte employé</Link></div>
          </div>
       </div>
    </div>
  );
};