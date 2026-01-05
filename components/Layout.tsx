
import React, { useState } from 'react';
import { LogOut, Home, ShoppingCart, Shirt, User as UserIcon, Package, AlertTriangle, Menu, X, BarChart3, Users, Settings, Globe, Shield } from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: User;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentUser, 
  onLogout, 
  onNavigate,
  currentPage 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';
  const isOwner = currentUser.role === 'OWNER';

  const NavItem = ({ id, icon: Icon, label, color = isSuperAdmin ? "indigo" : "emerald" }: any) => (
    <button
      onClick={() => { onNavigate(id); setIsMobileMenuOpen(false); }}
      className={`flex flex-col md:flex-row items-center justify-center md:justify-start w-full gap-1 md:gap-3 px-3 py-2 md:py-3 rounded-2xl transition-all ${
        currentPage === id 
          ? `text-${color}-600 md:bg-${color}-600 md:text-white md:shadow-lg md:shadow-${color}-600/20` 
          : 'text-slate-400 md:text-slate-300 md:hover:bg-slate-800'
      }`}
    >
      <Icon size={20} strokeWidth={currentPage === id ? 2.5 : 2} />
      <span className="text-[10px] md:text-xs font-black uppercase tracking-wider">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 bg-slate-900 text-white flex-col shadow-2xl z-20">
        <div className="p-8 border-b border-slate-800/50">
          <div className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
            <div className={`w-8 h-8 ${isSuperAdmin ? 'bg-indigo-500' : 'bg-emerald-500'} rounded-xl shadow-lg flex items-center justify-center`}>
              {isSuperAdmin ? <Globe size={18} /> : <Home size={18} />}
            </div>
            HoteLogix {isSuperAdmin && <span className="text-[8px] bg-indigo-500 text-white px-1.5 py-0.5 rounded ml-1 tracking-widest">SYS</span>}
          </div>
          <div className="mt-6 flex items-center gap-3 bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
             <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black ${isSuperAdmin ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
               {currentUser.name.charAt(0)}
             </div>
             <div className="min-w-0">
               <p className="font-bold text-xs truncate">{currentUser.name}</p>
               <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">{currentUser.role}</p>
             </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {isSuperAdmin ? (
            <>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-4 py-2 mt-4">System Master</p>
              <NavItem id="super_dashboard" icon={Globe} label="Intelligence" color="indigo" />
              <NavItem id="global_users" icon={Shield} label="Utenti Globali" color="indigo" />
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-4 py-2 mt-4">Visualizzazione Strutture</p>
              <NavItem id="dashboard" icon={BarChart3} label="Tutti gli Hotel" color="indigo" />
            </>
          ) : (
            <>
              <NavItem id="dashboard" icon={BarChart3} label="Dashboard" />
              <NavItem id="inventory" icon={Package} label="Magazzino" />
              <NavItem id="orders" icon={ShoppingCart} label="Ordini" />
              <NavItem id="laundry" icon={Shirt} label="Biancheria" />
              <NavItem id="issues" icon={AlertTriangle} label="Guasti" color="red" />
              {(isOwner) && (
                <>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-4 py-2 mt-4">Gestione</p>
                  <NavItem id="staff" icon={Users} label="Team" />
                  <NavItem id="products" icon={Settings} label="Catalogo" />
                </>
              )}
            </>
          )}
        </nav>

        <div className="p-6 border-t border-slate-800/50">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-red-500/10 rounded-2xl transition-all group"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-black uppercase tracking-wider">Esci Sessione</span>
          </button>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="md:hidden h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
          <div className="text-xl font-black tracking-tighter text-slate-900 flex items-center gap-2">
            <div className={`w-6 h-6 ${isSuperAdmin ? 'bg-indigo-600' : 'bg-emerald-600'} rounded-lg shadow-sm`}></div>
            HoteLogix
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-400">
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm md:hidden">
          <div className="w-80 h-full bg-slate-900 flex flex-col animate-in slide-in-from-right-full duration-300">
             <div className="p-8 flex items-center justify-between border-b border-slate-800/50">
               <span className="text-white font-black tracking-tighter text-xl">Menu Navigazione</span>
               <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400"><X size={24} /></button>
             </div>
             <nav className="flex-1 p-6 space-y-2">
                <NavItem id="dashboard" icon={Home} label="Dashboard" />
                {/* Altri item per mobile... */}
             </nav>
             <div className="p-8 border-t border-slate-800/50">
                <button onClick={onLogout} className="flex items-center gap-3 text-red-400 font-black uppercase tracking-widest text-xs">
                  <LogOut size={18} /> Disconnetti
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
