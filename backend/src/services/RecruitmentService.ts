
import { logger } from '../utils/logger';

export interface JobPost {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: 'Ouvert' | 'Fermé';
  postedAt: string;
}

export interface Candidate {
  id: string;
  jobId: string;
  firstName: string;
  lastName: string;
  email: string;
  stage: string;
  rating: number;
  appliedAt: string;
}

// Mock Data
let JOBS: JobPost[] = [
  { id: 'J001', title: 'Comptable Senior', department: 'Finance', location: 'Kinshasa', type: 'CDI', status: 'Ouvert', postedAt: '2023-10-01' }
];
let CANDIDATES: Candidate[] = [
  { id: 'C001', jobId: 'J001', firstName: 'Paul', lastName: 'Mukendi', email: 'p.muk@email.com', stage: 'Entretien RH', rating: 4, appliedAt: '2023-10-05' }
];

export class RecruitmentService {
  async getJobs() { return JOBS; }
  
  async getCandidates() { return CANDIDATES; }

  async createCandidate(data: any) {
    const newCandidate = {
      id: `C${Date.now()}`,
      appliedAt: new Date().toISOString().split('T')[0],
      rating: 0,
      ...data
    };
    CANDIDATES.unshift(newCandidate);
    return newCandidate;
  }

  async updateCandidateStage(id: string, stage: string) {
    const c = CANDIDATES.find(x => x.id === id);
    if(c) c.stage = stage;
    return c;
  }
}
