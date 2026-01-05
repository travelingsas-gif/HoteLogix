import React from 'react';
import { ArrowLeft, Box, Shirt, ShoppingCart, AlertTriangle, Edit2, Truck, Tag } from 'lucide-react';
import { Property, User } from '../types';

interface PropertyDetailProps {
  property: Property;
  onBack: () => void;
  onEdit: () => void;
  onOpenInventory: () => void;
  onOpenOrderProducts: () => void;
  onOpenLaundryInventory: () => void;
  onOpenLaundryOrder: () => void;
  onOpenIssueReport: () => void;
  onOpenUnusedLaundry: () => void;
  currentUser: User;
}

export const PropertyDetail: React.FC<PropertyDetailProps> = ({ 
  property, 
  onBack, 
  onEdit,
  onOpenInventory,
  onOpenOrderProducts,
  onOpenLaundryInventory,
  onOpenLaundryOrder,
  onOpenIssueReport,
  onOpenUnusedLaundry,
  currentUser 
}) => {
  const isAdmin = currentUser.role === 'ADMIN';
  const isOperator = currentUser.role === 'OPERATOR';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Torna indietro
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-800 uppercase tracking-tight">{property.name}</h1>
            <p className="text-slate-500 uppercase tracking-wide mt-1 text-sm">{property.address}</p>
            
            <div className="flex flex-wrap gap-3 mt-4">
              {property.alarmCode && (
                 <div className="bg-slate-100 px-3 py-1 rounded text-xs font-mono text-slate-600 border border-gray-200">
                   Allarme: <span className="font-bold">{property.alarmCode}</span>
                 </div>
              )}
              {property.accessCode && (
                 <div className="bg-slate-100 px-3 py-1 rounded text-xs font-mono text-slate-600 border border-gray-200">
                   Chiave: <span className="font-bold">{property.accessCode}</span>
                 </div>
              )}
              {property.managerEmail && (
                 <div className="bg-emerald-50 px-3 py-1 rounded text-xs font-medium text-emerald-700 border border-emerald-100">
                   {property.managerEmail}
                 </div>
              )}
            </div>
          </div>

          {isAdmin && (
            <button 
              onClick={onEdit}
              className="mt-4 md:mt-0 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center shadow-sm"
            >
              <Edit2 className="w-4 h-4 mr-2 text-emerald-600" />
              Modifica Struttura
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Inventory Card */}
        <button 
          onClick={onOpenInventory}
          className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 p-6 rounded-xl text-left transition-colors group shadow-sm"
        >
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-emerald-600 mb-4 shadow-sm group-hover:scale-110 transition-transform">
            <Box className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-emerald-900">Inventario Prodotti</h3>
          <p className="text-emerald-700/80 text-sm mt-1">
            {isOperator ? 'Compila e firma inventario' : 'Vedi ultimo inventario'}
          </p>
        </button>

        {/* Laundry Inventory Card */}
        <button 
          onClick={onOpenLaundryInventory}
          className="bg-blue-50 hover:bg-blue-100 border border-blue-100 p-6 rounded-xl text-left transition-colors group shadow-sm"
        >
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-blue-600 mb-4 shadow-sm group-hover:scale-110 transition-transform">
            <Shirt className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-blue-900">Inventario Biancheria</h3>
          <p className="text-blue-700/80 text-sm mt-1">Gestione cambio biancheria</p>
        </button>
        
        {/* Unused Laundry Card */}
        <button 
          onClick={onOpenUnusedLaundry}
          className="bg-purple-50 hover:bg-purple-100 border border-purple-100 p-6 rounded-xl text-left transition-colors group shadow-sm"
        >
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-purple-600 mb-4 shadow-sm group-hover:scale-110 transition-transform">
            <Tag className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-purple-900">Biancheria Non Usufruita</h3>
          <p className="text-purple-700/80 text-sm mt-1">Dichiara biancheria non usata</p>
        </button>

        {/* Laundry Order Card */}
        <button 
          onClick={onOpenLaundryOrder}
          className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 p-6 rounded-xl text-left transition-colors group shadow-sm"
        >
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-indigo-600 mb-4 shadow-sm group-hover:scale-110 transition-transform">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-indigo-900">Ordina Biancheria</h3>
          <p className="text-indigo-700/80 text-sm mt-1">Richiedi ritiro e consegna</p>
        </button>

         {/* Order Products Card */}
        <button 
          onClick={onOpenOrderProducts}
          className="bg-orange-50 hover:bg-orange-100 border border-orange-100 p-6 rounded-xl text-left transition-colors group shadow-sm"
        >
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-orange-600 mb-4 shadow-sm group-hover:scale-110 transition-transform">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-orange-900">Ordina Prodotti</h3>
          <p className="text-orange-700/80 text-sm mt-1">Invia ordine fornitore</p>
        </button>

         {/* Issue Reporting */}
         <button 
            onClick={onOpenIssueReport}
            className="bg-red-50 hover:bg-red-100 border border-red-100 p-6 rounded-xl text-left transition-colors group shadow-sm"
         >
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-red-600 mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-red-900">Segnala Guasto</h3>
            <p className="text-red-700/80 text-sm mt-1">Manutenzione richiesta</p>
          </button>
      </div>
    </div>
  );
};