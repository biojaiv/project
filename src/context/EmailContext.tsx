import React, { createContext, useContext, useState, useEffect } from 'react';
import { Email, SortOption, FilterOption } from '../types';
import { mockEmails } from '../data/mockData';

interface EmailContextType {
  emails: Email[];
  selectedEmail: Email | null;
  sortOption: SortOption;
  filterOption: FilterOption;
  searchTerm: string;
  selectedAccountId: string | 'all';
  selectedFolder: string;
  setSelectedEmail: (email: Email | null) => void;
  setSortOption: (option: SortOption) => void;
  setFilterOption: (option: FilterOption) => void;
  setSearchTerm: (term: string) => void;
  setSelectedAccountId: (id: string | 'all') => void;
  setSelectedFolder: (folder: string) => void;
  markAsRead: (id: string) => void;
  toggleStarred: (id: string) => void;
  deleteEmail: (id: string) => void;
  filteredEmails: Email[];
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export const EmailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('date');
  const [filterOption, setFilterOption] = useState<FilterOption>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<string | 'all'>('all');
  const [selectedFolder, setSelectedFolder] = useState('inbox');

  const markAsRead = (id: string) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === id ? { ...email, read: true } : email
      )
    );
  };

  const toggleStarred = (id: string) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === id ? { ...email, starred: !email.starred } : email
      )
    );
  };

  const deleteEmail = (id: string) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === id ? { ...email, folder: 'trash' } : email
      )
    );
    
    if (selectedEmail && selectedEmail.id === id) {
      setSelectedEmail(null);
    }
  };

  // Filter and sort emails based on selected options
  const filteredEmails = emails
    .filter((email) => {
      // Filter by account
      if (selectedAccountId !== 'all' && email.accountId !== selectedAccountId) {
        return false;
      }
      
      // Filter by folder
      if (email.folder !== selectedFolder) {
        return false;
      }
      
      // Filter by filter option
      if (filterOption === 'unread' && email.read) {
        return false;
      }
      if (filterOption === 'starred' && !email.starred) {
        return false;
      }
      if (filterOption === 'attachments' && email.attachments.length === 0) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          email.subject.toLowerCase().includes(searchLower) ||
          email.from.name.toLowerCase().includes(searchLower) ||
          email.from.email.toLowerCase().includes(searchLower) ||
          email.body.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by selected sort option
      if (sortOption === 'date') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      if (sortOption === 'sender') {
        return a.from.name.localeCompare(b.from.name);
      }
      if (sortOption === 'subject') {
        return a.subject.localeCompare(b.subject);
      }
      return 0;
    });

  const value = {
    emails,
    selectedEmail,
    sortOption,
    filterOption,
    searchTerm,
    selectedAccountId,
    selectedFolder,
    setSelectedEmail,
    setSortOption,
    setFilterOption,
    setSearchTerm,
    setSelectedAccountId,
    setSelectedFolder,
    markAsRead,
    toggleStarred,
    deleteEmail,
    filteredEmails,
  };

  return <EmailContext.Provider value={value}>{children}</EmailContext.Provider>;
};

export const useEmail = () => {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error('useEmail must be used within an EmailProvider');
  }
  return context;
};