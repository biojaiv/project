import React from 'react';
import { useEmail } from '../../context/EmailContext';
import EmailItem from './EmailItem';
import { CheckIcon, TrashIcon, ArchiveIcon, TagIcon, ClockIcon } from 'lucide-react';

const EmailList: React.FC = () => {
  const { 
    filteredEmails, 
    selectedEmail, 
    setSelectedEmail,
    markAsRead,
    toggleStarred,
    deleteEmail
  } = useEmail();

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="border-b border-gray-200 py-2 px-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
            <CheckIcon className="w-5 h-5" />
          </button>
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
            <ArchiveIcon className="w-5 h-5" />
          </button>
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
            <TrashIcon className="w-5 h-5" />
          </button>
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
            <TagIcon className="w-5 h-5" />
          </button>
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
            <ClockIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="text-sm text-gray-500">
          {filteredEmails.length} {filteredEmails.length === 1 ? 'email' : 'emails'}
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {filteredEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-lg">No emails found</p>
            <p className="text-sm">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredEmails.map((email) => (
              <EmailItem 
                key={email.id} 
                email={email} 
                isSelected={selectedEmail?.id === email.id}
                onSelect={() => {
                  setSelectedEmail(email);
                  if (!email.read) {
                    markAsRead(email.id);
                  }
                }}
                onToggleStar={() => toggleStarred(email.id)}
                onDelete={() => deleteEmail(email.id)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EmailList;