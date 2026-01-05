
import React, { useState } from 'react';
import { User, Role, Tenant } from '../types';
import { Search, Mail, Key, Trash2, Edit3, Shield, Filter, Hotel, UserCheck } from 'lucide-react';

interface GlobalUserManagerProps {
  allUsers: User[];
  tenants: Tenant[];
  onUpdateUser: (userId: string, updates: Partial<User & { password?: string }>) => void;
  onDeleteUser: (userId: string) => void;
}

export const GlobalUserManager: React.FC<GlobalUserManagerProps> = ({ 
  allUsers, 
  tenants, 
  onUpdateUser, 
  onDeleteUser 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenant, setSelectedTenant] = useState('ALL');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // States for Edit Modal
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');

  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         u.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTenant = selectedTenant === 'ALL' || u.tenantId === selectedTenant;
    return matchesSearch && matchesTenant;
  });

  const getTenantName = (id: string) => tenants.find(t => t.id === id)?.name || 'N/A';

  const handleStartEdit = (user: User) => {
    setEditingUser(user);
    setNewEmail(user.email);
    setNewName(user.name);
    setNewPassword('');
  };

  const handleSaveEdit = () => {
    if (editingUser) {
      const updates: any = { email: newEmail, name: newName };
      if (newPassword) updates.password = newPassword;
      onUpdateUser(editingUser.id, updates);
      setEditingUser(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
             <Shield className="text-indigo-600" /> Controllo Accessi Globale
          </h1>
          <p className="text-slate-400 font-medium mt-1">Gestione centralizzata di tutti i profili e credenziali del network.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Cerca per email o nome..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
            />
          </div>
          <select 
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm font-bold text-slate-700 outline-none"
          >
            <option value="ALL">Tutti gli Hotel</option>
            {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
              <tr>
                <th className="px-8 py-6">Utente</th>
                <th className="px-8 py-6">Hotel / Tenant</th>
                <th className="px-8 py-6">Ruolo</th>
                <th className="px-8 py-6 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black shadow-inner">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{u.name}</p>
                        <p className="text-xs font-medium text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-600 font-semibold text-sm">
                      <Hotel size={14} className="text-slate-300" />
                      {getTenantName(u.tenantId)}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border ${
                      u.role === 'SUPER_ADMIN' ? 'bg-slate-900 text-white border-slate-900' :
                      u.role === 'OWNER' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleStartEdit(u)}
                        className="p-3 bg-white text-slate-400 hover:text-indigo-600 hover:shadow-md border border-slate-100 rounded-xl transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => { if(confirm("Eliminare definitivamente l'utente?")) onDeleteUser(u.id) }}
                        className="p-3 bg-white text-slate-400 hover:text-red-500 hover:shadow-md border border-slate-100 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-10 space-y-8 animate-in zoom-in-95">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                <Shield size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Modifica Credenziali</h2>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">Protocollo Super Admin</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Visualizzato</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-indigo-500 outline-none font-bold text-slate-800" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nuova Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 text-slate-300" size={18} />
                  <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-indigo-500 outline-none font-bold text-slate-800" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nuova Password (Opzionale)</label>
                <div className="relative">
                  <Key className="absolute left-4 top-4 text-slate-300" size={18} />
                  <input type="password" placeholder="Lascia vuoto per non cambiare" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-indigo-500 outline-none font-bold text-slate-800" />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setEditingUser(null)} className="flex-1 py-4 bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all">Annulla</button>
              <button onClick={handleSaveEdit} className="flex-1 py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-xl">Salva Modifiche</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
