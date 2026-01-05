
import React from 'react';
import { Globe, Users, ShoppingCart, AlertTriangle, TrendingUp, Hotel, Activity, ShieldCheck } from 'lucide-react';
import { Property, User, Order, IssueReport, Tenant } from '../types';

interface SuperAdminDashboardProps {
  tenants: Tenant[];
  allUsers: User[];
  allOrders: Order[];
  allIssues: IssueReport[];
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  tenants,
  allUsers,
  allOrders,
  allIssues
}) => {
  const stats = [
    { label: 'Hotel Registrati', value: tenants.length, icon: Hotel, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Utenti Totali', value: allUsers.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Ordini Attivi', value: allOrders.filter(o => o.status !== 'DELIVERED').length, icon: ShoppingCart, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Guasti Aperti', value: allIssues.filter(i => i.status === 'OPEN').length, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Globe size={24} />
            </div>
            System Intelligence
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">HoteLogix Global Infrastructure</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Server Status: Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                <TrendingUp size={20} className="text-indigo-400" />
                Dati Registrazioni Live
              </h2>
              <select className="bg-slate-800 border-none rounded-xl text-[10px] font-bold uppercase tracking-widest px-4 py-2 outline-none">
                {/* Fix: changed malformed 'Uint8Array' tag to 'option' and corrected the select closing */}
                <option>Ultimi 30 giorni</option>
              </select>
            </div>
            
            {/* Mock Chart Area */}
            <div className="h-48 flex items-end gap-2 px-2">
              {[40, 70, 45, 90, 65, 80, 50, 85, 100, 75, 95, 60].map((h, i) => (
                <div key={i} className="flex-1 bg-indigo-500/20 rounded-t-lg relative group transition-all hover:bg-indigo-500">
                  <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg transition-all" style={{ height: `${h}%` }}></div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[8px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {h} Registrazioni
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[9px] font-black text-slate-500 uppercase tracking-widest px-2">
              <span>Gen</span><span>Apr</span><span>Lug</span><span>Ott</span><span>Dic</span>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col">
          <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
            <Activity size={20} className="text-emerald-500" />
            Ultime Attività
          </h2>
          <div className="space-y-6 flex-1">
            {[
              { type: 'USER', msg: 'Nuovo Hotel: Grand Continental', time: '2m fa', icon: Hotel, color: 'bg-blue-100 text-blue-600' },
              { type: 'ISSUE', msg: 'Guasto segnalato a Paradise', time: '15m fa', icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
              { type: 'ORDER', msg: 'Ordine inviato da Metropolitan', time: '1h fa', icon: ShoppingCart, color: 'bg-amber-100 text-amber-600' },
              { type: 'SECURITY', msg: 'Backup database completato', time: '3h fa', icon: ShieldCheck, color: 'bg-emerald-100 text-emerald-600' },
            ].map((act, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className={`w-10 h-10 ${act.color} rounded-xl flex items-center justify-center shrink-0`}>
                  <act.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{act.msg}</p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 w-full py-4 bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all">
            Vedi tutto il log
          </button>
        </div>
      </div>
    </div>
  );
};
