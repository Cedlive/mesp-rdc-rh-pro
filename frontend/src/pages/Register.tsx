
import React, { useState } from 'react';
import { MOCK_EMPLOYEES, MOCK_DEPARTMENTS } from '../constants';
import { Employee } from '../types';
import { Lock, User, Phone, Briefcase, Building2, UserPlus, AlertCircle, ArrowLeft, ShieldCheck, Eye, EyeOff, CheckCircle } from 'lucide-react';
/* Fix: Ensure Link is correctly imported from react-router-dom */
import { Link } from 'react-router-dom';

interface RegisterProps {
  onRegister: (employee: Employee) => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    department: '',
    role: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
        setError("Les mots de passe ne correspondent pas.");
        return;
    }
    if (formData.password.length < 4) {
        setError("Le mot de passe doit contenir au moins 4 caractères.");
        return;
    }
    if (!formData.department) {
        setError("Veuillez sélectionner un département.");
        return;
    }

    setLoading(true);

    // Simulate creation delay
    setTimeout(() => {
        // Fix: Added missing insuranceNumber property to Employee object
        const newEmployee: Employee = {
            id: `E${Date.now()}`,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@mesp-rdc.cd`,
            department: formData.department,
            role: formData.role,
            phone: formData.phone,
            password: formData.password,
            avatar: `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=random`,
            status: 'Inactif', // Default to Inactif waiting for admin approval
            joinDate: new Date().toISOString().split('T')[0],
            insuranceNumber: `MESP-REG-${Date.now()}`,
            contractType: 'CDI'
        };

        // Add to Mock Database (In-Memory)
        MOCK_EMPLOYEES.push(newEmployee);

        setLoading(false);
        setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center animate-in zoom-in-95 duration-500 border border-slate-100">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-in slide-in-from-bottom-2">
                    <CheckCircle size={48} className="text-green-500" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-800 mb-3">Inscription Réussie !</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    Votre compte a été créé avec succès. Il est actuellement en attente de validation. 
                    Un administrateur doit <strong>activer votre compte</strong> avant que vous puissiez vous connecter.
                </p>
                <Link to="/login" className="block w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg">
                    Retour à la connexion
                </Link>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
       {/* Left Side - Visual / Branding */}
       <div className="hidden xl:flex w-5/12 bg-blue-700 relative flex-col justify-between overflow-hidden">
          {/* Abstract Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-indigo-900 opacity-100"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          
          <div className="relative z-10 p-12 h-full flex flex-col justify-center text-white">
             <div className="mb-12 animate-in slide-in-from-left-10 duration-700">
                 <div className="inline-block p-4 bg-white/10 rounded-2xl border border-white/20 shadow-xl mb-6">
                    <UserPlus size={40} className="text-blue-100" />
                 </div>
                 <h2 className="text-4xl font-bold mb-6 leading-tight">Rejoignez l'équipe MESP<span className="text-blue-300">.</span></h2>
                 <p className="text-blue-100 text-lg leading-relaxed font-light">
                    Intégrez une structure dynamique dédiée à la santé des enseignants. Créez votre profil professionnel et accédez à vos services en quelques clics.
                 </p>
             </div>
             
             <div className="space-y-6 animate-in slide-in-from-bottom-10 duration-1000 delay-200">
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/5 hover:bg-white/20 transition-colors cursor-default">
                      <div className="p-2.5 bg-green-500/20 rounded-lg text-green-300"><Building2 size={24} /></div>
                      <div>
                          <h4 className="font-bold">Accès Départemental</h4>
                          <p className="text-sm text-blue-200">Connectez-vous à votre service et vos équipes.</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/5 hover:bg-white/20 transition-colors cursor-default">
                      <div className="p-2.5 bg-amber-500/20 rounded-lg text-amber-300"><Briefcase size={24} /></div>
                      <div>
                          <h4 className="font-bold">Gestion de Carrière</h4>
                          <p className="text-sm text-blue-200">Suivi des congés, paie et évaluations.</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/5 hover:bg-white/20 transition-colors cursor-default">
                      <div className="p-2.5 bg-purple-500/20 rounded-lg text-purple-300"><ShieldCheck size={24} /></div>
                      <div>
                          <h4 className="font-bold">Espace Sécurisé</h4>
                          <p className="text-sm text-blue-200">Vos données personnelles protégées.</p>
                      </div>
                  </div>
              </div>
          </div>
       </div>

       {/* Right Side - Registration Form */}
       <div className="w-full xl:w-7/12 flex items-center justify-center p-6 md:p-12 overflow-y-auto bg-slate-50">
          <div className="w-full max-w-2xl animate-in slide-in-from-bottom-8 duration-700">
             <div className="flex items-center justify-between mb-8">
                 <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Création de Compte</h1>
                    <p className="text-slate-500 mt-2">Renseignez vos informations professionnelles.</p>
                 </div>
                 <Link to="/login" className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md">
                    <ArrowLeft size={16} /> Connexion
                 </Link>
             </div>

             <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10 space-y-8">
                {error && (
                    <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-center gap-3">
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                {/* Section: Identité */}
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
                        <span className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-slate-500"><User size={14} /></span> Identité
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-slate-700">Prénom</label>
                            <input 
                                type="text" 
                                className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                placeholder="Jean"
                                required
                                value={formData.firstName}
                                onChange={e => setFormData({...formData, firstName: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-slate-700">Nom</label>
                            <input 
                                type="text" 
                                className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                placeholder="Ilunga"
                                required
                                value={formData.lastName}
                                onChange={e => setFormData({...formData, lastName: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                {/* Section: Poste */}
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
                        <span className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-slate-500"><Briefcase size={14} /></span> Poste & Contact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-slate-700">Département</label>
                            <div className="relative">
                                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <select 
                                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none font-medium cursor-pointer"
                                    required
                                    value={formData.department}
                                    onChange={e => setFormData({...formData, department: e.target.value})}
                                >
                                    <option value="">Sélectionner...</option>
                                    {MOCK_DEPARTMENTS.map(d => (
                                        <option key={d.id} value={d.title}>{d.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-slate-700">Intitulé du poste</label>
                            <input 
                                type="text" 
                                className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                placeholder="Ex: Comptable"
                                required
                                value={formData.role}
                                onChange={e => setFormData({...formData, role: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                           <label className="block text-sm font-semibold text-slate-700">Téléphone Mobile</label>
                           <div className="relative">
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="tel" 
                                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    placeholder="+243..."
                                    required
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                />
                           </div>
                        </div>
                    </div>
                </div>

                {/* Section: Sécurité */}
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
                        <span className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-slate-500"><Lock size={14} /></span> Sécurité
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-slate-700">Mot de passe</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">
                                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-slate-700">Confirmer mot de passe</label>
                            <div className="relative">
                                <input 
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    placeholder="••••••••"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">
                                    {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center gap-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full md:w-auto flex-1 py-4 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                    >
                        {loading ? 'Création du compte...' : (
                            <>
                                <UserPlus size={20} /> Confirmer l'inscription
                            </>
                        )}
                    </button>
                    <Link to="/login" className="md:hidden text-sm font-medium text-slate-500 hover:text-blue-600">
                        Annuler et retourner à la connexion
                    </Link>
                </div>
             </form>

             <p className="text-center text-xs text-slate-400 mt-8">
                 © 2024 MESP-RDC. En cliquant sur confirmer, vous acceptez les conditions d'utilisation.
             </p>
          </div>
       </div>
    </div>
  );
};
