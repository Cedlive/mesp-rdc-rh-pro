import React from 'react';
/* Fix: Ensure NavLink is correctly imported from react-router-dom */
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Banknote, 
  PieChart, 
  LogOut,
  Clock,
  Briefcase,
  TrendingUp,
  GraduationCap,
  CreditCard,
  ClipboardList,
  FolderOpen,
  Building2,
  Shield,
  MessageCircle,
  Mail,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Share2
} from 'lucide-react';
import { MOCK_ROLES } from '../constants';
import { Employee } from '../types';

interface SidebarProps {
  companyLogo: string | null;
  currentUser?: Employee | null;
  onLogout?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  isCompact?: boolean;
  toggleCompact?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  companyLogo, 
  currentUser, 
  onLogout, 
  isOpen = false, 
  onClose,
  isCompact = false,
  toggleCompact
}) => {
  const getRoleId = () => {
    if (!currentUser) return 'employee';
    // Normalisation de la casse pour éviter les erreurs
    const roleTitle = currentUser.role.trim();
    if (roleTitle === 'Directeur RH' || roleTitle === 'Administrateur') return 'admin';
    if (roleTitle === 'Responsable RH') return 'hr_manager';
    return 'employee';
  };

  const currentRoleId = getRoleId();
  const userRole = MOCK_ROLES.find(r => r.id === currentRoleId) || MOCK_ROLES.find(r => r.id === 'employee');

  const hasPermission = (moduleName: string): boolean => {
    if (!userRole) return false;
    if (userRole.id === 'admin') return true;
    const perm = userRole.permissions.find(p => p.module === moduleName);
    return perm ? perm.canView : false;
  };

  const menuGroups = [
    {
      title: "Mon Espace",
      items: [
        { to: "/", icon: LayoutDashboard, label: "Tableau de bord", visible: true },
        { to: "/leaves", icon: Clock, label: "Absences & Temps", visible: true },
        { to: "/settings", icon: Users, label: "Mon Dossier", visible: true }, 
      ]
    },
    {
      title: "Gestion RH",
      items: [
        { to: "/employees", icon: Users, label: "Annuaire Employés", visible: hasPermission('Employees') },
        { to: "/services", icon: Building2, label: "Organigramme", visible: true },
        { to: "/recruitment", icon: Briefcase, label: "Recrutement (ATS)", visible: hasPermission('Recruitment') },
        { to: "/performance", icon: TrendingUp, label: "Performance", visible: true },
        { to: "/training", icon: GraduationCap, label: "Formation", visible: true },
      ]
    },
    {
      title: "Finance & Admin",
      items: [
        { to: "/payroll", icon: Banknote, label: "Paie & Primes", visible: hasPermission('Payroll') },
        { to: "/expenses", icon: CreditCard, label: "Notes de frais", visible: true },
        { to: "/documents", icon: FolderOpen, label: "Gestion Documentaire", visible: true },
        { to: "/surveys", icon: ClipboardList, label: "Sondages", visible: true },
        { to: "/analytics", icon: PieChart, label: "Rapports & BI", visible: hasPermission('Analytics') },
        { to: "/roles", icon: Shield, label: "Rôles & Permissions", visible: hasPermission('Settings') },
      ]
    },
    {
        title: "Communication",
        items: [
            { to: "/communication", icon: MessageCircle, label: "MESP Connect", visible: hasPermission('Communication') },
            { to: "/communication?tab=mail", icon: Mail, label: "Boîte Mail", visible: hasPermission('Communication') },
            { to: "/communication?tab=social", icon: Share2, label: "Réseau Interne", visible: hasPermission('Communication') },
        ]
    }
  ];

  return (
    <div 
      className={`
        fixed left-0 top-0 h-screen bg-slate-900 text-slate-300 flex flex-col z-50 shadow-2xl transition-all duration-300 ease-in-out group
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        ${isCompact ? 'w-20 hover:w-64' : 'w-64'}
      `}
    >
      {/* Brand Header */}
      <div className={`h-16 flex items-center shrink-0 border-b border-slate-800 bg-slate-900 transition-all duration-300 ${isCompact ? 'px-0 justify-center group-hover:px-6 group-hover:justify-between' : 'px-6 justify-between'}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          {companyLogo ? (
            <img src={companyLogo} alt="MESP Logo" className="w-8 h-8 object-contain bg-white rounded-md p-0.5 flex-shrink-0" />
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30 flex-shrink-0">M</div>
          )}
          <span className={`font-bold text-white tracking-tight whitespace-nowrap transition-all duration-300 ${isCompact ? 'opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden' : 'opacity-100 w-auto'}`}>
            MESP HR<span className="text-blue-500">.</span>
          </span>
        </div>
        
        {toggleCompact && (
            <button 
                onClick={(e) => { e.stopPropagation(); toggleCompact(); }} 
                className={`hidden md:flex text-slate-500 hover:text-white transition-all p-1.5 rounded-lg hover:bg-slate-800 items-center justify-center ${isCompact ? 'opacity-0 group-hover:opacity-100 absolute right-4' : 'opacity-100'}`}
                title={isCompact ? "Fixer le menu" : "Réduire le menu"}
            >
                {isCompact ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
        )}

        <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-8 scrollbar-hide">
        {menuGroups.map((group, groupIdx) => {
          const visibleItems = group.items.filter(item => item.visible);
          if (visibleItems.length === 0) return null;

          return (
            <div key={groupIdx}>
              <h3 className={`px-3 mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider transition-all duration-300 whitespace-nowrap overflow-hidden ${isCompact ? 'opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto group-hover:mb-2 mb-0' : 'opacity-100 h-auto'}`}>
                {group.title}
              </h3>
              {isCompact && <div className="h-px w-8 bg-slate-800 mx-auto mb-3 group-hover:hidden transition-all duration-300"></div>}
              
              <ul className="space-y-1">
                {visibleItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        onClick={onClose}
                        end={item.to === '/'}
                        className={({ isActive }) =>
                          `flex items-center rounded-lg transition-all duration-200 group/item hover:translate-x-1 active:scale-95 py-2.5 ${isCompact ? 'justify-center px-0 group-hover:justify-start group-hover:px-3' : 'gap-3 px-3'} ${
                            isActive
                              ? "bg-blue-600 text-white shadow-md shadow-blue-900/20 font-medium"
                              : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                          }`
                        }
                      >
                        <IconComponent size={20} className="shrink-0" />
                        <span className={`text-sm whitespace-nowrap transition-all duration-300 overflow-hidden ${isCompact ? 'opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto ml-0 group-hover:ml-3' : 'opacity-100 w-auto ml-0 ml-3'}`}>
                          {item.label}
                        </span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Footer Profile */}
      <div className={`p-4 bg-slate-900 border-t border-slate-800 transition-all duration-300 ${isCompact ? 'items-center group-hover:items-stretch' : ''}`}>
        <div className={`flex items-center gap-3 mb-3 transition-all duration-300 ${isCompact ? 'justify-center group-hover:justify-start group-hover:px-2' : 'px-2'}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold border border-slate-700 overflow-hidden shrink-0">
                {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <span>{currentUser ? `${currentUser.firstName[0]}${currentUser.lastName[0]}` : 'JD'}</span>
                )}
            </div>
            <div className={`transition-all duration-300 overflow-hidden ${isCompact ? 'opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto' : 'opacity-100 w-auto'}`}>
                <p className="text-sm text-white font-medium truncate">{currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Utilisateur'}</p>
                <p className="text-xs text-slate-500 truncate">{currentUser?.role || 'Invité'}</p>
            </div>
        </div>
        <button 
            onClick={onLogout}
            className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all text-xs font-bold hover:scale-[1.02] active:scale-95 transform ${isCompact ? 'px-0 group-hover:px-3' : 'px-3'}`}
        >
          <LogOut size={16} className="shrink-0" />
          <span className={`transition-all duration-300 overflow-hidden ${isCompact ? 'opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto' : 'opacity-100 w-auto'}`}>
            Déconnexion
          </span>
        </button>
      </div>
    </div>
  );
};