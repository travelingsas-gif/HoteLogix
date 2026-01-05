
import React from 'react';
import { CreditCard, ShieldCheck, Clock, LogOut, ArrowRight, Star } from 'lucide-react';
import { User, Tenant } from '../types';

interface SubscriptionPageProps {
  user: User;
  tenant: Tenant;
  onLogout: () => void;
}

export const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ user, tenant, onLogout }) => {
  const handleCheckout = () => {
    // Qui andrebbe la logica per reindirizzare a Stripe Checkout
    alert("Reindirizzamento a Stripe Checkout (20€/mese)...");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-emerald-600 p-8 text-white relative">
          <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-full backdrop-blur-md">
            <Star className="w-5 h-5 fill-white" />
          </div>
          <Clock className="w-12 h-12 mb-4 mx-auto opacity-90" />
          <h1 className="text-2xl font-extrabold">Trial Scaduto</h1>
          <p className="opacity-80 text-sm mt-1">Il tuo periodo gratuito di 30 giorni è terminato.</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600 shrink-0">
                <ShieldCheck size={20} />
              </div>
              <p className="text-sm text-slate-600 italic">Accesso illimitato a tutte le strutture, gestione magazzino e report guasti.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600 shrink-0">
                <CreditCard size={20} />
              </div>
              <p className="text-sm text-slate-600 italic">Supporto multi-tenant e RLS per la massima sicurezza dei tuoi dati.</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Piano Professionale</span>
            <div className="flex items-baseline justify-center gap-1 mt-1">
              <span className="text-4xl font-black text-slate-900">20€</span>
              <span className="text-slate-500 font-medium">/mese</span>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            Abbonati Ora
            <ArrowRight size={18} />
          </button>

          <button 
            onClick={onLogout}
            className="text-slate-400 text-sm font-medium hover:text-slate-600 flex items-center justify-center gap-2 mx-auto"
          >
            <LogOut size={16} />
            Esci dall'account
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-slate-400 text-xs">
        HoteLogix v2.0 • Powered by Stripe Secure Payments
      </p>
    </div>
  );
};
