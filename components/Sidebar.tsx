
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Banknote, PieChart, LogOut, Clock,
  Briefcase, TrendingUp, GraduationCap, CreditCard, ClipboardList,
  FolderOpen, Building2, Shield, MessageCircle, Mail, X,
  PanelLeftClose, PanelLeftOpen, BrainCircuit, User,
  CalendarCheck, FileSearch, Wallet, ShieldCheck, HeartPulse, PlaneTakeoff,
  Globe, Settings, Bell, HelpCircle
} from 'lucide-react';
import { MOCK_ROLES } from '../constants';
import { Employee } from '../types';

interface SidebarProps {
  companyLogo?: string | null;
  currentUser?: Employee | null;
  onLogout?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  isCompact?: boolean;
  toggleCompact?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  companyLogo, currentUser, onLogout, isOpen = false, onClose, isCompact = false, toggleCompact
}) => {
  
  const getUserRole = () => {
    if (!currentUser) return MOCK_ROLES.find(r => r.id === 'employee');
    const roleTitle = currentUser.role;
    if (roleTitle === 'Directeur RH' || roleTitle === 'Administrateur') return MOCK_ROLES.find(r => r.id === 'admin');
    if (roleTitle === 'Responsable RH') return MOCK_ROLES.find(r => r.id === 'hr_manager');
    return MOCK_ROLES.find(r => r.id === 'employee');
  };

  const userRole = getUserRole();

  const hasPermission = (moduleName: string): boolean => {
    if (!userRole) return false;
    if (userRole.id === 'admin') return true;
    const perm = userRole.permissions.find(p => p.module === moduleName);
    return perm ? perm.canView : false;
  };

  const menuGroups = [
    {
      title: "Exploitation",
      items: [
        { to: "/", icon: LayoutDashboard, label: "Console Dashboard", visible: true },
        { to: "/leaves", icon: CalendarCheck, label: "Présences & Temps", visible: true },
        { to: "/medical", icon: HeartPulse, label: "Pôle Médical MESP", visible: true },
      ]
    },
    {
      title: "Ressources Humaines",
      items: [
        { to: "/ai-lab", icon: BrainCircuit, label: "Genius AI Lab", visible: true },
        { to: "/employees", icon: Users, label: "Annuaire Agents", visible: hasPermission('Employees') },
        { to: "/services", icon: Building2, label: "Organigramme", visible: hasPermission('Employees') },
        { to: "/recruitment", icon: FileSearch, label: "Recrutement ATS", visible: hasPermission('Recruitment') },
        { to: "/training", icon: GraduationCap, label: "Développement", visible: true },
      ]
    },
    {
      title: "Finance & Contrôle",
      items: [
        { to: "/payroll", icon: Wallet, label: "Paie & Primes", visible: hasPermission('Payroll') },
        { to: "/expenses", icon: CreditCard, label: "Notes de frais", visible: true },
        { to: "/analytics", icon: PieChart, label: "Business Intel (BI)", visible: hasPermission('Analytics') },
        { to: "/missions", icon: PlaneTakeoff, label: "Missions Terrain", visible: true },
      ]
    },
    {
        title: "Communication",
        items: [
          { to: "/communication", icon: MessageCircle, label: "Messagerie Live", visible: true },
          { to: "/communication?tab=social", icon: Globe, label: "MESP Social", visible: true },
          { to: "/roles", icon: ShieldCheck, label: "Gouvernance", visible: hasPermission('Settings') },
        ]
    }
  ];

  return (
    <div className={`fixed left-0 top-0 h-screen bg-[#0f172a] text-slate-300 flex flex-col z-50 shadow-2xl transition-all duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 ${isCompact ? 'w-20' : 'w-64'}`}>
      {/* Brand Header */}
      <div className={`h-20 flex items-center border-b border-white/5 bg-[#0f172a] px-6 justify-between overflow-hidden`}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-xl shadow-blue-900/40 shrink-0 transform rotate-3">M</div>
          {!isCompact && (
            <div className="flex flex-col">
                <span className="font-black text-white tracking-tighter leading-none text-lg">MESP<span className="text-blue-500">.</span>PRO</span>
                <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest mt-1">Enterprise Suite</span>
            </div>
          )}
        </div>
        {!isCompact && toggleCompact && (
          <button onClick={toggleCompact} className="text-slate-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <PanelLeftClose size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-8 scrollbar-hide">
        {menuGroups.map((group, idx) => (
          <div key={idx}>
            {!isCompact && <h3 className="px-4 mb-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{group.title}</h3>}
            {isCompact && <div className="h-px bg-white/5 mx-4 mb-4"></div>}
            <ul className="space-y-1">
              {group.items.filter(i=>i.visible).map(item => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.to==='/'} className={({isActive})=>`flex items-center rounded-2xl transition-all duration-300 py-3 ${isCompact ? 'justify-center px-0' : 'gap-3 px-4'} ${isActive?"bg-blue-600 text-white shadow-xl shadow-blue-600/30 font-bold":"text-slate-400 hover:bg-white/5 hover:text-slate-100"}`}>
                    <item.icon size={22} className={`shrink-0 ${isCompact ? '' : ''}`} />
                    {!isCompact && <span className="text-sm tracking-tight">{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="p-4 bg-black/20 border-t border-white/5">
        {!isCompact && (
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl mb-4 border border-white/5">
                <img src={currentUser?.avatar || "https://ui-avatars.com/api/?name=User"} className="w-10 h-10 rounded-xl object-cover border border-white/10" alt="Profile" />
                <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate">{currentUser?.firstName} {currentUser?.lastName}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase truncate">{currentUser?.role}</p>
                </div>
            </div>
        )}
        <button onClick={onLogout} className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all text-[10px] font-black uppercase tracking-widest`}>
            <LogOut size={18}/>
            {!isCompact && "Quitter la session"}
        </button>
      </div>
    </div>
  );
};
