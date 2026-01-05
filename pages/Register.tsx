
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Hotel, Mail, Lock, Building, ArrowLeft, CheckCircle2, Info } from 'lucide-react';

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
      // Ottieni l'URL attuale per il redirect dopo la conferma email
      const redirectUrl = window.location.origin;

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // I metadati vengono letti dal trigger SQL creato sopra
          data: {
            full_name: ownerName,
            company_name: companyName,
            role: 'OWNER'
          },
          emailRedirectTo: redirectUrl
        }
      });

      if (authError) throw authError;

      // Supabase potrebbe restituire un utente ma con sessione nulla se l'email non è confermata
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Si è verificato un errore.');
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
          <h2 className="text-2xl font-black text-slate-900">Verifica la tua Email</h2>
          <p className="text-slate-500 font-medium">
            Abbiamo inviato un link di attivazione a <span className="text-emerald-600 font-bold">{email}</span>.
            <br/><br/>
            <span className="text-xs text-slate-400">Controlla anche nella cartella Spam se non la ricevi entro 2 minuti.</span>
          </p>
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
          <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-[0.2em]">Configurazione Nuovo Hotel</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Hotel/Azienda</label>
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold text-slate-800 bg-slate-50/50 shadow-inner" placeholder="Es. Grand Hotel" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Titolare</label>
              <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold text-slate-800 bg-slate-50/50 shadow-inner" placeholder="Nome e Cognome" required />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email di Amministrazione</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-slate-300" size={18} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold text-slate-800 bg-slate-50/50 shadow-inner" placeholder="admin@hotel.com" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Crea Password Sicura</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-slate-300" size={18} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-slate-50 focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold text-slate-800 bg-slate-50/50 shadow-inner" placeholder="Minimo 8 caratteri" minLength={8} required />
              </div>
            </div>
          </div>

          {error && <div className="bg-red-50 text-red-600 text-xs font-bold py-3 px-4 rounded-xl text-center border border-red-100">{error}</div>}

          <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-emerald-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? 'Configurazione in corso...' : 'Inizia Trial Gratuito 30 Giorni'}
            {!loading && <CheckCircle2 size={18} />}
          </button>

          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <Info size={16} className="text-emerald-600 shrink-0" />
            <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider">
              Verifica la tua identità tramite il link che riceverai. I dati sono protetti da crittografia militare.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
