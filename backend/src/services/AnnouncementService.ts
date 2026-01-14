
import { logger } from '../utils/logger';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  type: 'General' | 'Urgent' | 'Event';
  isPinned: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
}

let ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'A1',
    title: 'Campagne de Santé Visuelle',
    content: 'Une équipe d\'ophtalmologues sera présente au siège du 25 au 30 Novembre.',
    date: '2023-11-20',
    author: 'Coordination Médicale',
    type: 'Event',
    isPinned: true
  }
];

export class AnnouncementService {
  async getAll() {
    return ANNOUNCEMENTS;
  }

  async create(data: Omit<Announcement, 'id' | 'date'>) {
    const newAnnounce: Announcement = {
      id: `A${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...data
    };
    ANNOUNCEMENTS.unshift(newAnnounce);
    logger.info(`Nouvelle annonce créée : ${newAnnounce.title}`);
    return newAnnounce;
  }

  async delete(id: string) {
    const initialLength = ANNOUNCEMENTS.length;
    ANNOUNCEMENTS = ANNOUNCEMENTS.filter(a => a.id !== id);
    if (ANNOUNCEMENTS.length === initialLength) {
      throw new Error("Annonce introuvable");
    }
    return { success: true };
  }
}
