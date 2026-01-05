import React, { useState } from 'react';
import { ArrowLeft, Save, Plus, Minus, Box, PenTool, Clock } from 'lucide-react';
import { Property, InventoryItem, Product } from '../types';

interface InventoryFormProps {
  property: Property;
  availableProducts: Product[];
  currentStock: Record<string, number>;
  lastSubmission?: { date: string; operator: string } | null;
  onBack: () => void;
  onSubmit: (items: InventoryItem[], signature: string) => void;
}

export const InventoryForm: React.FC<InventoryFormProps> = ({
  property,
  availableProducts,
  currentStock,
  lastSubmission,
  onBack,
  onSubmit
}) => {
  const [items, setItems] = useState<InventoryItem[]>(
    availableProducts.map(p => ({
      productId: p.id,
      quantityInStock: currentStock[p.id] || 0,
      quantityToOrder: 0
    }))
  );

  const [signatureName, setSignatureName] = useState('');

  const updateQuantity = (index: number, delta: number) => {
    const newItems = [...items];
    const currentVal = newItems[index].quantityInStock;
    const newVal = Math.max(0, currentVal + delta);
    newItems[index].quantityInStock = newVal;
    setItems(newItems);
  };

  const handleSubmit = () => {
    if (!signatureName.trim()) {
      alert("È necessario digitare il nome per firmare l'inventario.");
      return;
    }
    onSubmit(items, signatureName);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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
        <div className="flex items-center gap-2">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600 shadow-sm">
                <Box className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Inventario: {property.name}</h2>
        </div>
      </div>

      {/* ULTIMA DICHIARAZIONE BOX */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <Clock className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
          <div className="text-sm">
              <span className="font-bold text-emerald-800 uppercase tracking-tight">Ultimo Inventario:</span>
              {lastSubmission ? (
                  <p className="text-emerald-700 mt-0.5">
                      Inviato il <span className="font-bold">{formatDate(lastSubmission.date)}</span> da <span className="font-bold underline">{lastSubmission.operator}</span>
                  </p>
              ) : (
                  <p className="text-emerald-600 mt-0.5 italic">Nessun dato precedente registrato per questa struttura.</p>
              )}
          </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-emerald-600 text-xs uppercase font-bold text-white tracking-widest">
              <tr>
                <th className="px-6 py-4">Prodotto</th>
                <th className="px-6 py-4 text-center">In Magazzino (Modifica)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item, index) => {
                const product = availableProducts.find(p => p.id === item.productId);
                if (!product) return null;

                return (
                  <tr key={item.productId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{product.name}</div>
                      <div className="text-xs text-slate-400 font-medium uppercase">{product.unit}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-4">
                        <button 
                          onClick={() => updateQuantity(index, -1)}
                          className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-all active:scale-90"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="w-10 text-center font-black text-xl text-emerald-700">{item.quantityInStock}</span>
                        <button 
                          onClick={() => updateQuantity(index, 1)}
                          className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-all active:scale-90 shadow-sm"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-slate-800 flex items-center mb-4">
          <PenTool className="w-4 h-4 mr-2 text-emerald-600" />
          Firma Operatore
        </h3>
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">
             <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Digita il tuo nome per validare</label>
             <input 
                type="text"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                placeholder="Nome e Cognome"
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all bg-white font-serif italic text-2xl text-slate-700"
             />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSubmit}
          className={`flex items-center px-10 py-4 rounded-xl text-white font-bold shadow-xl transition-all ${
            signatureName.trim() ? 'bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] shadow-emerald-600/30' : 'bg-slate-300 cursor-not-allowed shadow-none'
          }`}
          disabled={!signatureName.trim()}
        >
          <Save className="w-5 h-5 mr-2" />
          Salva Magazzino
        </button>
      </div>
    </div>
  );
};