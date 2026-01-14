
export interface Message {
  id: string;
  senderId: string;
  receiverId: string; // 'group' ou ID employé
  content: string;
  type: 'text' | 'image' | 'document';
  isRead: boolean;
  createdAt: string;
}

let MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    senderId: 'ADMIN_001',
    receiverId: 'group',
    content: 'Bienvenue sur la nouvelle plateforme MESP-RDC RH.',
    type: 'text',
    isRead: false,
    createdAt: new Date().toISOString()
  }
];

export class MessageService {
  
  async getMessagesForUser(userId: string) {
    // Retourne les messages privés et les messages de groupe
    return MOCK_MESSAGES.filter(m => 
      m.receiverId === userId || 
      m.senderId === userId || 
      m.receiverId === 'group'
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async sendMessage(senderId: string, data: { receiverId: string, content: string, type?: 'text' }) {
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId,
      receiverId: data.receiverId,
      content: data.content,
      type: data.type || 'text',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    
    MOCK_MESSAGES.push(newMessage);
    return newMessage;
  }

  async markAsRead(messageId: string) {
    const msg = MOCK_MESSAGES.find(m => m.id === messageId);
    if (msg) msg.isRead = true;
    return msg;
  }
}
