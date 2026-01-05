
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Mail, ArrowLeft, Key, CheckCircle2, ShieldAlert } from 'lucide-react';

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
      // FORZIAMO l'URL di redirect per assicurarci che Supabase sappia dove tornare.
      // Usiamo l'origine attuale (https://hote-logix.vercel.app o localhost)
      const currentOrigin = window.location.origin;
      const redirectUrl = currentOrigin.endsWith('/') ? currentOrigin : `${currentOrigin}/`;
      
      console.log("Richiesta reset con redirect a:", redirectUrl);

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      if (resetError) throw resetError;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Email non valida o errore di sistema.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-10 space-y-8 border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
        <button onClick={onBack} className="flex items-center text-slate-400 hover:text-emerald-600 transition-colors text-[10px] font-black uppercase tracking-widest group">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Torna al Login
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-600">
            <Key className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Recupero Account</h1>
          <p className="text-slate-400 font-bold text-[10px] mt-2 uppercase tracking-[0.2em]">HoteLogix Security Center</p>
        </div>

        {success ? (
          <div className="bg-emerald-50 border-2 border-emerald-100 p-8 rounded-[2rem] text-center space-y-4 animate-in zoom-in-90">
            <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white shadow-lg">
                <CheckCircle2 size={28} />
            </div>
            <div className="space-y-2">
                <p className="text-emerald-800 font-black text-sm uppercase tracking-tight">Email Inviata con Successo!</p>
                <p className="text-emerald-600/80 text-xs font-medium leading-relaxed">
                    Abbiamo inviato un link sicuro a <strong>{email}</strong>.<br/>Clicca sul pulsante nel messaggio per accedere alla pagina di creazione nuova password.
                </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleResetRequest} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Inserisci la tua Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-slate-300" size={18} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold text-slate-800 bg-slate-50/50" 
                  placeholder="admin@hotel.com" 
                  required 
                />
              </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-wider bg-red-50 p-4 rounded-xl border border-red-100">
                    <ShieldAlert size={14} />
                    {error}
                </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-black text-white font-bold py-5 rounded-2xl transition-all shadow-xl active:scale-95 disabled:opacity-50">
              {loading ? 'Generazione link...' : 'Richiedi Cambio Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
