import { NextFunction } from 'express';
import { SurveyService } from '../services/SurveyService';

export class SurveyController {
  private service = new SurveyService();
  getAll = async (req: any, res: any, next: any) => {
    try { res.json(await this.service.getAll()); } catch (e) { next(e); }
  };
  create = async (req: any, res: any, next: any) => {
    try { res.status(201).json(await this.service.create(req.body)); } catch (e) { next(e); }
  };
}