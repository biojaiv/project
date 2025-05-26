import React, { useState, useEffect } from 'react';
import { MailIcon, PlusIcon } from 'lucide-react';
import AddEmailModal from './components/AddEmailModal';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MainView from './components/layout/MainView';
import { useTor } from './context/TorContext';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected, connecting, connect } = useTor();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (!isConnected && !connecting) {
          await connect();
        }
      } catch (error) {
        console.error('Failed to initialize Tor:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [isConnected, connecting, connect]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-wine-500 border-t-transparent mb-4"></div>
          <p className="text-lg">Initializing secure connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onAddAccount={() => setIsModalOpen(true)} />
        <MainView />
      </div>

      <AddEmailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default App;