import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AccountProvider } from './context/AccountContext';
import { EmailProvider } from './context/EmailContext';
import { TorProvider } from './context/TorContext';
import App from './App';
import './index.css';

// Error boundary for catching and displaying runtime errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
            <p className="text-gray-300 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-wine-600 text-white rounded hover:bg-wine-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <TorProvider>
        <AccountProvider>
          <EmailProvider>
            <App />
          </EmailProvider>
        </AccountProvider>
      </TorProvider>
    </ErrorBoundary>
  </StrictMode>
);