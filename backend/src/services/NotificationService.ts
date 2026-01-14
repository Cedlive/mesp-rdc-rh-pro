
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'success';
  isRead: boolean;
  createdAt: string;
}

let NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: 'E001', title: 'Bienvenue', message: 'Bienvenue sur le nouveau portail RH.', type: 'success', isRead: false, createdAt: new Date().toISOString() }
];

export class NotificationService {
  async getForUser(userId: string) {
    return NOTIFICATIONS.filter(n => n.userId === userId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async markAsRead(notificationId: string) {
    const notif = NOTIFICATIONS.find(n => n.id === notificationId);
    if(notif) notif.isRead = true;
    return notif;
  }

  async create(data: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) {
    const notif: Notification = {
        id: `n_${Date.now()}`,
        isRead: false,
        createdAt: new Date().toISOString(),
        ...data
    };
    NOTIFICATIONS.push(notif);
    return notif;
  }
}
