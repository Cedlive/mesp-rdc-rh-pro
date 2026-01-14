import { Response, NextFunction } from 'express';
import { MessageService } from '../services/MessageService';

export class MessageController {
  private messageService = new MessageService();

  getMyMessages = async (req: any, res: any, next: any) => {
    try {
      const messages = await this.messageService.getMessagesForUser(req.user.id);
      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  };

  send = async (req: any, res: any, next: any) => {
    try {
      const { receiverId, content } = req.body;
      const message = await this.messageService.sendMessage(req.user.id, { receiverId, content });
      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  };
}