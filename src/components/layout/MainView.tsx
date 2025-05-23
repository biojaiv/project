import React from 'react';
import { useEmail } from '../../context/EmailContext';
import EmailList from '../email/EmailList';
import EmailView from '../email/EmailView';
import NoEmailSelected from '../email/NoEmailSelected';

const MainView: React.FC = () => {
  const { selectedEmail } = useEmail();

  return (
    <div className="flex-1 flex overflow-hidden">
      <EmailList />
      <div className="w-0 sm:w-7/12 md:w-8/12 lg:w-9/12 flex-shrink-0 border-l border-gray-200 hidden sm:block">
        {selectedEmail ? <EmailView /> : <NoEmailSelected />}
      </div>
      
      {/* Mobile email view overlay */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-white z-50 sm:hidden">
          <EmailView />
        </div>
      )}
    </div>
  );
};

export default MainView;