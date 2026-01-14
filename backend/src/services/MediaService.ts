
import { logger } from '../utils/logger';

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string; // URL accessible (ex: /uploads/...)
  ownerId: string;
  visibility: 'public' | 'private' | 'restricted';
  createdAt: string;
}

// Simulation d'une base de données de fichiers
let MEDIA_DB: MediaFile[] = [];

export class MediaService {
  
  // Simule l'upload d'un fichier (En prod: utiliser Multer + S3/Local Disk)
  async uploadFile(fileData: any, ownerId: string, visibility: 'public' | 'private' = 'private') {
    // Ici, on simule que le fichier a été enregistré sur le disque
    const newFile: MediaFile = {
      id: `file_${Date.now()}`,
      filename: `upload_${Date.now()}_${fileData.name}`,
      originalName: fileData.name,
      mimeType: fileData.type || 'application/octet-stream',
      size: fileData.size || 0,
      url: `https://via.placeholder.com/150?text=${fileData.name}`, // Mock URL pour la démo
      ownerId,
      visibility,
      createdAt: new Date().toISOString()
    };

    if (fileData.type?.startsWith('image/')) {
        // Simuler une url d'image pour la démo
        newFile.url = 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400'; 
    }

    MEDIA_DB.push(newFile);
    logger.info(`Fichier uploadé : ${newFile.filename} par ${ownerId}`);
    return newFile;
  }

  async getFileById(fileId: string, userId: string) {
    const file = MEDIA_DB.find(f => f.id === fileId);
    if (!file) throw new Error("Fichier introuvable");

    // Vérification basique de confidentialité
    if (file.visibility === 'private' && file.ownerId !== userId) {
        throw new Error("Accès non autorisé à ce fichier privé");
    }

    return file;
  }

  async getFilesByUser(userId: string, type?: string) {
    return MEDIA_DB.filter(f => 
        f.ownerId === userId && 
        (!type || f.mimeType.startsWith(type))
    );
  }
}
