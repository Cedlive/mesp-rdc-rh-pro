
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MOCK_DOCUMENTS } from '../constants';
import { DocumentFile, DocumentVersion } from '../types';
import ResourceService from '../services/resourceService';
import { FileText, Download, Upload, Search, X, Square, CheckSquare, Plus, List, Grid, History, RotateCcw, Eye } from 'lucide-react';

export const Documents = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentFile | null>(null);
  
  const [newDocData, setNewDocData] = useState({ name: '', category: 'Politiques', type: 'PDF', officialType: 'other' });
  const versionFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      loadData();
  }, []);

  const loadData = async () => {
      try {
          const res = await ResourceService.getDocuments();
          setDocuments(res.data);
      } catch (e) {
          setDocuments(MOCK_DOCUMENTS);
      }
  };

  const filteredDocs = useMemo(() => documents.filter(doc => (activeCategory === 'All' || doc.category === activeCategory) && (doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || doc.type.toLowerCase().includes(searchQuery.toLowerCase()))), [activeCategory, searchQuery, documents]);

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await ResourceService.createDocument({
            name: newDocData.name + (newDocData.type === 'PDF' ? '.pdf' : '.docx'),
            type: newDocData.type as any,
            size: '150 KB',
            owner: 'Moi',
            category: newDocData.category as any,
            status: 'En attente',
            currentVersion: '1.0',
            versions: []
        });
        setDocuments([res.data, ...documents]);
        setIsAddModalOpen(false);
        window.dispatchEvent(new CustomEvent('app-alert', { detail: { title: 'Succès', message: 'Document ajouté.', type: 'success' } }));
    } catch (e) { alert("Erreur ajout"); }
  };

  const handleUploadNewVersion = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && selectedDocument) {
          const oldVersion: DocumentVersion = {
              id: `v_${Date.now()}`,
              versionNumber: selectedDocument.currentVersion,
              updatedAt: selectedDocument.updatedAt,
              updatedBy: selectedDocument.owner,
              size: selectedDocument.size,
              comment: 'Version archivée'
          };
          const newVerNum = (parseFloat(selectedDocument.currentVersion) + 0.1).toFixed(1);
          const updatedDoc = {
              ...selectedDocument,
              currentVersion: newVerNum,
              updatedAt: new Date().toISOString().split('T')[0],
              size: `${(file.size / 1024).toFixed(1)} KB`,
              versions: [oldVersion, ...(selectedDocument.versions || [])]
          };
          setDocuments(documents.map(d => d.id === selectedDocument.id ? updatedDoc : d));
          setSelectedDocument(updatedDoc);
          window.dispatchEvent(new CustomEvent('app-alert', { detail: { title: 'Nouvelle version', message: `Version ${newVerNum} téléversée.`, type: 'success' } }));
      }
  };

  return (
    <div className="animate-fade-in space-y-6 relative pb-10">
      {isAddModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50"><h3 className="font-bold text-gray-800">Téléverser Document</h3><button onClick={() => setIsAddModalOpen(false)} className="p-1 hover:bg-gray-200 rounded-full"><X size={20}/></button></div>
                <form onSubmit={handleAddDocument} className="p-6 space-y-4">
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Nom du fichier..." value={newDocData.name} onChange={e => setNewDocData({...newDocData, name: e.target.value})} required />
                    <div className="grid grid-cols-2 gap-4">
                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" value={newDocData.category} onChange={e => setNewDocData({...newDocData, category: e.target.value})}>{['Politiques', 'Contrats', 'Finance', 'Personnel'].map(c => <option key={c} value={c}>{c}</option>)}</select>
                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" value={newDocData.type} onChange={e => setNewDocData({...newDocData, type: e.target.value})}>{['PDF', 'DOC', 'XLS', 'IMG'].map(t => <option key={t} value={t}>{t}</option>)}</select>
                    </div>
                    <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all flex justify-center items-center gap-2"><Upload size={18}/> Enregistrer</button>
                </form>
            </div>
         </div>
      )}

      {selectedDocument && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setSelectedDocument(null)}></div>
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto transform transition-transform animate-in slide-in-from-right duration-300 flex flex-col">
             <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-start">
                <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${selectedDocument.type === 'PDF' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}><FileText size={24} /></div>
                    <div><h2 className="text-lg font-bold text-slate-800 leading-tight">{selectedDocument.name}</h2><span className="inline-block mt-1 px-2 py-0.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-500">v{selectedDocument.currentVersion}</span></div>
                </div>
                <button onClick={() => setSelectedDocument(null)} className="p-2 bg-white hover:bg-slate-200 rounded-full transition-colors text-slate-500"><X size={20}/></button>
             </div>
             <div className="p-6 space-y-8 flex-1 bg-white">
                 <div className="grid grid-cols-2 gap-4">
                     <div className="p-3 bg-slate-50 rounded-lg border border-slate-100"><p className="text-xs text-slate-400 mb-1">Taille</p><p className="font-semibold text-slate-700">{selectedDocument.size}</p></div>
                     <div className="p-3 bg-slate-50 rounded-lg border border-slate-100"><p className="text-xs text-slate-400 mb-1">Propriétaire</p><p className="font-semibold text-slate-700">{selectedDocument.owner}</p></div>
                 </div>
                 <div>
                     <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-slate-800 flex items-center gap-2"><History size={18} className="text-blue-600"/> Historique</h3><button onClick={() => versionFileInputRef.current?.click()} className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded flex items-center gap-1"><Upload size={12}/> Update</button><input type="file" ref={versionFileInputRef} className="hidden" onChange={handleUploadNewVersion} /></div>
                     <div className="relative pl-4 border-l-2 border-slate-100 space-y-6">
                         <div className="relative"><div className="absolute -left-[21px] top-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white ring-1 ring-green-100"></div><div className="flex justify-between items-start"><div><p className="text-sm font-bold text-slate-800">v{selectedDocument.currentVersion} (Actuelle)</p><p className="text-xs text-slate-500 mt-0.5">{selectedDocument.updatedAt}</p></div></div></div>
                         {selectedDocument.versions?.map((version) => (
                             <div key={version.id} className="relative group"><div className="absolute -left-[21px] top-0 w-3 h-3 bg-slate-300 rounded-full border-2 border-white"></div><div className="flex justify-between items-start"><div><p className="text-sm font-medium text-slate-600">v{version.versionNumber}</p><p className="text-xs text-slate-400 mt-0.5">{version.updatedAt}</p></div><button className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1"><RotateCcw size={10} /> Restaurer</button></div></div>
                         ))}
                     </div>
                 </div>
             </div>
             <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2"><button className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center gap-2"><Download size={18} /> Télécharger</button></div>
          </div>
        </>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div><h2 className="text-2xl font-bold text-gray-800">Gestion Documentaire</h2><p className="text-gray-500">Archives numérisées et contrats.</p></div>
        <div className="flex gap-3">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><input type="text" placeholder="Rechercher..." className="pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 shadow-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/></div>
            <div className="flex bg-white rounded-xl border border-gray-200 p-1"><button onClick={()=>setViewMode('list')} className={`p-2 rounded-lg ${viewMode==='list'?'bg-slate-100 text-slate-800':'text-gray-400'}`}><List size={18}/></button><button onClick={()=>setViewMode('grid')} className={`p-2 rounded-lg ${viewMode==='grid'?'bg-slate-100 text-slate-800':'text-gray-400'}`}><Grid size={18}/></button></div>
            <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg flex items-center gap-2"><Plus size={18} /> Ajouter</button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">{['All', 'Politiques', 'Contrats', 'Finance', 'Personnel'].map(cat => (<button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${activeCategory === cat ? 'bg-slate-800 text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-200 hover:bg-slate-50'}`}>{cat}</button>))}</div>

      {viewMode === 'list' ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold"><tr><th className="px-6 py-4 w-10"><Square size={16}/></th><th className="px-6 py-4">Nom</th><th className="px-6 py-4">Catégorie</th><th className="px-6 py-4">Version</th><th className="px-6 py-4">Taille</th><th className="px-6 py-4">Date</th><th className="px-6 py-4 text-right">Action</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredDocs.map(doc => (
                        <tr key={doc.id} className="hover:bg-slate-50 group transition-colors cursor-pointer" onClick={() => setSelectedDocument(doc)}>
                            <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}><button onClick={()=>{const s=new Set(selectedIds); if(s.has(doc.id))s.delete(doc.id); else s.add(doc.id); setSelectedIds(s);}} className="text-gray-400 hover:text-blue-600">{selectedIds.has(doc.id)?<CheckSquare size={18} className="text-blue-600"/>:<Square size={18}/>}</button></td>
                            <td className="px-6 py-4"><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded flex items-center justify-center ${doc.type==='PDF'?'bg-red-100 text-red-600':'bg-blue-100 text-blue-600'}`}><FileText size={16}/></div><span className="font-medium text-slate-800">{doc.name}</span></div></td>
                            <td className="px-6 py-4"><span className="px-2 py-1 rounded text-[10px] bg-slate-100 font-bold text-slate-600 border border-slate-200">{doc.category}</span></td>
                            <td className="px-6 py-4 text-slate-600 font-medium">v{doc.currentVersion}</td>
                            <td className="px-6 py-4 font-mono text-slate-500">{doc.size}</td>
                            <td className="px-6 py-4 text-slate-500">{doc.updatedAt}</td>
                            <td className="px-6 py-4 text-right"><div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button className="p-1.5 hover:bg-blue-50 text-blue-600 rounded" title="Détails" onClick={(e) => { e.stopPropagation(); setSelectedDocument(doc); }}><Eye size={16}/></button><button className="p-1.5 hover:bg-blue-50 text-blue-600 rounded" title="Télécharger"><Download size={16}/></button></div></td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
      ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredDocs.map(doc => (
                  <div key={doc.id} onClick={() => setSelectedDocument(doc)} className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all group relative cursor-pointer">
                      <div className={`h-24 rounded-lg mb-3 flex items-center justify-center ${doc.type==='PDF'?'bg-red-50 text-red-500':'bg-blue-50 text-blue-500'}`}><FileText size={40}/></div>
                      <h4 className="font-bold text-sm text-slate-800 truncate mb-1" title={doc.name}>{doc.name}</h4>
                      <div className="flex justify-between items-center text-xs text-slate-400"><span>v{doc.currentVersion} • {doc.size}</span><span>{doc.type}</span></div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"><button className="p-1 bg-white shadow rounded-md hover:text-blue-600"><Download size={14}/></button></div>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};
