import { Response, NextFunction } from 'express';
import { RecruitmentService } from '../services/RecruitmentService';

export class RecruitmentController {
  private service = new RecruitmentService();

  getJobs = async (req: any, res: any, next: any) => {
    try { res.json(await this.service.getJobs()); } catch (e) { next(e); }
  };

  getCandidates = async (req: any, res: any, next: any) => {
    try { res.json(await this.service.getCandidates()); } catch (e) { next(e); }
  };

  createCandidate = async (req: any, res: any, next: any) => {
    try { res.status(201).json(await this.service.createCandidate(req.body)); } catch (e) { next(e); }
  };
}