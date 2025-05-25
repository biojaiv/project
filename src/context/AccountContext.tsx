import React, { createContext, useContext, useState, useCallback } from 'react';
import { EmailAccount } from '../types';
import { mockAccounts } from '../data/mockData';
import { encryptData, decryptData, hashPassword, verifyPassword } from '../utils/encryption';

interface AccountContextType {
  accounts: EmailAccount[];
  addAccount: (account: Omit<EmailAccount, 'id' | 'unreadCount'>) => Promise<void>;
  removeAccount: (id: string, password: string) => Promise<void>;
  updateAccount: (id: string, updates: Partial<EmailAccount>) => Promise<void>;
  verifyAccountAccess: (id: string, password: string) => Promise<boolean>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<EmailAccount[]>(mockAccounts);

  const addAccount = useCallback(async (account: Omit<EmailAccount, 'id' | 'unreadCount'>) => {
    try {
      const newAccount: EmailAccount = {
        ...account,
        id: crypto.randomUUID(),
        unreadCount: 0,
      };

      if (account.password) {
        newAccount.password = await hashPassword(account.password);
        newAccount.encryptedData = await encryptData(JSON.stringify({
          email: account.email,
          provider: account.provider,
        }));
      }

      setAccounts((prevAccounts) => [...prevAccounts, newAccount]);
    } catch (error) {
      console.error('Error adding account:', error);
      throw new Error('Failed to add account');
    }
  }, []);

  const removeAccount = useCallback(async (id: string, password: string) => {
    try {
      const account = accounts.find(acc => acc.id === id);
      if (!account) throw new Error('Account not found');

      const isValid = await verifyPassword(password, account.password!);
      if (!isValid) throw new Error('Invalid password');

      setAccounts((prevAccounts) => prevAccounts.filter((acc) => acc.id !== id));
    } catch (error) {
      console.error('Error removing account:', error);
      throw new Error('Failed to remove account');
    }
  }, [accounts]);

  const updateAccount = useCallback(async (id: string, updates: Partial<EmailAccount>) => {
    try {
      if (updates.password) {
        updates.password = await hashPassword(updates.password);
      }

      if (updates.email || updates.provider) {
        const account = accounts.find(acc => acc.id === id);
        if (!account) throw new Error('Account not found');

        const encryptedData = await encryptData(JSON.stringify({
          email: updates.email || account.email,
          provider: updates.provider || account.provider,
        }));
        updates.encryptedData = encryptedData;
      }

      setAccounts((prevAccounts) =>
        prevAccounts.map((account) =>
          account.id === id ? { ...account, ...updates } : account
        )
      );
    } catch (error) {
      console.error('Error updating account:', error);
      throw new Error('Failed to update account');
    }
  }, [accounts]);

  const verifyAccountAccess = useCallback(async (id: string, password: string): Promise<boolean> => {
    try {
      const account = accounts.find(acc => acc.id === id);
      if (!account) return false;
      return await verifyPassword(password, account.password!);
    } catch {
      return false;
    }
  }, [accounts]);

  const value = {
    accounts,
    addAccount,
    removeAccount,
    updateAccount,
    verifyAccountAccess,
  };

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};