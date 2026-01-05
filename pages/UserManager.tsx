
import React, { useState } from 'react';
import { User, Role } from '../types';
import { UserPlus, Trash2, Shield, User as UserIcon, Mail, Key } from 'lucide-react';

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
    
    // Reset form
    setName('');
    setEmail('');
    setPassword('');
    setRole('OPERATOR');
  };

  const getRoleBadgeColor = (role: Role) => {
    switch(role) {
      // Fixed: Replaced 'ADMIN' with valid Role types 'OWNER' or 'SUPER_ADMIN'
      case 'OWNER':
      case 'SUPER_ADMIN': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'RECEPTION': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'OPERATOR': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'SUPPLIER': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
       <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-slate-100 text-slate-600">
                <UserIcon className="w-8 h-8" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Gestione Staff</h1>
                <p className="text-slate-500">Aggiungi, modifica o rimuovi gli utenti che hanno accesso alla piattaforma.</p>
            </div>
       </div>

       {/* ADD USER FORM */}
       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
             <UserPlus className="w-5 h-5 mr-2 text-emerald-600" />
             Aggiungi Nuovo Utente
           </h3>
           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
               <div className="lg:col-span-1">
                   <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                   <div className="relative">
                       <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                       <input 
                         type="text" 
                         value={name}
                         onChange={(e) => setName(e.target.value)}
                         className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                         placeholder="Mario Rossi"
                         required
                       />
                   </div>
               </div>
               
               <div className="lg:col-span-1">
                   <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                   <div className="relative">
                       <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="mario@hotel.com"
                            required
                        />
                   </div>
               </div>

               <div className="lg:col-span-1">
                   <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                   <div className="relative">
                       <Key className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input 
                            type="text" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="password123"
                            required
                        />
                   </div>
               </div>

               <div className="lg:col-span-1">
                   <label className="block text-sm font-medium text-slate-700 mb-1">Ruolo</label>
                   <div className="relative">
                       <Shield className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                       <select 
                            value={role}
                            onChange={(e) => setRole(e.target.value as Role)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none appearance-none bg-white"
                       >
                           <option value="OPERATOR">Operatore</option>
                           <option value="RECEPTION">Reception</option>
                           {/* Changed ADMIN to OWNER */}
                           <option value="OWNER">Amministratore (Owner)</option>
                           <option value="SUPPLIER">Fornitore</option>
                       </select>
                   </div>
               </div>

               <div className="lg:col-span-1">
                   <button 
                     type="submit"
                     className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors shadow-sm"
                   >
                     Crea Utente
                   </button>
               </div>
           </form>
       </div>

       {/* USERS LIST */}
       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Utente</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ruolo</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Azioni</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold mr-3">
                                            {u.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-slate-800">{u.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600 text-sm">
                                    {u.email}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${getRoleBadgeColor(u.role)}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => {
                                            if(confirm(`Sei sicuro di voler eliminare l'utente ${u.name}?`)) onDelete(u.id);
                                        }}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Elimina Utente"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-400">
                                    Nessun utente trovato.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
       </div>
    </div>
  );
};
