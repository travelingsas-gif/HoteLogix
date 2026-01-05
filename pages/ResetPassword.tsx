
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Lock, Save, CheckCircle2, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

export const ResetPassword: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Le password non corrispondono.");
      return;
    }

    if (password.length < 8) {
      setError("Usa almeno 8 caratteri per la tua sicurezza.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Errore durante l'aggiornamento. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 text-center">
        <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-10 space-y-6 border border-emerald-100 animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
            <CheckCircle2 size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Sicurezza Ripristinata</h2>
            <p className="text-slate-500 font-medium">La tua nuova password è stata salvata correttamente nel database crittografato.</p>
          </div>
          <button 
            onClick={onComplete}
            className="w-full bg-slate-900 hover:bg-black text-white font-bold py-5 rounded-3xl flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95"
          >
            Accedi ora <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="bg-white rounded-[3rem] shadow-[0_25px_60px_rgba(0,0,0,0.06)] w-full max-w-md p-8 md:p-12 space-y-8 border border-slate-100 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-emerald-600/20">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Crea Nuova Password</h1>
          <p className="text-slate-400 font-bold text-[10px] mt-2 uppercase tracking-[0.2em]">HoteLogix Security Protocol</p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-slate-300" size={18} />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold text-slate-800 bg-slate-50/50" 
                placeholder="Nuova password" 
                minLength={8}
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Conferma Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-slate-300" size={18} />
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold text-slate-800 bg-slate-50/50" 
                placeholder="Ripeti password" 
                minLength={8}
                required 
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-[10px] font-black py-3 px-4 rounded-xl flex items-center gap-2 border border-red-100 uppercase tracking-wider animate-shake">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-emerald-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-4">
            <Save size={18} />
            {loading ? 'Aggiornamento...' : 'Salva Nuova Password'}
          </button>
        </form>
        
        <div className="flex items-center justify-center gap-2 text-slate-300">
           <ShieldCheck size={14} />
           <p className="text-[9px] font-bold uppercase tracking-widest">End-to-End Encrypted Reset</p>
        </div>
      </div>
    </div>
  );
};
