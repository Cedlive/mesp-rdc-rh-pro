
export interface TrainingSession {
  id: string;
  title: string;
  type: string;
  provider: string;
  startDate: string;
  endDate: string;
  location: string;
  status: 'Planifié' | 'En cours' | 'Terminé';
  attendees: string[];
  capacity: number;
  cost: number;
}

let TRAININGS: TrainingSession[] = [
  {
    id: 'TR001',
    title: 'Excel Avancé',
    type: 'Technique',
    provider: 'Interne',
    startDate: '2023-12-01',
    endDate: '2023-12-05',
    location: 'Salle A',
    status: 'Planifié',
    attendees: [],
    capacity: 15,
    cost: 0
  }
];

export class TrainingService {
  async getAll() {
    return TRAININGS;
  }

  async create(data: any) {
    const training: TrainingSession = {
      id: `TR${Date.now()}`,
      status: 'Planifié',
      attendees: [],
      ...data
    };
    TRAININGS.push(training);
    return training;
  }
}
