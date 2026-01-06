
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Hotel, Mail, Lock, Building, ArrowLeft, CheckCircle2, Info, Loader2 } from 'lucide-react';

interface RegisterProps {
  onBackToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onBackToLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [companyName, setCompanyName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Importante: Rimuoviamo spazi bianchi dalle stringhe
      const cleanEmail = email.trim().toLowerCase();
      const cleanCompanyName = companyName.trim();
      const cleanOwnerName = ownerName.trim();

      // Ottieni l'URL attuale per il redirect (fondamentale per Vercel/localhost)
      const redirectUrl = window.location.origin;

      const { data, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            full_name: cleanOwnerName,
            company_name: cleanCompanyName,
            role: 'OWNER'
          },
          emailRedirectTo: redirectUrl
        }
      });

      if (authError) throw authError;

      // Se data.user esiste ma data.session è null, significa che la conferma mail è attiva
      setSuccess(true);
    } catch (err: any) {
      console.error("Signup Error:", err);
      setError(err.message || 'Errore durante la registrazione. Controlla la connessione.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 text-center space-y-6 border border-emerald-100 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <Mail size={40} className="animate-bounce" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Email Inviata!</h2>
          <div className="space-y-4">
            <p className="text-slate-500 font-medium">
              Abbiamo inviato un link di attivazione a:<br/>
              <span className="text-emerald-600 font-bold break-all">{email}</span>
            </p>
            <div className="bg-amber-50 p-4 rounded-2xl text-amber-700 text-xs text-left flex gap-3 border border-amber-100">
              <Info size={18} className="shrink-0" />
              <p>Se non ricevi nulla entro 60 secondi:
                <ul className="list-disc ml-4 mt-2 font-semibold">
                  <li>Controlla la cartella <strong>Spam</strong></li>
                  <li>Verifica di aver scritto correttamente l'email</li>
                  <li>Riprova tra qualche minuto (Supabase ha dei limiti di invio orari)</li>
                </ul>
              </p>
            </div>
          </div>
          <button 
            onClick={onBackToLogin}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all"
          >
            Torna al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 py-12">
      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-xl p-8 md:p-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 border border-slate-100">
        <button onClick={onBackToLogin} className="flex items-center text-slate-400 hover:text-slate-600 transition-colors text-xs font-bold uppercase tracking-widest">
          <ArrowLeft size={16} className="mr-2" /> Torna al Login
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-600/20">
            <Hotel className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Attiva HoteLogix</h1>
          <p className="text-slate-400 font-bold text-[10px] mt-2 uppercase tracking-[0.2em]">Configurazione Nuovo Hotel</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Hotel/Azienda</label>
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold text-slate-800 bg-slate-50/50" placeholder="Es. Grand Hotel" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Titolare</label>
              <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold text-slate-800 bg-slate-50/50" placeholder="Nome e Cognome" required />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email di Amministrazione</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-slate-300" size={18} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold text-slate-800 bg-slate-50/50" placeholder="admin@hotel.com" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-slate-300" size={18} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold text-slate-800 bg-slate-50/50" placeholder="Minimo 8 caratteri" minLength={8} required />
              </div>
            </div>
          </div>

          {error && <div className="bg-red-50 text-red-600 text-xs font-bold py-3 px-4 rounded-xl text-center border border-red-100">{error}</div>}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Configurazione in corso...
              </>
            ) : (
              <>
                Inizia Trial Gratuito 30 Giorni
                <CheckCircle2 size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
