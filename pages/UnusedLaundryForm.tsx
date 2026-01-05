import React, { useState } from 'react';
import { ArrowLeft, Save, Plus, Minus, Tag, PenTool } from 'lucide-react';
import { Property, Product } from '../types';

interface UnusedLaundryFormProps {
  property: Property;
  laundryProducts: Product[];
  onBack: () => void;
  onSubmit: (items: { productId: string; quantity: number }[], signature: string) => void;
}

export const UnusedLaundryForm: React.FC<UnusedLaundryFormProps> = ({
  property,
  laundryProducts,
  onBack,
  onSubmit
}) => {
  const [items, setItems] = useState(
    laundryProducts.map(p => ({
      productId: p.id,
      quantity: 0
    }))
  );

  const [signatureName, setSignatureName] = useState('');

  const updateQuantity = (index: number, delta: number) => {
    const newItems = [...items];
    const currentVal = newItems[index].quantity;
    const newVal = Math.max(0, currentVal + delta);
    newItems[index].quantity = newVal;
    setItems(newItems);
  };

  const handleSubmit = () => {
    // We allow submitting even if 0, effectively saying "everything used", 
    // but usually users report what is LEFT unused.
    
    if (!signatureName.trim()) {
      alert("È necessario digitare il nome per firmare.");
      return;
    }
    
    // Filter out items with 0 quantity if desired, or send all. 
    // Sending all allows tracking that 0 were unused.
    onSubmit(items, signatureName);
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
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                <Tag className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Biancheria Non Usufruita: {property.name}</h2>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-purple-50 text-purple-900 text-sm border-b border-purple-100">
            Dichiarazione della biancheria che <strong>NON</strong> è stata utilizzata durante il servizio.
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-gray-50 text-xs uppercase font-medium text-slate-500">
              <tr>
                <th className="px-6 py-4">Biancheria</th>
                <th className="px-6 py-4 text-center">Quantità NON Usata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item, index) => {
                const product = laundryProducts.find(p => p.id === item.productId);
                if (!product) return null;

                return (
                  <tr key={item.productId} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{product.name}</div>
                      <div className="text-xs text-slate-400">{product.unit}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-3">
                        <button 
                          onClick={() => updateQuantity(index, -1)}
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-slate-600 hover:bg-gray-200 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className={`w-8 text-center font-bold text-lg ${item.quantity > 0 ? 'text-purple-600' : 'text-slate-300'}`}>
                            {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(index, 1)}
                          className="w-8 h-8 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 hover:bg-purple-100 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800 flex items-center">
            <PenTool className="w-4 h-4 mr-2 text-purple-600" />
            Firma Operatore
          </h3>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
             <label className="block text-sm font-medium text-slate-600 mb-2">Digita il tuo nome per firmare</label>
             <input 
                type="text"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                placeholder="Es. Maria Rossi"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white font-handwriting text-lg"
             />
             <p className="text-xs text-slate-400 mt-2">Dichiaro che i quantitativi sopra indicati non sono stati utilizzati.</p>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSubmit}
          className={`flex items-center px-8 py-3 rounded-lg text-white font-medium shadow-lg shadow-purple-600/20 transition-all ${
            signatureName.trim() ? 'bg-purple-600 hover:bg-purple-700 hover:scale-105' : 'bg-slate-300 cursor-not-allowed'
          }`}
          disabled={!signatureName.trim()}
        >
          <Save className="w-5 h-5 mr-2" />
          Registra Dichiarazione
        </button>
      </div>
    </div>
  );
};