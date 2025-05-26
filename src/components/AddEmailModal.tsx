import React, { useState, useEffect } from 'react';
import { XIcon, ShieldIcon, AlertTriangleIcon, CheckCircleIcon } from 'lucide-react';
import EmailService from '../services/EmailService';

interface AddEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddEmailModal: React.FC<AddEmailModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    provider: 'gmail',
  });
  
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [securityWindow, setSecurityWindow] = useState<Window | null>(null);
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [captchaUrl, setCaptchaUrl] = useState('');

  const emailService = EmailService.getInstance();

  useEffect(() => {
    return () => {
      if (securityWindow) {
        securityWindow.close();
      }
    };
  }, [securityWindow]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCaptchaComplete = async (token: string) => {
    try {
      const success = await emailService.handleCaptchaCompletion(formData.email, token);
      if (success) {
        setVerificationStatus('success');
        setCaptchaRequired(false);
        if (securityWindow) {
          securityWindow.close();
        }
      }
    } catch (error) {
      setVerificationStatus('error');
      setErrorMessage(error.message || 'Failed to verify CAPTCHA');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationStatus('checking');
    setErrorMessage('');

    try {
      const result = await emailService.verifyConnection(
        formData.email,
        formData.password,
        formData.provider
      );

      if (result.requiresCaptcha && result.captchaUrl) {
        setCaptchaRequired(true);
        setCaptchaUrl(result.captchaUrl);
        
        const captchaWindow = window.open(
          result.captchaUrl,
          'CAPTCHA Verification',
          'width=400,height=600,top=100,left=100'
        );
        
        if (captchaWindow) {
          setSecurityWindow(captchaWindow);
          
          window.addEventListener('message', (event) => {
            if (event.data.type === 'CAPTCHA_COMPLETE') {
              handleCaptchaComplete(event.data.token);
              captchaWindow.close();
            }
          });
        }
      } else if (result.success) {
        setVerificationStatus('success');
      } else {
        throw new Error(result.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification failed:', error);
      setVerificationStatus('error');
      setErrorMessage(error.message || 'Failed to verify email');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-md mx-4 overflow-hidden shadow-xl border border-wine-700">
        <div className="flex items-center justify-between px-6 py-4 bg-wine-900 text-white">
          <h2 className="text-lg font-medium">Add Email Account</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Account Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-wine-500"
                placeholder="Work, Personal, etc."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-wine-500"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-wine-500"
                placeholder="Enter your email password"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email Provider
              </label>
              <select
                name="provider"
                required
                value={formData.provider}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-wine-500"
              >
                <option value="gmail">Gmail</option>
                <option value="outlook">Outlook</option>
                <option value="yahoo">Yahoo</option>
                <option value="icloud">iCloud</option>
                <option value="gmx">GMX</option>
                <option value="webde">Web.de</option>
              </select>
            </div>

            {verificationStatus === 'checking' && (
              <div className="bg-gray-800 p-4 rounded-lg text-gray-300 animate-pulse">
                Verifying connection...
              </div>
            )}

            {verificationStatus === 'error' && (
              <div className="bg-red-900/20 p-4 rounded-lg border border-red-700">
                <div className="flex items-center text-red-400">
                  <AlertTriangleIcon className="w-5 h-5 mr-2" />
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {verificationStatus === 'success' && (
              <div className="bg-green-900/20 p-4 rounded-lg text-green-400 flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Connection verified successfully
              </div>
            )}

            {captchaRequired && (
              <div className="bg-blue-900/20 p-4 rounded-lg text-blue-400">
                <p>Please complete the CAPTCHA verification in the popup window.</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-wine-600 rounded-md hover:bg-wine-700"
              disabled={verificationStatus === 'checking' || captchaRequired}
            >
              Add Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmailModal;