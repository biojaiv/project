import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AccountProvider } from './context/AccountContext';
import { EmailProvider } from './context/EmailContext';
import { TorProvider } from './context/TorContext';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <TorProvider>
      <AccountProvider>
        <EmailProvider>
          <App />
        </EmailProvider>
      </AccountProvider>
    </TorProvider>
  </StrictMode>
);