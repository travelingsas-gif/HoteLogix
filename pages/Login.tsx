
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Hotel, ShieldCheck, UserPlus, Key } from 'lucide-react';

interface LoginProps {
  onGoToRegister: () => void;
  onGoToForgot: () => void;
}

export const Login: React.FC<LoginProps> = ({ onGoToRegister, onGoToForgot }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Utilizziamo Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes('Email not confirmed')) {
          throw new Error('Devi confermare la tua email prima di accedere.');
        }
        throw authError;
      }
      // App.tsx gestirà il cambio di stato tramite onAuthStateChange
    } catch (err: any) {
      setError(err.message || 'Credenziali non valide.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-md p-8 md:p-12 space-y-8 animate-in fade-in zoom-in-95 duration-700 border border-slate-100">
        <div className="text-center">
          <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-600/20 rotate-3">
            <Hotel className="text-white w-10 h-10 -rotate-3" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">HoteLogix</h1>
          <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-[0.2em]">Management Multi-Tenant</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Professionale</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold text-slate-800 bg-slate-50/50" placeholder="E-mail" required />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
              <button type="button" onClick={onGoToForgot} className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-widest">Smarrita?</button>
            </div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold text-slate-800 bg-slate-50/50" placeholder="Password" required />
          </div>

          {error && <div className="bg-red-50 text-red-600 text-xs font-bold py-3 px-4 rounded-xl text-center border border-red-100">{error}</div>}

          <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-black text-white font-bold py-5 rounded-2xl transition-all shadow-xl active:scale-95 disabled:opacity-50">
            {loading ? 'Autenticazione...' : 'Accedi al Sistema'}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-50 text-center">
          <button onClick={onGoToRegister} className="group flex items-center justify-center gap-2 mx-auto text-slate-400 hover:text-emerald-600 transition-colors py-2">
            <UserPlus size={16} className="group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest underline decoration-slate-200 decoration-2 underline-offset-4">Nuova Struttura? Registrati</span>
          </button>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <ShieldCheck size={14} className="text-emerald-500" />
          <p className="text-[10px] font-bold uppercase tracking-widest">Connessione Protetta Auth v2</p>
        </div>
      </div>
    </div>
  );
};
