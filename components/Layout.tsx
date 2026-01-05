
import React, { useState } from 'react';
import { LogOut, Home, ShoppingCart, Shirt, User as UserIcon, Package, AlertTriangle, Menu, X } from 'lucide-react';
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

  const isAdmin = currentUser.role === 'OWNER' || currentUser.role === 'SUPER_ADMIN';

  const NavItem = ({ id, icon: Icon, label }: any) => (
    <button
      onClick={() => { onNavigate(id); setIsMobileMenuOpen(false); }}
      className={`flex flex-col md:flex-row items-center justify-center md:justify-start w-full gap-1 md:gap-3 px-3 py-2 md:py-3 rounded-2xl transition-all ${
        currentPage === id 
          ? 'text-emerald-600 md:bg-emerald-600 md:text-white md:shadow-lg md:shadow-emerald-600/20' 
          : 'text-slate-400 md:text-slate-300 md:hover:bg-slate-800'
      }`}
    >
      <Icon size={22} strokeWidth={currentPage === id ? 2.5 : 2} />
      <span className="text-[10px] md:text-sm font-bold md:font-semibold uppercase tracking-tight md:tracking-normal">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 bg-slate-900 text-white flex-col shadow-2xl z-20">
        <div className="p-8 border-b border-slate-800/50">
          <div className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-xl"></div>
            HoteLogix
          </div>
          <div className="mt-4 flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400">
                {currentUser.name.charAt(0)}
             </div>
             <div>
                <p className="text-sm font-bold truncate max-w-[150px]">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{currentUser.role}</p>
             </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          <NavItem id="dashboard" icon={Home} label="Dashboard" />
          <NavItem id="global_stock" icon={Package} label="Magazzino" />
          <NavItem id="issues_list" icon={AlertTriangle} label="Guasti" />
          {isAdmin && (
            <div className="pt-6 mt-6 border-t border-slate-800/50 space-y-2">
               <p className="text-[10px] text-slate-500 font-black uppercase px-4 mb-4">Gestione Owner</p>
               <NavItem id="users" icon={UserIcon} label="Team" />
            </div>
          )}
        </nav>

        <div className="p-6 border-t border-slate-800/50">
          <button onClick={onLogout} className="flex items-center w-full px-4 py-3 text-slate-500 hover:text-white hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all gap-3 font-bold text-sm">
            <LogOut size={20} />
            Esci
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header Mobile Only */}
        <header className="md:hidden bg-white/80 backdrop-blur-xl border-b border-slate-100 p-4 sticky top-0 z-30 flex justify-between items-center">
          <div className="text-xl font-black text-slate-900 tracking-tighter">HoteLogix</div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-slate-100 rounded-xl text-slate-600">
             {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-10 safe-bottom">
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-2 py-3 safe-bottom z-40">
           <NavItem id="dashboard" icon={Home} label="Home" />
           <NavItem id="global_stock" icon={Package} label="Stock" />
           <NavItem id="issues_list" icon={AlertTriangle} label="Guasti" />
           <NavItem id="profile" icon={UserIcon} label="Profilo" />
        </nav>
      </div>

      {/* Mobile Drawer (Overlay) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
           <div className="absolute right-0 top-0 bottom-0 w-64 bg-white p-6 shadow-2xl animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-10">
                 <span className="font-black text-slate-900">Menu</span>
                 <X onClick={() => setIsMobileMenuOpen(false)} />
              </div>
              <div className="space-y-4">
                 <button onClick={onLogout} className="flex items-center gap-3 w-full text-red-500 font-bold p-3 rounded-xl bg-red-50">
                    <LogOut size={20} />
                    Disconnetti
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
