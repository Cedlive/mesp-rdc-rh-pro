
export interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: string;
  updatedAt: string;
  owner: string;
  category: string;
  status: 'Vérifié' | 'En attente' | 'Rejeté';
  currentVersion: string;
}

let DOCUMENTS: DocumentFile[] = [
  {
    id: 'D1',
    name: 'Règlement Intérieur.pdf',
    type: 'PDF',
    size: '2.4 MB',
    updatedAt: '2023-01-10',
    owner: 'RH',
    category: 'Politiques',
    status: 'Vérifié',
    currentVersion: '2.1'
  }
];

export class DocumentService {
  async getAll() {
    return DOCUMENTS;
  }

  async create(data: any) {
    const doc: DocumentFile = {
      id: `D${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'En attente',
      currentVersion: '1.0',
      owner: 'Moi', // Devrait être req.user.name
      ...data
    };
    DOCUMENTS.unshift(doc);
    return doc;
  }
}
