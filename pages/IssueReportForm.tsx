import React, { useState } from 'react';
import { ArrowLeft, Save, AlertTriangle, PenTool } from 'lucide-react';
import { Property } from '../types';

interface IssueReportFormProps {
  property: Property;
  onBack: () => void;
  onSubmit: (description: string, signature: string) => void;
}

export const IssueReportForm: React.FC<IssueReportFormProps> = ({
  property,
  onBack,
  onSubmit
}) => {
  const [description, setDescription] = useState('');
  const [signatureName, setSignatureName] = useState('');

  const handleSubmit = () => {
    if (!description.trim()) {
      alert("Inserisci una descrizione del guasto.");
      return;
    }
    if (!signatureName.trim()) {
      alert("È necessario firmare la segnalazione.");
      return;
    }
    onSubmit(description, signatureName);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Annulla
        </button>
        <div className="flex items-center gap-2">
            <div className="bg-red-100 p-2 rounded-lg text-red-600">
                <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Segnala Guasto: {property.name}</h2>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Descrizione del problema</label>
            <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrivi qui il guasto o la manutenzione richiesta..."
                className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none"
            />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
             <div className="flex items-center mb-2">
                <PenTool className="w-4 h-4 mr-2 text-red-600" />
                <label className="block text-sm font-bold text-slate-700">Firma Operatore</label>
             </div>
             <input 
                type="text"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                placeholder="Digita il tuo nome per firmare"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all bg-white font-handwriting text-lg"
             />
             <p className="text-xs text-slate-400 mt-2">La firma conferma la richiesta di intervento.</p>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSubmit}
          className={`flex items-center px-8 py-3 rounded-lg text-white font-medium shadow-lg shadow-red-600/20 transition-all ${
            description.trim() && signatureName.trim() ? 'bg-red-600 hover:bg-red-700 hover:scale-105' : 'bg-slate-300 cursor-not-allowed'
          }`}
          disabled={!description.trim() || !signatureName.trim()}
        >
          <Save className="w-5 h-5 mr-2" />
          Inserisci Guasto
        </button>
      </div>
    </div>
  );
};