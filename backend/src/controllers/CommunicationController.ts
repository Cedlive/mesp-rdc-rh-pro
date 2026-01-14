import { Response, NextFunction } from 'express';
import { CommunicationService } from '../services/CommunicationService';

export class CommunicationController {
  private service = new CommunicationService();

  // Envoi de message
  sendMessage = async (req: any, res: any, next: any) => {
    try {
      const { receiverId, content, type, metadata } = req.body;
      const message = await this.service.sendMessage(req.user.id, { receiverId, content, type, metadata });
      res.status(201).json(message);
    } catch (e) { next(e); }
  };

  // Récupération historique
  getMessages = async (req: any, res: any, next: any) => {
    try {
      const { contactId } = req.params;
      const messages = await this.service.getMessages(req.user.id, contactId);
      res.status(200).json(messages);
    } catch (e) { next(e); }
  };

  // Marquer comme lu
  markRead = async (req: any, res: any, next: any) => {
    try {
      const { contactId } = req.params;
      await this.service.markAsRead(req.user.id, contactId);
      res.status(200).json({ success: true });
    } catch (e) { next(e); }
  };

  // --- Call Methods (Previous) ---
  startCall = async (req: any, res: any, next: any) => { /* ... existing ... */ res.json({status: 'calling'}) };
  endCall = async (req: any, res: any, next: any) => { /* ... existing ... */ res.json({status: 'ended'}) };
  getHistory = async (req: any, res: any, next: any) => { /* ... existing ... */ res.json([]) };
}