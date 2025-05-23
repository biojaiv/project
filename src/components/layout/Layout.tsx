import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MainView from './MainView';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <MainView />
      </div>
    </div>
  );
};

export default Layout;