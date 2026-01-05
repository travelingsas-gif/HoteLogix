
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Mail, ArrowLeft, Key, CheckCircle2 } from 'lucide-react';

interface ForgotPasswordProps {
  onBack: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      if (resetError) throw resetError;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Impossibile inviare l'email di recupero.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 md:p-12 space-y-8 border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
        <button onClick={onBack} className="flex items-center text-slate-400 hover:text-slate-600 transition-colors text-xs font-bold uppercase tracking-widest">
          <ArrowLeft size={16} className="mr-2" /> Torna al Login
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Key className="text-slate-600 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Recupero Password</h1>
          <p className="text-slate-400 font-bold text-[10px] mt-2 uppercase tracking-[0.2em]">Inserisci la tua email per ricevere un link</p>
        </div>

        {success ? (
          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-center space-y-4">
            <CheckCircle2 size={32} className="text-emerald-600 mx-auto" />
            <p className="text-emerald-700 font-bold text-sm">Controlla la tua posta! Abbiamo inviato le istruzioni di recupero.</p>
          </div>
        ) : (
          <form onSubmit={handleResetRequest} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Account</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-slate-300" size={18} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold text-slate-800 bg-slate-50/50" placeholder="admin@hotel.com" required />
              </div>
            </div>

            {error && <div className="bg-red-50 text-red-600 text-xs font-bold py-3 px-4 rounded-xl text-center border border-red-100">{error}</div>}

            <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-black text-white font-bold py-5 rounded-2xl transition-all shadow-xl active:scale-95 disabled:opacity-50">
              {loading ? 'Invio in corso...' : 'Invia Link di Recupero'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
