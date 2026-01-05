import React from 'react';
import { ClipboardList, Calendar, User, MapPin } from 'lucide-react';
import { UnusedLaundryReport, Product, Property } from '../types';

interface LaundryLogProps {
  reports: UnusedLaundryReport[];
  products: Product[];
  properties: Property[];
}

export const LaundryLog: React.FC<LaundryLogProps> = ({ reports, products, properties }) => {
  // Sort by date desc
  const sortedReports = [...reports].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getProductName = (id: string) => products.find(p => p.id === id)?.name || 'Sconosciuto';
  const getProperty = (id: string) => properties.find(p => p.id === id);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
       <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                <ClipboardList className="w-8 h-8" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Log Biancheria Non Usufruita</h1>
                <p className="text-slate-500">Storico delle dichiarazioni inviate dagli operatori.</p>
            </div>
       </div>

       <div className="grid grid-cols-1 gap-4">
          {sortedReports.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-medium text-slate-800">Nessun dato registrato</h3>
                  <p className="text-slate-500">Non ci sono ancora dichiarazioni di biancheria non usufruita.</p>
              </div>
          ) : (
            sortedReports.map((report) => {
              const property = getProperty(report.propertyId);
              const itemsWithQuantity = report.items.filter(i => i.quantity > 0);

              return (
                <div key={report.id} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex flex-col md:flex-row justify-between mb-4 pb-4 border-b border-gray-50 gap-4">
                      <div>
                          <div className="flex items-center text-lg font-bold text-slate-800 mb-1">
                             <MapPin className="w-4 h-4 mr-2 text-purple-600" />
                             {property?.name || 'Struttura Sconosciuta'}
                          </div>
                          <div className="text-sm text-slate-400 font-mono">ID: {report.id.slice(-6).toUpperCase()}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center text-sm text-slate-600">
                              <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                              {new Date(report.date).toLocaleString()}
                          </div>
                          <div className="flex items-center text-sm text-slate-600">
                              <User className="w-4 h-4 mr-2 text-slate-400" />
                              Firmato: <span className="font-medium ml-1">{report.reportedBy}</span>
                          </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {itemsWithQuantity.length > 0 ? (
                          itemsWithQuantity.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-purple-50 rounded-lg px-3 py-2 border border-purple-100">
                                  <span className="text-sm text-purple-900 font-medium">{getProductName(item.productId)}</span>
                                  <span className="text-sm font-bold text-purple-700 bg-white px-2 py-0.5 rounded shadow-sm border border-purple-100">
                                      {item.quantity}
                                  </span>
                              </div>
                          ))
                      ) : (
                          <div className="text-sm text-slate-400 italic">Nessuna biancheria dichiarata come non usufruita.</div>
                      )}
                   </div>
                </div>
              );
            })
          )}
       </div>
    </div>
  );
};