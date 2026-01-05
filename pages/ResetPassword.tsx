
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Lock, Save, CheckCircle2, ArrowRight } from 'lucide-react';

export const ResetPassword: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Errore durante l'aggiornamento della password.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 text-center">
        <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 space-y-6 border border-emerald-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Password Aggiornata!</h2>
          <p className="text-slate-500 font-medium">La tua nuova chiave di accesso è attiva. Ora puoi accedere al sistema.</p>
          <button 
            onClick={onComplete}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
          >
            Vai al Login <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 md:p-12 space-y-8 border border-slate-100">
        <div className="text-center">
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Nuova Password</h1>
          <p className="text-slate-400 font-bold text-[10px] mt-2 uppercase tracking-[0.2em]">Scegli una password sicura per il tuo account</p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nuova Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-slate-300" size={18} />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold text-slate-800 bg-slate-50/50" 
                placeholder="Minimo 8 caratteri" 
                minLength={8}
                required 
              />
            </div>
          </div>

          {error && <div className="bg-red-50 text-red-600 text-xs font-bold py-3 px-4 rounded-xl text-center border border-red-100">{error}</div>}

          <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-2xl transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
            <Save size={18} />
            {loading ? 'Salvataggio...' : 'Aggiorna Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
