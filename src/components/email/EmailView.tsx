import React from 'react';
import { useEmail } from '../../context/EmailContext';
import { useAccount } from '../../context/AccountContext';
import { 
  ArrowLeftIcon, 
  StarIcon, 
  Star, 
  ArchiveIcon, 
  TrashIcon, 
  CornerDownLeftIcon,
  TagIcon,
  MoreHorizontalIcon,
  Paperclip,
  DownloadIcon
} from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';

const EmailView: React.FC = () => {
  const { selectedEmail, setSelectedEmail, toggleStarred, deleteEmail } = useEmail();
  const { accounts } = useAccount();

  if (!selectedEmail) {
    return (
      <div className="flex-1 flex items-center justify-center h-full bg-gray-50">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium mb-2">No email selected</p>
          <p className="text-sm">Select an email from the list to view it here</p>
        </div>
      </div>
    );
  }

  const account = accounts.find((acc) => acc.id === selectedEmail.accountId);
  const formattedDate = new Date(selectedEmail.timestamp).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  const handleBack = () => {
    setSelectedEmail(null);
  };

  const handleToggleStar = () => {
    toggleStarred(selectedEmail.id);
  };

  const handleDelete = () => {
    deleteEmail(selectedEmail.id);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-auto">
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleBack}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors sm:mr-2"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          
          <div className="hidden sm:flex items-center space-x-3">
            <button 
              onClick={handleToggleStar}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              {selectedEmail.starred ? (
                <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ) : (
                <Star className="w-5 h-5" />
              )}
            </button>
            
            <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
              <ArchiveIcon className="w-5 h-5" />
            </button>
            
            <button 
              onClick={handleDelete}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
            
            <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
              <TagIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="hidden sm:block p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
            <CornerDownLeftIcon className="w-5 h-5" />
          </button>
          
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
            <MoreHorizontalIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            {selectedEmail.subject}
          </h1>
          
          <div className="flex items-start mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-4 flex-shrink-0">
              <span className="font-medium">
                {selectedEmail.from.name.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="font-medium text-gray-900">
                    {selectedEmail.from.name}
                  </span>
                  <span className="text-gray-500 ml-2 text-sm hidden sm:inline-block">
                    &lt;{selectedEmail.from.email}&gt;
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {formattedDate}
                </span>
              </div>
              
              <div className="text-sm text-gray-500 mb-2">
                To: {selectedEmail.to.map((recipient) => recipient.name).join(', ')}
                {account && (
                  <span className="ml-2">
                    via <span style={{ color: account.color }}>{account.name}</span>
                  </span>
                )}
              </div>
              
              {selectedEmail.labels.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedEmail.labels.map((label) => (
                    <span
                      key={label}
                      className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div 
            className="prose prose-sm max-w-none text-gray-800 mb-6"
            dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
          />
          
          {selectedEmail.attachments.length > 0 && (
            <div className="mt-8 border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Attachments ({selectedEmail.attachments.length})
              </h3>
              
              <div className="space-y-3">
                {selectedEmail.attachments.map((attachment) => (
                  <div 
                    key={attachment.id}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Paperclip className="w-5 h-5 text-gray-400 mr-3" />
                    
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {attachment.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(attachment.size)}
                      </p>
                    </div>
                    
                    <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors">
                      <DownloadIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-8 pt-4 border-t border-gray-200">
            <button className="bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors py-2 px-4 rounded-md text-sm font-medium">
              Reply
            </button>
            <button className="ml-2 text-gray-700 hover:bg-gray-100 transition-colors py-2 px-4 rounded-md text-sm font-medium">
              Forward
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailView;