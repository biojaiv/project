import React, { createContext, useContext, useState, useEffect } from 'react';
import TorService from '../services/TorService';

interface TorContextType {
  isConnected: boolean;
  connecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const TorContext = createContext<TorContextType | undefined>(undefined);

export const TorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const torService = TorService.getInstance();

  useEffect(() => {
    // Auto-connect to Tor on startup
    connect();
  }, []);

  const connect = async () => {
    try {
      setConnecting(true);
      setError(null);
      await torService.start();
      setIsConnected(true);
      console.log('Connected to Tor network');
    } catch (err) {
      setError(err.message);
      console.error('Failed to connect to Tor:', err);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await torService.stop();
      setIsConnected(false);
      console.log('Disconnected from Tor network');
    } catch (err) {
      setError(err.message);
      console.error('Failed to disconnect from Tor:', err);
    }
  };

  return (
    <TorContext.Provider value={{
      isConnected,
      connecting,
      error,
      connect,
      disconnect
    }}>
      {children}
    </TorContext.Provider>
  );
};

export const useTor = () => {
  const context = useContext(TorContext);
  if (context === undefined) {
    throw new Error('useTor must be used within a TorProvider');
  }
  return context;
};