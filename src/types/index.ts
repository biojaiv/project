export interface Email {
  id: string;
  from: {
    name: string;
    email: string;
  };
  to: {
    name: string;
    email: string;
  }[];
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
  labels: string[];
  attachments: Attachment[];
  folder: string;
  accountId: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface EmailAccount {
  id: string;
  name: string;
  email: string;
  provider: 'gmail' | 'outlook' | 'yahoo' | 'icloud' | 'other';
  color: string;
  unreadCount: number;
}

export interface Folder {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export type SortOption = 'date' | 'sender' | 'subject';
export type FilterOption = 'all' | 'unread' | 'starred' | 'attachments';