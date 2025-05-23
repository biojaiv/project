import React from 'react';
import { MailIcon } from 'lucide-react';

const NoEmailSelected: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
          <MailIcon className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No email selected</h3>
        <p className="text-sm text-gray-500 max-w-sm">
          Select an email from the list to view it here or compose a new message
        </p>
      </div>
    </div>
  );
};

export default NoEmailSelected;