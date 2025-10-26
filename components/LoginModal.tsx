import React, { useState } from 'react';
import Modal from './Modal';
import { loginUser, registerUser } from '../services/firebaseService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
        if (isRegistering) {
            await registerUser(email, password);
        } else {
            await loginUser(email, password);
        }
        handleClose();
    } catch (err: any) {
        const firebaseError = err.message
            .replace('Firebase: ', '')
            .replace(/\(auth\/.*\)\.?/, '');
        setError(firebaseError);
    } finally {
        setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError('');
    setIsRegistering(false);
    setIsLoading(false);
    onClose();
  }

  const inputClasses = "bg-gray-800/50 p-3 rounded-md w-full border border-white/10 focus:border-red-500 focus:ring-red-500 transition-colors";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isRegistering ? "Admin Registration" : "Admin Login"}>
      <div className="space-y-6">
        {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md font-semibold text-center">{error}</p>}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClasses}
            placeholder="admin@email.com"
          />
        </div>
        <div>
          <label htmlFor="password"className="block text-sm font-medium text-gray-300 mb-2">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClasses}
            placeholder="6+ characters"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-red-500/50 uppercase tracking-wider disabled:from-gray-600 disabled:to-gray-700 disabled:shadow-none disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : (isRegistering ? 'Register' : 'Login')}
        </button>
        <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="w-full text-center text-gray-400 hover:text-white text-sm"
        >
            {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </div>
    </Modal>
  );
};

export default LoginModal;