import React, { useState, useEffect } from 'react';
import { MailIcon, PlusIcon } from 'lucide-react';
import AddEmailModal from './components/AddEmailModal';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MainView from './components/layout/MainView';
import { useTor } from './context/TorContext';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isConnected, connecting, connect } = useTor();

  useEffect(() => {
    // Attempt to connect to Tor on app start
    if (!isConnected && !connecting) {
      connect();
    }
  }, [isConnected, connecting, connect]);

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