
import React, { useState } from 'react';
import { MapPin, Plus, X, Home } from 'lucide-react';
import { Property } from '../types';

interface DashboardProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onAddProperty: (property: Property) => void;
  isAdmin: boolean;
  // Added tenantId to satisfy Property interface during creation
  tenantId: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  properties, 
  onSelectProperty, 
  onAddProperty, 
  isAdmin,
  tenantId
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Property State
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newAlarmCode, setNewAlarmCode] = useState('');
  const [newAccessCode, setNewAccessCode] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!newName || !newAddress) return;

    // Added missing 'tenantId'
    const newProperty: Property = {
        id: `prop_${Date.now()}`,
        tenantId: tenantId,
        name: newName,
        address: newAddress,
        imageUrl: newImageUrl || 'https://picsum.photos/800/400?grayscale', // Default placeholder
        alarmCode: newAlarmCode,
        accessCode: newAccessCode
    };

    onAddProperty(newProperty);
    
    // Reset and close
    setNewName('');
    setNewAddress('');
    setNewImageUrl('');
    setNewAlarmCode('');
    setNewAccessCode('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Zone e Strutture</h1>
        {isAdmin && (
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi Struttura
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div 
            key={property.id}
            onClick={() => onSelectProperty(property)}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden border border-gray-100 flex flex-col"
          >
            <div className="h-48 w-full relative bg-gray-200">
              <img 
                src={property.imageUrl} 
                alt={property.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-white font-bold text-lg">{property.name}</h3>
              </div>
            </div>
            
            <div className="p-4 flex items-center text-slate-500 text-sm">
              <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
              <span className="uppercase tracking-wide text-xs">{property.address}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ADD PROPERTY MODAL */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                  <div className="flex justify-between items-center p-6 border-b border-gray-100">
                      <h2 className="text-xl font-bold text-slate-800 flex items-center">
                          <Home className="w-5 h-5 mr-2 text-emerald-600" />
                          Nuova Struttura
                      </h2>
                      <button 
                        onClick={() => setIsModalOpen(false)}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  
                  <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Nome Struttura *</label>
                          <input 
                            type="text" 
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="Es. Villa Bellini"
                            required
                          />
                      </div>
                      
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Indirizzo *</label>
                          <input 
                            type="text" 
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="Via Etnea, 100"
                            required
                          />
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">URL Immagine (Opzionale)</label>
                          <input 
                            type="text" 
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="https://..."
                          />
                          <p className="text-xs text-slate-400 mt-1">Lascia vuoto per immagine predefinita</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Codice Allarme</label>
                              <input 
                                type="text" 
                                value={newAlarmCode}
                                onChange={(e) => setNewAlarmCode(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="1234"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Codice Chiave</label>
                              <input 
                                type="text" 
                                value={newAccessCode}
                                onChange={(e) => setNewAccessCode(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="#9999"
                              />
                          </div>
                      </div>

                      <div className="pt-4 flex justify-end gap-3">
                          <button 
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-slate-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                              Annulla
                          </button>
                          <button 
                            type="submit"
                            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-lg shadow-emerald-600/20 transition-all"
                          >
                              Salva Struttura
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};
