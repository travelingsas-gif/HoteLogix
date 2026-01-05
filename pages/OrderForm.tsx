import React, { useState } from 'react';
import { ArrowLeft, Send, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Property, InventoryItem, Product } from '../types';

interface OrderFormProps {
  property: Property;
  availableProducts: Product[];
  currentStock: Record<string, number>;
  onBack: () => void;
  onSubmit: (items: InventoryItem[]) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  property,
  availableProducts,
  currentStock,
  onBack,
  onSubmit
}) => {
  const [items, setItems] = useState<InventoryItem[]>(
    availableProducts.map(p => ({
      productId: p.id,
      quantityInStock: currentStock[p.id] || 0, // Load real stock
      quantityToOrder: 0
    }))
  );

  const updateQuantity = (index: number, delta: number) => {
    const newItems = [...items];
    const currentVal = newItems[index].quantityToOrder;
    const newVal = Math.max(0, currentVal + delta);
    newItems[index].quantityToOrder = newVal;
    setItems(newItems);
  };

  const handleSubmit = () => {
    const itemsToOrder = items.filter(i => i.quantityToOrder > 0);
    if (itemsToOrder.length === 0) {
      alert("Seleziona almeno un prodotto da ordinare.");
      return;
    }
    onSubmit(items);
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
            <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                <ShoppingCart className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Nuovo Ordine: {property.name}</h2>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-orange-50 text-xs uppercase font-medium text-orange-800">
              <tr>
                <th className="px-6 py-4">Prodotto</th>
                <th className="px-6 py-4 text-center">In Magazzino (Attuale)</th>
                <th className="px-6 py-4 text-center">Da Ordinare</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item, index) => {
                const product = availableProducts.find(p => p.id === item.productId);
                if (!product) return null;

                return (
                  <tr key={item.productId} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{product.name}</div>
                      <div className="text-xs text-slate-400">{product.category === 'CLEANING' ? 'Pulizia' : 'Altro'} ({product.unit})</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                        {/* Read only stock visualization */}
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                        {item.quantityInStock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-3">
                         <button 
                          onClick={() => updateQuantity(index, -1)}
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-slate-600 hover:bg-gray-200 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className={`w-8 text-center font-bold text-lg ${item.quantityToOrder > 0 ? 'text-orange-600' : 'text-slate-300'}`}>
                          {item.quantityToOrder}
                        </span>
                        <button 
                          onClick={() => updateQuantity(index, 1)}
                          className="w-8 h-8 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 hover:bg-orange-100 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {items.length === 0 && (
                  <tr>
                      <td colSpan={3} className="p-8 text-center text-slate-400">Nessun prodotto disponibile.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSubmit}
          className="flex items-center px-8 py-3 rounded-lg text-white font-medium shadow-lg shadow-orange-600/20 transition-all bg-orange-600 hover:bg-orange-700 hover:scale-105"
        >
          <Send className="w-5 h-5 mr-2" />
          Invia Ordine
        </button>
      </div>
    </div>
  );
};