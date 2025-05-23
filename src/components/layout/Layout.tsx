import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MainView from './MainView';

const Layout: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <MainView />
      </div>
    </div>
  );
};

export default Layout;