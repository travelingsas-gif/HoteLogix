import React, { useState } from 'react';
import { Truck, CheckCircle, Package, Clock, Eye, X } from 'lucide-react';
import { Order, Property, Product } from '../types';

interface SupplierDashboardProps {
  orders: Order[];
  properties: Property[];
  products: Product[];
  onMarkDelivered: (orderId: string) => void;
}

export const SupplierDashboard: React.FC<SupplierDashboardProps> = ({ 
  orders, 
  properties, 
  products, 
  onMarkDelivered 
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter orders visible to supplier/delivery management:
  // 1. Must be status SENT (Pending Delivery) or DELIVERED (History)
  // 2. Must be type PRODUCT (Laundry is internal)
  const incomingOrders = orders
    .filter(o => o.status === 'SENT' && o.type === 'PRODUCT')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const deliveredOrders = orders
    .filter(o => o.status === 'DELIVERED' && o.type === 'PRODUCT')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getPropertyName = (id: string) => properties.find(p => p.id === id)?.name || 'Struttura Sconosciuta';
  const getPropertyAddress = (id: string) => properties.find(p => p.id === id)?.address || '';
  const getProductName = (id: string) => products.find(p => p.id === id)?.name || 'Prodotto Sconosciuto';
  const getProductUnit = (id: string) => products.find(p => p.id === id)?.unit || '';

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center space-x-4">
        <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
            <Truck className="w-8 h-8" />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Gestione Consegne (Prodotti)</h1>
            <p className="text-slate-500">Visualizza gli ordini fornitore in arrivo e conferma la ricezione della merce.</p>
        </div>
      </div>

      {/* INCOMING ORDERS */}
      <div className="space-y-4">
         <h2 className="text-lg font-bold text-slate-700 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-600" />
            Ordini in Attesa di Consegna (Inviati)
         </h2>
         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {incomingOrders.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                    <Package className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                    <p>Non ci sono ordini in transito al momento.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-blue-50 border-b border-blue-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-blue-800 uppercase tracking-wider">Struttura / Indirizzo</th>
                                <th className="px-6 py-4 text-xs font-semibold text-blue-800 uppercase tracking-wider">Data Ordine</th>
                                <th className="px-6 py-4 text-xs font-semibold text-blue-800 uppercase tracking-wider">Tipo</th>
                                <th className="px-6 py-4 text-xs font-semibold text-blue-800 uppercase tracking-wider">Articoli</th>
                                <th className="px-6 py-4 text-xs font-semibold text-blue-800 uppercase tracking-wider text-right">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {incomingOrders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-800">{getPropertyName(order.propertyId)}</div>
                                        <div className="text-xs text-slate-500">{getPropertyAddress(order.propertyId)}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-block px-2 py-1 rounded text-xs font-bold bg-orange-100 text-orange-700">
                                            PRODOTTI
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {order.items.length} articoli
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button 
                                            onClick={() => setSelectedOrder(order)}
                                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-slate-600 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => {
                                                if(confirm('Confermi la consegna di questo ordine?')) {
                                                    onMarkDelivered(order.id);
                                                }
                                            }}
                                            className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Consegna Effettuata
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
         </div>
      </div>

      {/* DELIVERED HISTORY */}
      <div className="space-y-4 pt-6 border-t border-gray-200">
         <h2 className="text-lg font-bold text-slate-700 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            Storico Ordini Consegnati
         </h2>
         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {deliveredOrders.length === 0 ? (
                <div className="p-8 text-center text-slate-400 italic">
                    Nessun ordine consegnato nello storico.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Struttura</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipo</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Dettagli</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {deliveredOrders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50/50 text-slate-500">
                                    <td className="px-6 py-4 font-medium text-slate-700">{getPropertyName(order.propertyId)}</td>
                                    <td className="px-6 py-4 text-sm">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-xs">
                                        Prodotti
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => setSelectedOrder(order)}
                                            className="text-slate-400 hover:text-slate-600"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
         </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
               <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
                   <div className="flex justify-between items-center p-6 border-b border-gray-100">
                       <div>
                           <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                               <Package className="w-5 h-5 text-slate-500" />
                               Dettaglio Ordine
                           </h2>
                           <p className="text-sm text-slate-500">
                               {getPropertyName(selectedOrder.propertyId)}
                               <br/>
                               <span className="text-xs uppercase font-mono">{getPropertyAddress(selectedOrder.propertyId)}</span>
                           </p>
                       </div>
                       <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600">
                           <X className="w-6 h-6" />
                       </button>
                   </div>

                   <div className="overflow-y-auto p-6 flex-1">
                       <table className="w-full text-left text-sm">
                           <thead className="bg-gray-50 text-slate-500 font-medium">
                               <tr>
                                   <th className="px-4 py-2 rounded-l-lg">Articolo</th>
                                   <th className="px-4 py-2 text-center rounded-r-lg">Quantità</th>
                               </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50">
                               {selectedOrder.items.map((item) => (
                                   <tr key={item.productId}>
                                       <td className="px-4 py-3">
                                           <div className="font-medium text-slate-800">{getProductName(item.productId)}</div>
                                           <div className="text-xs text-slate-400">{getProductUnit(item.productId)}</div>
                                       </td>
                                       <td className="px-4 py-3 text-center font-bold text-slate-700">
                                           {item.quantityToOrder}
                                       </td>
                                   </tr>
                               ))}
                           </tbody>
                       </table>
                   </div>

                   <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                       <button 
                           onClick={() => setSelectedOrder(null)}
                           className="px-4 py-2 text-slate-600 hover:bg-white border border-transparent hover:border-gray-200 rounded-lg transition-all"
                       >
                           Chiudi
                       </button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};