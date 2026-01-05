import React from 'react';
import { AlertTriangle, CheckCircle, Trash2, MapPin, Calendar, User } from 'lucide-react';
import { IssueReport, Property } from '../types';

interface IssuesListProps {
  issues: IssueReport[];
  properties: Property[];
  onResolve: (id: string) => void;
  onDelete: (id: string) => void;
}

export const IssuesList: React.FC<IssuesListProps> = ({ 
  issues, 
  properties,
  onResolve, 
  onDelete 
}) => {
  // Sort issues: Open first, then by date descending
  const sortedIssues = [...issues].sort((a, b) => {
    if (a.status === b.status) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return a.status === 'OPEN' ? -1 : 1;
  });

  const getPropertyName = (id: string) => {
    return properties.find(p => p.id === id)?.name || 'Struttura Sconosciuta';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
       <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 rounded-xl bg-red-100 text-red-600">
                <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Lista Guasti e Manutenzioni</h1>
                <p className="text-slate-500">Gestisci le segnalazioni aperte dagli operatori.</p>
            </div>
       </div>

       <div className="grid grid-cols-1 gap-4">
          {sortedIssues.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="inline-flex p-4 rounded-full bg-green-50 text-green-500 mb-4">
                      <CheckCircle className="w-12 h-12" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800">Tutto tranquillo!</h3>
                  <p className="text-slate-500">Non ci sono segnalazioni di guasti al momento.</p>
              </div>
          ) : (
            sortedIssues.map((issue) => (
              <div 
                key={issue.id} 
                className={`bg-white rounded-xl border p-6 flex flex-col md:flex-row gap-6 transition-all shadow-sm hover:shadow-md ${
                    issue.status === 'OPEN' ? 'border-l-4 border-l-red-500 border-gray-100' : 'border-l-4 border-l-green-500 border-gray-100 opacity-75'
                }`}
              >
                 <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                         <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                             {issue.status === 'OPEN' ? (
                                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-bold uppercase tracking-wide">Aperto</span>
                             ) : (
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold uppercase tracking-wide">Risolto</span>
                             )}
                             <span className="text-slate-400 mx-1">•</span>
                             {getPropertyName(issue.propertyId)}
                         </h3>
                         <div className="text-xs text-slate-400 font-mono">#{issue.id.slice(-6).toUpperCase()}</div>
                    </div>
                    
                    <p className="text-slate-600 bg-gray-50 p-4 rounded-lg border border-gray-100 italic">
                        "{issue.description}"
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-2">
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1.5" />
                            {new Date(issue.date).toLocaleString()}
                        </div>
                        <div className="flex items-center">
                            <User className="w-4 h-4 mr-1.5" />
                            Segnalato da: <span className="font-medium ml-1 text-slate-700">{issue.reportedBy}</span>
                        </div>
                    </div>
                 </div>

                 <div className="flex md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                    {issue.status === 'OPEN' && (
                        <button 
                            onClick={() => onResolve(issue.id)}
                            className="flex items-center justify-center px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-medium transition-colors w-full"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Risolvi
                        </button>
                    )}
                    <button 
                        onClick={() => onDelete(issue.id)}
                        className="flex items-center justify-center px-4 py-2 bg-gray-50 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium transition-colors w-full"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Cestina
                    </button>
                 </div>
              </div>
            ))
          )}
       </div>
    </div>
  );
};