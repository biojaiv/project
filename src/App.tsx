import React from 'react';
import { TorProvider } from './context/TorContext';
import { AccountProvider } from './context/AccountContext';
import { EmailProvider } from './context/EmailContext';
import Layout from './components/layout/Layout';

function App() {
  return (
    <TorProvider>
      <AccountProvider>
        <EmailProvider>
          <Layout />
        </EmailProvider>
      </AccountProvider>
    </TorProvider>
  );
}

export default App;