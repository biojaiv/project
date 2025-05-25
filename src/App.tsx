import React, { useState } from 'react';
import { MailIcon, PlusIcon } from 'lucide-react';
import AddEmailModal from './components/AddEmailModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="h-16 border-b border-gray-800 flex items-center px-6">
        <div className="flex items-center space-x-2">
          <MailIcon className="w-6 h-6 text-wine-500" />
          <h1 className="text-xl font-semibold">Email Hub</h1>
        </div>
      </header>
      
      <div className="flex flex-1">
        <aside className="w-64 border-r border-gray-800 p-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-wine-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-wine-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Add Email Account
          </button>
        </aside>
        
        <main className="flex-1 p-6">
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MailIcon className="w-16 h-16 mb-4" />
            <h2 className="text-xl font-medium mb-2">No email accounts added</h2>
            <p className="text-sm">Add an email account to get started</p>
          </div>
        </main>
      </div>

      <AddEmailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default App;