
import React, { useState } from 'react';
import { User, Role } from '../types';
import { UserPlus, Trash2, Shield, User as UserIcon, Mail, Key, LayoutDashboard } from 'lucide-react';

interface UserManagerProps {
  users: User[];
  onAdd: (user: Omit<User, 'id' | 'avatarUrl'> & { password: string }) => void;
  onDelete: (id: string) => void;
}

export const UserManager: React.FC<UserManagerProps> = ({ users, onAdd, onDelete }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('OPERATOR');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    onAdd({ name, email, role, password });
    setName(''); setEmail(''); setPassword(''); setRole('OPERATOR');
  };

  const getRoleBadgeColor = (role: Role) => {
    switch(role) {
      case 'SUPER_ADMIN': return 'bg-slate-900 text-white border-slate-900';
      case 'OWNER': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'RECEPTION': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'OPERATOR': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
       <div className="flex items-center justify-between border-b border-slate-200 pb-6">
            <div className="flex items-center space-x-4">
                <div className="p-4 rounded-[1.5rem] bg-white shadow-sm border border-slate-100 text-slate-600">
                    <UserIcon className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Gestione Risorse Umane</h1>
                    <p className="text-slate-400 font-medium">Controllo accessi e ruoli operativi del sistema.</p>
                </div>
            </div>
            <div className="hidden md:block">
                <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-100 flex items-center gap-2">
                    <Shield size={14} /> Cloud Secured Database
                </div>
            </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* FORM COLLOUN */}
           <div className="lg:col-span-1">
                <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 sticky top-10">
                    <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                        <UserPlus size={20} className="text-emerald-600" />
                        Nuovo Staff
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold text-slate-800 bg-slate-50" placeholder="Mario Rossi" required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold text-slate-800 bg-slate-50" placeholder="mario@email.com" required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold text-slate-800 bg-slate-50" placeholder="Min 6 char" required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ruolo</label>
                            <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-800 bg-slate-50 appearance-none">
                                <option value="OPERATOR">Operatore (Pulizie)</option>
                                <option value="RECEPTION">Receptionist</option>
                                <option value="OWNER">Manager Struttura</option>
                                <option value="SUPPLIER">Fornitore Esterno</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-xl shadow-lg hover:bg-black transition-all active:scale-95 text-sm uppercase tracking-widest">
                            Invia Invito Staff
                        </button>
                    </form>
                </div>
           </div>

           {/* TABLE COLUMN */}
           <div className="lg:col-span-3">
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Collaboratore</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contatto</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Livello</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Azioni</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black shadow-inner group-hover:bg-white group-hover:shadow-md transition-all">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-800">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 font-semibold text-slate-500 text-sm italic">{u.email}</td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black border uppercase tracking-tighter ${getRoleBadgeColor(u.role)}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button onClick={() => onDelete(u.id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-20 text-center">
                                            <div className="max-w-xs mx-auto space-y-3">
                                                <LayoutDashboard size={48} className="mx-auto text-slate-100" />
                                                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Nessun membro del team</p>
                                                <p className="text-slate-300 text-xs">Usa il modulo a sinistra per invitare i tuoi primi collaboratori.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
           </div>
       </div>
    </div>
  );
};
