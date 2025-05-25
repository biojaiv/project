import React, { useState } from 'react';
import { SearchIcon, XIcon, SlidersIcon, UserIcon, BellIcon } from 'lucide-react';
import { useEmail } from '../../context/EmailContext';

const Header: React.FC = () => {
  const { searchTerm, setSearchTerm, setSortOption, setFilterOption } = useEmail();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <header className="h-16 bg-gray-900 border-b border-wine-800 flex items-center justify-between px-4 sm:px-6">
      <div className="flex-1 flex items-center max-w-lg">
        <div
          className={`flex items-center w-full rounded-lg border ${
            isSearchFocused 
              ? 'border-wine-500 bg-gray-800 shadow-lg shadow-wine-900/20' 
              : 'border-gray-700 bg-gray-800'
          } px-3 py-2 transition-all duration-300`}
        >
          <SearchIcon className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search emails..."
            className="bg-transparent border-none outline-none w-full text-gray-100 placeholder-gray-400"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {searchTerm && (
            <button 
              onClick={clearSearch}
              className="text-gray-400 hover:text-wine-300 transition-colors duration-200"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="hidden sm:block">
          <select 
            className="bg-gray-800 border border-gray-700 text-gray-100 rounded-md py-1.5 px-3 text-sm hover:border-wine-500 transition-colors duration-200"
            onChange={(e) => setSortOption(e.target.value as any)}
            defaultValue="date"
          >
            <option value="date">Sort by Date</option>
            <option value="sender">Sort by Sender</option>
            <option value="subject">Sort by Subject</option>
          </select>
        </div>
        
        <button className="p-2 text-gray-300 hover:text-wine-300 hover:bg-gray-800 rounded-full transition-all duration-200">
          <SlidersIcon className="w-5 h-5" />
        </button>
        
        <button className="p-2 text-gray-300 hover:text-wine-300 hover:bg-gray-800 rounded-full transition-all duration-200 relative">
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-wine-500 rounded-full"></span>
        </button>
        
        <button className="p-1 rounded-full bg-wine-600 text-white hover:bg-wine-700 transition-all duration-200">
          <UserIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;