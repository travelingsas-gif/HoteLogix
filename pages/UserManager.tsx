
import React, { useState } from 'react';
import { User, Role } from '../types';
// Fixed: Added 'Users' to the lucide-react icon imports
import { UserPlus, Trash2, Shield, User as UserIcon, Mail, Key, LayoutDashboard, UserCheck, Users } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface UserManagerProps {
  users: User[];
  tenantId: string;
  onRefresh: () => void;
}

export const UserManager: React.FC<UserManagerProps> = ({ users, tenantId, onRefresh }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('OPERATOR');
  const [loading, setLoading] = useState(false);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Nota: Nella versione reale useresti una Edge Function o l'Admin SDK.
      // Qui simuliamo l'invito che poi l'utente conferma.
      const { data, error } = await supabase.from('app_users').insert([{
        tenant_id: tenantId,
        email,
        name,
        role,
        id: crypto.randomUUID() // Placeholder per logica di auth reale
      }]);

      if (error) throw error;
      
      alert(`Invito inviato a ${email}. Lo staff potrà accedere dopo la conferma.`);
      setName(''); setEmail(''); setPassword('');
      onRefresh();
    } catch (err: any) {
      alert("Errore: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-8">
            <div className="flex items-center space-x-4">
                <div className="p-4 rounded-3xl bg-emerald-600 shadow-xl shadow-emerald-600/20 text-white">
                    {/* Fixed: 'Users' icon is now properly imported */}
                    <Users className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Gestione Team Hotel</h1>
                    <p className="text-slate-500 font-medium">Gestisci operatori, receptionist e fornitori esterni.</p>
                </div>
            </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           <div className="lg:col-span-1">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 sticky top-10">
                    <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                        <UserPlus size={20} className="text-emerald-600" />
                        Aggiungi Staff
                    </h3>
                    <form onSubmit={handleAddStaff} className="space-y-4">
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome Completo" className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 font-bold" required />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Staff" className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 font-bold" required />
                        <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 font-bold appearance-none">
                            <option value="OPERATOR">Operatore (Pulizie)</option>
                            <option value="RECEPTION">Receptionist</option>
                            <option value="SUPPLIER">Fornitore Esterno</option>
                        </select>
                        <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-black transition-all shadow-lg text-xs uppercase tracking-widest">
                            {loading ? 'Creazione...' : 'Crea Account Staff'}
                        </button>
                    </form>
                </div>
           </div>

           <div className="lg:col-span-3">
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ruolo</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">{u.name.charAt(0)}</div>
                                            <div>
                                                <p className="font-bold text-slate-800">{u.name}</p>
                                                <p className="text-xs text-slate-400">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-tighter">{u.role}</span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
           </div>
       </div>
    </div>
  );
};
