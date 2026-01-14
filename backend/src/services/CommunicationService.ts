
import { Message, ChatContact } from '../types';

// Mock Data Structure for Backend
interface BackendMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: string;
  status: 'sent' | 'delivered' | 'read';
  timestamp: string;
  metadata?: any;
}

// Simulated Database
let MESSAGES: BackendMessage[] = [
  {
    id: 'm1',
    senderId: 'E002',
    receiverId: 'me',
    content: 'Bonjour, voici le rapport.',
    type: 'text',
    status: 'read',
    timestamp: new Date(Date.now() - 3600000).toISOString()
  }
];

export class CommunicationService {
  
  // Create a new message with support for rich types
  async sendMessage(senderId: string, data: any) {
    const newMessage: BackendMessage = {
      id: `msg_${Date.now()}`,
      senderId,
      receiverId: data.receiverId,
      content: data.content || '',
      type: data.type || 'text',
      status: 'sent',
      timestamp: new Date().toISOString(),
      metadata: data.metadata
    };
    
    MESSAGES.push(newMessage);
    return newMessage;
  }

  // Get conversation history
  async getMessages(userId: string, contactId: string) {
    return MESSAGES.filter(m => 
      (m.senderId === userId && m.receiverId === contactId) ||
      (m.senderId === contactId && m.receiverId === userId) ||
      (contactId === 'group' && m.receiverId === 'group')
    ).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  // Mark messages as read
  async markAsRead(userId: string, senderId: string) {
    MESSAGES.forEach(m => {
        if(m.senderId === senderId && m.receiverId === userId) {
            m.status = 'read';
        }
    });
    return { success: true };
  }
}
