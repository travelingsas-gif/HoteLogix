
import React, { useState } from 'react';
import { Layers, Plus, Trash2, Edit2, Check, X, Tag, Package } from 'lucide-react';
import { Product } from '../types';

interface ProductManagerProps {
  products: Product[];
  onAdd: (product: Product) => void;
  onUpdate: (product: Product) => void;
  onDelete: (id: string) => void;
  // Added tenantId to satisfy Product interface during creation
  tenantId: string;
}

export const ProductManager: React.FC<ProductManagerProps> = ({ products, onAdd, onUpdate, onDelete, tenantId }) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'CLEANING' | 'LAUNDRY'>('ALL');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [category, setCategory] = useState<'CLEANING' | 'BREAKFAST' | 'BATHROOM' | 'OTHER' | 'LAUNDRY'>('CLEANING');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !unit) return;

    if (isEditing && editId) {
        onUpdate({
            id: editId,
            tenantId: tenantId,
            name,
            unit,
            category,
            defaultQuantity: 0
        });
        resetForm();
    } else {
        // Added missing 'tenantId'
        const newProduct: Product = {
            id: `new_${Date.now()}`,
            tenantId: tenantId,
            name,
            unit,
            category,
            defaultQuantity: 0
        };
        onAdd(newProduct);
        resetForm();
    }
  };

  const resetForm = () => {
    setName('');
    setUnit('');
    setCategory('CLEANING');
    setIsEditing(false);
    setEditId(null);
  };

  const handleEditClick = (p: Product) => {
    setIsEditing(true);
    setEditId(p.id);
    setName(p.name);
    setUnit(p.unit);
    setCategory(p.category);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = products.filter(p => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'CLEANING') return p.category !== 'LAUNDRY';
    if (activeTab === 'LAUNDRY') return p.category === 'LAUNDRY';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-1">
         <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600 shadow-sm">
            <Layers className="w-8 h-8" />
         </div>
         <div>
            <h1 className="text-2xl font-bold text-slate-800">Magazzino & Prodotti</h1>
            <p className="text-slate-500 text-sm">Configura l'elenco degli articoli gestiti nel portale.</p>
         </div>
      </div>

      {/* TABS SELECTION */}
      <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
          <button 
            onClick={() => setActiveTab('ALL')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'ALL' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Tutti
          </button>
          <button 
            onClick={() => setActiveTab('CLEANING')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'CLEANING' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Prodotti
          </button>
          <button 
            onClick={() => setActiveTab('LAUNDRY')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'LAUNDRY' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Biancheria
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* FORM COLUMN */}
          <div className="lg:col-span-1 sticky top-8">
              <div className={`p-6 rounded-2xl shadow-sm border transition-all ${isEditing ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}>
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                    {isEditing ? <Edit2 className="w-5 h-5 mr-2 text-amber-600" /> : <Plus className="w-5 h-5 mr-2 text-emerald-600" />}
                    {isEditing ? 'Modifica Articolo' : 'Nuovo Articolo'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nome Prodotto</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Es. Detergente Pavimenti"
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Unità</label>
                            <input 
                                type="text" 
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                placeholder="Pezzi, L..."
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tipo</label>
                            <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value as any)}
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none"
                            >
                                <option value="CLEANING">Prodotto</option>
                                <option value="LAUNDRY">Biancheria</option>
                                <option value="BATHROOM">Bagno</option>
                                <option value="BREAKFAST">Colazione</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col gap-2">
                        <button 
                            type="submit"
                            className={`w-full py-3 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${isEditing ? 'bg-amber-600 shadow-amber-600/20' : 'bg-emerald-600 shadow-emerald-600/20'}`}
                        >
                            {isEditing ? 'Salva Modifiche' : 'Aggiungi Prodotto'}
                        </button>
                        {isEditing && (
                            <button 
                                type="button"
                                onClick={resetForm}
                                className="w-full py-2 text-slate-500 font-medium hover:text-slate-800 transition-colors"
                            >
                                Annulla
                            </button>
                        )}
                    </div>
                </form>
              </div>
          </div>

          {/* LIST COLUMN */}
          <div className="lg:col-span-2 space-y-4">
               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Articolo</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Tipo</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Azioni</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredProducts.map(p => (
                                    <tr key={p.id} className={`group hover:bg-slate-50/50 transition-colors ${editId === p.id ? 'bg-amber-50/50' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${p.category === 'LAUNDRY' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                                    {p.category === 'LAUNDRY' ? <Tag size={16} /> : <Package size={16} />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800">{p.name}</div>
                                                    <div className="text-xs text-slate-400 font-medium uppercase">{p.unit}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter border ${p.category === 'LAUNDRY' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                                                {p.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => handleEditClick(p)}
                                                    className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                                    title="Modifica"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        if(confirm(`Sei sicuro di voler eliminare definitivamente ${p.name}?`)) onDelete(p.id);
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Elimina"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-slate-400 italic">
                                            Nessun prodotto trovato in questa categoria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
               </div>
          </div>
      </div>
    </div>
  );
};
