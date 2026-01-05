import React, { useState } from 'react';
import { ArrowLeft, Save, Camera, MapPin, Shield, Mail, Trash2 } from 'lucide-react';
import { Property } from '../types';

interface PropertyEditFormProps {
  property: Property;
  onBack: () => void;
  onSave: (updatedProperty: Property) => void;
}

export const PropertyEditForm: React.FC<PropertyEditFormProps> = ({ property, onBack, onSave }) => {
  const [name, setName] = useState(property.name);
  const [address, setAddress] = useState(property.address);
  const [imageUrl, setImageUrl] = useState(property.imageUrl);
  const [alarmCode, setAlarmCode] = useState(property.alarmCode || '');
  const [accessCode, setAccessCode] = useState(property.accessCode || '');
  const [managerEmail, setManagerEmail] = useState(property.managerEmail || '');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Controllo dimensione (max 5MB per Base64)
    if (file.size > 5 * 1024 * 1024) {
      alert("L'immagine è troppo grande. Massimo 5MB.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) return;

    onSave({
      ...property,
      name,
      address,
      imageUrl,
      alarmCode,
      accessCode,
      managerEmail
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300 pb-12">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Annulla
        </button>
        <h2 className="text-xl font-bold text-slate-800">Modifica Struttura</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* IMAGE UPLOAD SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-64 w-full relative group">
                <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover transition-opacity group-hover:opacity-75"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <label className="cursor-pointer bg-white px-6 py-3 rounded-xl font-bold text-slate-800 shadow-xl flex items-center gap-2 hover:scale-105 transition-transform">
                        <Camera size={20} className="text-emerald-600" />
                        Cambia Foto Copertina
                        <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>
                {isUploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
                    </div>
                )}
            </div>
            <div className="p-4 bg-slate-50 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium italic">Consigliato: Immagine orizzontale 1200x600px</p>
                <button 
                    type="button"
                    onClick={() => setImageUrl('https://picsum.photos/800/400')}
                    className="text-xs text-red-500 hover:underline font-bold"
                >
                    Ripristina Default
                </button>
            </div>
        </div>

        {/* MAIN INFO */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Nome Struttura</label>
                    <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-slate-800"
                        placeholder="Es. Metropolitan Suite"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Indirizzo Completo</label>
                    <div className="relative">
                        <MapPin size={18} className="absolute left-3 top-3.5 text-slate-300" />
                        <input 
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-slate-800"
                            placeholder="Via Roma, 123"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Codice Allarme</label>
                    <div className="relative">
                        <Shield size={18} className="absolute left-3 top-3.5 text-slate-300" />
                        <input 
                            type="text"
                            value={alarmCode}
                            onChange={(e) => setAlarmCode(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-mono"
                            placeholder="Es. 9988"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Codice Chiave / Tastierino</label>
                    <div className="relative">
                        <Shield size={18} className="absolute left-3 top-3.5 text-slate-300" />
                        <input 
                            type="text"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-mono"
                            placeholder="Es. #1234"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email Manager</label>
                    <div className="relative">
                        <Mail size={18} className="absolute left-3 top-3.5 text-slate-300" />
                        <input 
                            type="email"
                            value={managerEmail}
                            onChange={(e) => setManagerEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                            placeholder="manager@hotel.com"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-4">
            <button 
                type="button"
                onClick={onBack}
                className="px-6 py-3 text-slate-500 font-bold hover:text-slate-800 transition-colors"
            >
                Annulla
            </button>
            <button 
                type="submit"
                disabled={isUploading}
                className="px-10 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xl shadow-emerald-600/20 flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Save size={20} />
                Salva Cambiamenti
            </button>
        </div>
      </form>
    </div>
  );
};