import React from 'react';
import { Email } from '../../types';
import { Star, StarIcon, Paperclip, TrashIcon } from 'lucide-react';

interface EmailItemProps {
  email: Email;
  isSelected: boolean;
  onSelect: () => void;
  onToggleStar: () => void;
  onDelete: () => void;
}

const EmailItem: React.FC<EmailItemProps> = ({ 
  email, 
  isSelected, 
  onSelect,
  onToggleStar,
  onDelete
}) => {
  const formattedDate = new Date(email.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleStar();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <li 
      className={`
        group relative hover:bg-gray-50 transition-colors cursor-pointer
        ${isSelected ? 'bg-blue-50' : email.read ? 'bg-white' : 'bg-gray-50'}
      `}
      onClick={onSelect}
    >
      <div className="flex items-start px-4 py-3">
        <div className="flex items-center mr-3">
          <button 
            onClick={handleStarClick}
            className="text-gray-400 hover:text-yellow-400 focus:outline-none"
          >
            {email.starred ? (
              <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            ) : (
              <Star className="w-5 h-5" />
            )}
          </button>
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between mb-1">
            <p className={`text-sm font-medium truncate ${email.read ? 'text-gray-700' : 'text-gray-900'}`}>
              {email.from.name}
            </p>
            <p className="text-xs text-gray-500 whitespace-nowrap ml-2">
              {formattedDate}
            </p>
          </div>
          
          <p className={`text-sm truncate mb-1 ${email.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
            {email.subject}
          </p>
          
          <div className="flex items-center">
            {email.attachments.length > 0 && (
              <Paperclip className="w-4 h-4 text-gray-400 mr-1" />
            )}
            <p className="text-xs text-gray-500 truncate">
              {email.body.replace(/<[^>]*>/g, '').slice(0, 100)}...
            </p>
          </div>
        </div>
      </div>
      
      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={handleDeleteClick}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
      
      {!email.read && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
      )}
    </li>
  );
};

export default EmailItem;