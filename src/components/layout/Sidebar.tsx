import React, { useState } from 'react';
import { 
  InboxIcon, 
  SendIcon, 
  FileIcon, 
  StarIcon, 
  TrashIcon, 
  ArchiveIcon, 
  PlusIcon,
  Settings2Icon,
  RefreshCwIcon
} from 'lucide-react';
import { useAccount } from '../../context/AccountContext';
import { useEmail } from '../../context/EmailContext';
import { mockFolders } from '../../data/mockData';
import AddAccountModal from '../accounts/AddAccountModal';

interface SidebarProps {
  onAddAccount: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddAccount }) => {
  const { accounts } = useAccount();
  const { 
    selectedFolder, 
    setSelectedFolder, 
    selectedAccountId, 
    setSelectedAccountId 
  } = useEmail();
  const [refreshing, setRefreshing] = useState<string | null>(null);

  const getFolderIcon = (iconName: string) => {
    switch (iconName) {
      case 'InboxIcon':
        return <InboxIcon className="w-5 h-5" />;
      case 'SendIcon':
        return <SendIcon className="w-5 h-5" />;
      case 'FileIcon':
        return <FileIcon className="w-5 h-5" />;
      case 'StarIcon':
        return <StarIcon className="w-5 h-5" />;
      case 'TrashIcon':
        return <TrashIcon className="w-5 h-5" />;
      case 'ArchiveIcon':
        return <ArchiveIcon className="w-5 h-5" />;
      default:
        return <InboxIcon className="w-5 h-5" />;
    }
  };

  const handleRefresh = async (accountId: string) => {
    setRefreshing(accountId);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(null);
  };

  return (
    <aside className="w-64 h-full bg-gray-900 border-r border-wine-800 flex-shrink-0 overflow-y-auto transition-all duration-300 ease-in-out">
      <div className="p-4">
        <button 
          onClick={onAddAccount}
          className="w-full bg-wine-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-wine-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Email Account</span>
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
          Accounts
        </h2>
        <ul>
          <li className="px-2">
            <button
              className={`w-full flex items-center gap-3 px-2 py-2 text-sm rounded-lg transition-colors ${
                selectedAccountId === 'all'
                  ? 'bg-wine-900/50 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
              onClick={() => setSelectedAccountId('all')}
            >
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span>All Accounts</span>
              <span className="ml-auto bg-wine-900/50 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                {accounts.reduce((sum, account) => sum + account.unreadCount, 0)}
              </span>
            </button>
          </li>
          {accounts.map((account) => (
            <li key={account.id} className="px-2">
              <button
                className={`w-full flex items-center gap-3 px-2 py-2 text-sm rounded-lg transition-colors ${
                  selectedAccountId === account.id
                    ? 'bg-wine-900/50 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
                onClick={() => setSelectedAccountId(account.id)}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: account.color }}
                ></div>
                <span>{account.name}</span>
                {account.unreadCount > 0 && (
                  <span className="ml-auto bg-wine-900/50 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                    {account.unreadCount}
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRefresh(account.id);
                  }}
                  className={`ml-2 p-1 rounded-full hover:bg-gray-700 transition-colors ${
                    refreshing === account.id ? 'animate-spin' : ''
                  }`}
                >
                  <RefreshCwIcon className="w-4 h-4" />
                </button>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
          Folders
        </h2>
        <ul>
          {mockFolders.map((folder) => (
            <li key={folder.id} className="px-2">
              <button
                className={`w-full flex items-center gap-3 px-2 py-2 text-sm rounded-lg transition-colors ${
                  selectedFolder === folder.id
                    ? 'bg-wine-900/50 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
                onClick={() => setSelectedFolder(folder.id)}
              >
                <span className="text-gray-400">
                  {getFolderIcon(folder.icon)}
                </span>
                <span>{folder.name}</span>
                {folder.count > 0 && (
                  <span className="ml-auto bg-wine-900/50 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                    {folder.count}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto p-4 border-t border-wine-800">
        <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <Settings2Icon className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;