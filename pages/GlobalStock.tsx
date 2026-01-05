import React, { useState } from 'react';
import { Package, Search, Filter } from 'lucide-react';
import { Product, Property } from '../types';

interface GlobalStockProps {
  products: Product[];
  stockData: Record<string, Record<string, number>>;
  properties: Property[];
}

export const GlobalStock: React.FC<GlobalStockProps> = ({ products, stockData, properties }) => {
  const [filterType, setFilterType] = useState<'ALL' | 'PRODUCT' | 'LAUNDRY'>('ALL');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('ALL');

  const filteredProducts = products.filter(p => {
    if (filterType === 'PRODUCT') return p.category !== 'LAUNDRY';
    if (filterType === 'LAUNDRY') return p.category === 'LAUNDRY';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                <Package className="w-6 h-6" />
             </div>
             <h1 className="text-2xl font-bold text-slate-800">Magazzino Aggiornato</h1>
           </div>
           <p className="text-slate-500">Stato attuale dello stock basato sugli ultimi inventari inviati.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
             {/* Property Filter */}
            <select 
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                className="bg-white border border-gray-300 text-slate-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 outline-none shadow-sm"
            >
                <option value="ALL">Tutte le Strutture</option>
                {properties.map(prop => (
                    <option key={prop.id} value={prop.id}>{prop.name}</option>
                ))}
            </select>

             {/* Type Filter */}
            <div className="inline-flex rounded-md shadow-sm" role="group">
                <button 
                    type="button" 
                    onClick={() => setFilterType('ALL')}
                    className={`px-4 py-2 text-sm font-bold border rounded-l-lg transition-colors ${filterType === 'ALL' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-gray-200 hover:bg-gray-100'}`}
                >
                    Tutti
                </button>
                <button 
                    type="button" 
                    onClick={() => setFilterType('PRODUCT')}
                    className={`px-4 py-2 text-sm font-bold border-t border-b transition-colors ${filterType === 'PRODUCT' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-700 border-gray-200 hover:bg-gray-100'}`}
                >
                    Prodotti
                </button>
                <button 
                    type="button" 
                    onClick={() => setFilterType('LAUNDRY')}
                    className={`px-4 py-2 text-sm font-bold border rounded-r-lg transition-colors ${filterType === 'LAUNDRY' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-gray-200 hover:bg-gray-100'}`}
                >
                    Biancheria
                </button>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Prodotto</th>
                <th className="px-6 py-4">Categoria</th>
                {selectedPropertyId === 'ALL' ? (
                     properties.map(prop => (
                         <th key={prop.id} className="px-4 py-4 text-center truncate max-w-[120px]" title={prop.name}>
                             {prop.name}
                         </th>
                     ))
                ) : (
                    <th className="px-6 py-4 text-center">Quantità in Stock</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product) => {
                 const isLaundry = product.category === 'LAUNDRY';
                 const badgeClass = isLaundry 
                    ? 'bg-blue-50 text-blue-700 border-blue-100' 
                    : 'bg-orange-50 text-orange-700 border-orange-100';
                 
                 return (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800">
                            {product.name}
                            <span className="block text-[10px] text-slate-400 font-normal uppercase mt-0.5 tracking-wider">{product.unit}</span>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${badgeClass}`}>
                                {isLaundry ? 'BIANCHERIA' : 'PRODOTTO'}
                            </span>
                        </td>
                        
                        {selectedPropertyId === 'ALL' ? (
                             properties.map(prop => {
                                 const qty = stockData[prop.id]?.[product.id] || 0;
                                 return (
                                     <td key={prop.id} className="px-4 py-4 text-center">
                                         <span className={`font-mono font-bold px-2 py-1 rounded text-sm ${qty === 0 ? 'text-slate-300' : 'text-slate-700 bg-gray-50'}`}>
                                            {qty}
                                         </span>
                                     </td>
                                 )
                             })
                        ) : (
                            <td className="px-6 py-4 text-center">
                                 <span className={`text-lg font-bold px-4 py-1 rounded-lg ${ (stockData[selectedPropertyId]?.[product.id] || 0) > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-slate-300'}`}>
                                    {stockData[selectedPropertyId]?.[product.id] || 0}
                                 </span>
                            </td>
                        )}
                    </tr>
                 );
              })}
              {filteredProducts.length === 0 && (
                  <tr>
                      <td colSpan={properties.length + 2} className="px-6 py-12 text-center text-slate-400 italic">
                          Nessun prodotto trovato nella selezione attuale.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};