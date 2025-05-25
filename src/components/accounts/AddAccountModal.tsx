import React, { useState } from 'react';
import { XIcon, ShieldIcon, KeyIcon, AlertTriangleIcon, CheckCircleIcon } from 'lucide-react';
import { useAccount } from '../../context/AccountContext';
import { encryptData } from '../../utils/encryption';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose }) => {
  const { addAccount } = useAccount();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    provider: 'gmail',
    color: '#8E2F3C',
    useTor: true,
    useEncryption: true,
  });

  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [showClearnetPrompt, setShowClearnetPrompt] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const verifyTorConnection = async () => {
    setVerificationStatus('checking');
    try {
      const response = await fetch('/api/verify-tor-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          provider: formData.provider,
        }),
      });

      if (!response.ok) {
        throw new Error('Tor connection failed');
      }

      setVerificationStatus('success');
      return true;
    } catch (error) {
      setVerificationStatus('error');
      setShowClearnetPrompt(true);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.useTor) {
      const torSuccess = await verifyTorConnection();
      if (!torSuccess && !showClearnetPrompt) {
        return;
      }
    }
    
    // Encrypt sensitive data before storing
    const encryptedPassword = await encryptData(formData.password);
    
    addAccount({
      ...formData,
      password: encryptedPassword,
    });
    
    // Reset form
    setVerificationStatus('idle');
    setShowClearnetPrompt(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-md mx-4 overflow-hidden shadow-xl border border-wine-700">
        <div className="flex items-center justify-between px-6 py-4 bg-wine-900 text-white">
          <h2 className="text-lg font-medium">Add Secure Email Account</h2>
          <button 
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Account Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-wine-500 focus:border-transparent"
                placeholder="Work, Personal, etc."
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-wine-500 focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-wine-500 focus:border-transparent"
                placeholder="Enter your email password"
              />
            </div>
            
            <div>
              <label htmlFor="provider" className="block text-sm font-medium text-gray-300 mb-1">
                Email Provider
              </label>
              <select
                id="provider"
                name="provider"
                required
                value={formData.provider}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-wine-500 focus:border-transparent"
              >
                <option value="gmail">Gmail</option>
                <option value="outlook">Outlook</option>
                <option value="yahoo">Yahoo</option>
                <option value="icloud">iCloud</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="useTor"
                  name="useTor"
                  checked={formData.useTor}
                  onChange={handleChange}
                  className="h-4 w-4 bg-gray-800 border-gray-700 rounded text-wine-600 focus:ring-wine-500"
                />
                <label htmlFor="useTor" className="ml-2 flex items-center text-sm text-gray-300">
                  <ShieldIcon className="w-4 h-4 mr-1 text-wine-500" />
                  Route through Tor network for enhanced privacy
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="useEncryption"
                  name="useEncryption"
                  checked={formData.useEncryption}
                  onChange={handleChange}
                  className="h-4 w-4 bg-gray-800 border-gray-700 rounded text-wine-600 focus:ring-wine-500"
                />
                <label htmlFor="useEncryption" className="ml-2 flex items-center text-sm text-gray-300">
                  <KeyIcon className="w-4 h-4 mr-1 text-wine-500" />
                  Enable end-to-end encryption
                </label>
              </div>
            </div>

            {verificationStatus === 'checking' && (
              <div className="bg-gray-800 p-4 rounded-lg text-gray-300 animate-pulse">
                Verifying Tor connection...
              </div>
            )}

            {verificationStatus === 'error' && showClearnetPrompt && (
              <div className="bg-wine-900/50 p-4 rounded-lg border border-wine-700">
                <div className="flex items-center text-wine-200 mb-2">
                  <AlertTriangleIcon className="w-5 h-5 mr-2" />
                  <span>Tor connection failed</span>
                </div>
                <p className="text-sm text-gray-300 mb-3">
                  Would you like to connect using the regular network instead?
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowClearnetPrompt(false)}
                    className="px-3 py-1 text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-sm bg-wine-600 text-white rounded hover:bg-wine-700 transition-colors"
                  >
                    Continue without Tor
                  </button>
                </div>
              </div>
            )}

            {verificationStatus === 'success' && (
              <div className="bg-green-900/20 p-4 rounded-lg text-green-200 flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Tor connection verified successfully
              </div>
            )}
          </div>
          
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-wine-600 rounded-md hover:bg-wine-700 transition-colors"
              disabled={verificationStatus === 'checking'}
            >
              Add Account Securely
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccountModal;