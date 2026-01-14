
export interface Survey {
  id: string;
  title: string;
  deadline: string;
  status: 'Actif' | 'Clôturé';
  participants: number;
}

let SURVEYS: Survey[] = [
  { id: 'S1', title: 'Satisfaction Cantine', deadline: '2023-12-31', status: 'Actif', participants: 12 }
];

export class SurveyService {
  async getAll() { return SURVEYS; }
  async create(data: any) {
    const s = { id: `S${Date.now()}`, ...data, participants: 0, status: 'Actif' };
    SURVEYS.unshift(s);
    return s;
  }
}
