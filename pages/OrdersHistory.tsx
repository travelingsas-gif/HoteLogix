import React, { useState } from 'react';
import { ShoppingCart, Shirt, Clock, CheckCircle, Send, Trash2, Edit2, Eye, X, Plus, Minus, Package, Truck, Save, ArrowDownCircle, CheckSquare, AlertTriangle } from 'lucide-react';
import { Order, Property, Product, InventoryItem } from '../types';

interface OrdersHistoryProps {
  type: 'PRODUCT' | 'LAUNDRY';
  orders: Order[];
  properties: Property[];
  products: Product[];
  onUpdate: (orderId: string, items: InventoryItem[]) => void;
  onDelete: (orderId: string) => void;
  onSend: (orderId: string) => void;
  onMarkDelivered: (orderId: string) => void; // New prop
}

export const OrdersHistory: React.FC<OrdersHistoryProps> = ({ 
    type, 
    orders, 
    properties, 
    products,
    onUpdate,
    onDelete,
    onSend,
    onMarkDelivered
}) => {
  const isProduct = type === 'PRODUCT';
  const colorClass = isProduct ? 'text-orange-600 bg-orange-100' : 'text-indigo-600 bg-indigo-100';
  const buttonClass = isProduct ? 'bg-orange-600 hover:bg-orange-700' : 'bg-indigo-600 hover:bg-indigo-700';
  const title = isProduct ? 'Ordini Prodotti' : 'Ordini Biancheria';
  const Icon = isProduct ? ShoppingCart : Shirt;

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItems, setEditingItems] = useState<InventoryItem[]>([]);
  
  // State for Confirmation Modal
  const [confirmSendId, setConfirmSendId] = useState<string | null>(null);

  // Filter orders by type
  const myOrders = orders.filter(o => o.type === type);
  
  // 1. DRAFTS (Pending)
  const pendingOrders = myOrders.filter(o => o.status === 'PENDING').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // 2. IN TRANSIT (Sent but not Delivered) - "Ordini in attesa di consegna"
  const sentOrders = myOrders.filter(o => o.status === 'SENT').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // 3. HISTORY (Delivered) - "Storico ordini consegnati"
  const deliveredOrders = myOrders.filter(o => o.status === 'DELIVERED').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getPropertyName = (id: string) => properties.find(p => p.id === id)?.name || 'Sconosciuta';
  const getProductName = (id: string) => products.find(p => p.id === id)?.name || 'Prodotto Sconosciuto';
  const getProductUnit = (id: string) => products.find(p => p.id === id)?.unit || '';

  const handleOpenModal = (order: Order) => {
      setSelectedOrder(order);
      // Deep copy items for editing
      setEditingItems(order.items.map(item => ({...item})));
      setIsModalOpen(true);
  };

  const handleCloseModal = () => {
      setSelectedOrder(null);
      setIsModalOpen(false);
  };

  const handleQuantityChange = (index: number, delta: number) => {
      const newItems = [...editingItems];
      const newVal = Math.max(0, newItems[index].quantityToOrder + delta);
      newItems[index].quantityToOrder = newVal;
      setEditingItems(newItems);
  };

  const handleSaveChanges = () => {
      if (selectedOrder) {
          const cleanItems = editingItems.filter(i => i.quantityToOrder > 0);
          if(cleanItems.length === 0) {
              if(confirm("Hai rimosso tutti i prodotti. Vuoi cestinare l'ordine?")) {
                  onDelete(selectedOrder.id);
                  handleCloseModal();
                  return;
              } else {
                  return;
              }
          }
          onUpdate(selectedOrder.id, cleanItems);
          handleCloseModal();
      }
  };

  const executeSendOrder = () => {
    if (confirmSendId) {
        onSend(confirmSendId);
        setConfirmSendId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
       <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${colorClass}`}>
                <Icon className="w-8 h-8" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
                <p className="text-slate-500">Gestisci le fasi dell'ordine: Preparazione, Invio e Storico.</p>
            </div>
       </div>

       {/* 1. TABLE: PENDING (DRAFTS) */}
       <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-700 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-yellow-500" />
                Bozze / In Attesa di Invio
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {pendingOrders.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 italic">
                        Nessun ordine in bozza.
                    </div>
                ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-yellow-50 border-b border-yellow-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-yellow-800 uppercase tracking-wider">Struttura</th>
                                <th className="px-6 py-4 text-xs font-semibold text-yellow-800 uppercase tracking-wider">Data Creazione</th>
                                <th className="px-6 py-4 text-xs font-semibold text-yellow-800 uppercase tracking-wider">Articoli</th>
                                <th className="px-6 py-4 text-xs font-semibold text-yellow-800 uppercase tracking-wider text-right">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {pendingOrders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-800">{getPropertyName(order.propertyId)}</td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                        {order.items.length} articoli
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleOpenModal(order)}
                                            className="p-2 bg-gray-100 text-slate-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                            title="Modifica"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => {
                                                if(confirm("Sei sicuro di voler cestinare questo ordine?")) onDelete(order.id);
                                            }}
                                            className="p-2 bg-gray-100 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                                            title="Cestina"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        
                                        <button 
                                            onClick={() => setConfirmSendId(order.id)}
                                            className={`flex items-center px-3 py-2 text-white rounded-lg text-sm font-medium transition-colors shadow-sm ${
                                                isProduct 
                                                ? 'bg-emerald-500 hover:bg-emerald-600' 
                                                : 'bg-blue-500 hover:bg-blue-600'
                                            }`}
                                        >
                                            <CheckSquare className="w-3 h-3 mr-2" />
                                            Contrassegna come inviato
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

       {/* 2. TABLE: IN TRANSIT (SENT) - Only visible if there are old orders or logic changes back */}
       {sentOrders.length > 0 && (
           <div className="space-y-4 pt-4 border-t border-gray-200">
                <h2 className="text-lg font-bold text-slate-700 flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-blue-500" />
                    Storico Ordini Inviati (In Attesa di Consegna)
                </h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-blue-50 border-b border-blue-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-blue-800 uppercase tracking-wider">Struttura</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-blue-800 uppercase tracking-wider">Data Invio</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-blue-800 uppercase tracking-wider">Stato</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-blue-800 uppercase tracking-wider text-right">Azioni</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {sentOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-800">{getPropertyName(order.propertyId)}</td>
                                        <td className="px-6 py-4 text-slate-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 animate-pulse">
                                                <Truck className="w-3 h-3 mr-1" />
                                                In Transito
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleOpenModal(order)}
                                                className="p-2 bg-gray-100 text-slate-600 rounded-lg hover:bg-gray-200 transition-colors"
                                                title="Vedi Dettagli"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            
                                            <button 
                                                onClick={() => {
                                                    if(confirm("Confermi che la merce è stata consegnata e verificata?")) onMarkDelivered(order.id);
                                                }}
                                                className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                                            >
                                                <ArrowDownCircle className="w-3 h-3 mr-2" />
                                                Consegna Effettuata
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
           </div>
       )}

       {/* 3. TABLE: HISTORY (DELIVERED) */}
       <div className="space-y-4 pt-4 border-t border-gray-200">
            <h2 className="text-lg font-bold text-slate-700 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Storico Ordini Consegnati
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {deliveredOrders.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 italic">
                        Nessun ordine completato nello storico.
                    </div>
                ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Struttura</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stato</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Dettagli</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {deliveredOrders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-400">#{order.id.slice(-6).toUpperCase()}</td>
                                    <td className="px-6 py-4 font-medium text-slate-800">{getPropertyName(order.propertyId)}</td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Consegnato
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => handleOpenModal(order)}
                                            className="inline-flex items-center text-slate-500 hover:text-slate-800 font-medium text-sm"
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            Apri
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

       {/* CONFIRMATION MODAL FOR SENDING */}
       {confirmSendId && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden p-6 space-y-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                            <Send className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Conferma Invio Ordine</h3>
                        <p className="text-slate-500 mt-2 text-sm">
                            Sei sicuro di voler contrassegnare questo ordine come inviato? L'ordine verrà spostato direttamente nello <strong>Storico Consegnati</strong>.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setConfirmSendId(null)}
                            className="flex-1 px-4 py-2 border border-gray-300 text-slate-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Annulla
                        </button>
                        <button 
                            onClick={executeSendOrder}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                        >
                            Conferma
                        </button>
                    </div>
                </div>
            </div>
       )}

       {/* MODAL DETAIL / EDIT */}
       {isModalOpen && selectedOrder && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
               <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                   <div className="flex justify-between items-center p-6 border-b border-gray-100">
                       <div>
                           <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                               <Package className="w-5 h-5 text-slate-500" />
                               Dettaglio Ordine
                           </h2>
                           <p className="text-sm text-slate-500">
                               {getPropertyName(selectedOrder.propertyId)} • {new Date(selectedOrder.createdAt).toLocaleString()}
                           </p>
                       </div>
                       <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                           <X className="w-6 h-6" />
                       </button>
                   </div>

                   <div className="overflow-y-auto p-6 flex-1">
                       <table className="w-full text-left text-sm">
                           <thead className="bg-gray-50 text-slate-500 font-medium">
                               <tr>
                                   <th className="px-4 py-2 rounded-l-lg">Prodotto</th>
                                   <th className="px-4 py-2 text-center rounded-r-lg">Quantità</th>
                               </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50">
                               {editingItems.map((item, index) => (
                                   <tr key={item.productId}>
                                       <td className="px-4 py-3">
                                           <div className="font-medium text-slate-800">{getProductName(item.productId)}</div>
                                           <div className="text-xs text-slate-400">{getProductUnit(item.productId)}</div>
                                       </td>
                                       <td className="px-4 py-3 text-center">
                                           {selectedOrder.status === 'PENDING' ? (
                                               <div className="flex items-center justify-center gap-2">
                                                   <button 
                                                       onClick={() => handleQuantityChange(index, -1)}
                                                       className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                                                   >
                                                       <Minus className="w-3 h-3" />
                                                   </button>
                                                   <span className="w-8 font-bold text-slate-700">{item.quantityToOrder}</span>
                                                   <button 
                                                       onClick={() => handleQuantityChange(index, 1)}
                                                       className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                                                   >
                                                       <Plus className="w-3 h-3" />
                                                   </button>
                                               </div>
                                           ) : (
                                               <span className="font-bold text-slate-700">{item.quantityToOrder}</span>
                                           )}
                                       </td>
                                   </tr>
                               ))}
                           </tbody>
                       </table>
                   </div>

                   <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                       <button 
                           onClick={handleCloseModal}
                           className="px-4 py-2 text-slate-600 hover:bg-white border border-transparent hover:border-gray-200 rounded-lg transition-all"
                       >
                           Chiudi
                       </button>
                       {selectedOrder.status === 'PENDING' && (
                           <button 
                               onClick={handleSaveChanges}
                               className={`px-6 py-2 text-white font-medium rounded-lg shadow-lg transition-all ${buttonClass}`}
                           >
                               Salva Modifiche
                           </button>
                       )}
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};