import { Response, NextFunction } from 'express';
import { MediaService } from '../services/MediaService';

export class MediaController {
  private mediaService = new MediaService();

  upload = async (req: any, res: any, next: any) => {
    try {
      // Dans une vraie app Express avec Multer, le fichier est dans req.file
      // Pour cette démo, on attend les métadonnées dans le body
      const fileData = req.body; 
      
      const result = await this.mediaService.uploadFile(fileData, req.user.id, fileData.visibility);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getMyFiles = async (req: any, res: any, next: any) => {
    try {
      const { type } = req.query; // ex: 'image', 'application/pdf'
      const files = await this.mediaService.getFilesByUser(req.user.id, type as string);
      res.status(200).json(files);
    } catch (error) {
      next(error);
    }
  };
}