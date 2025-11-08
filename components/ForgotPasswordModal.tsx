import React, { useState } from 'react';
import { forgotPassword } from '../services/authService';
import { Modal } from './Modal';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      forgotPassword(email);
      setMessage(`Si un compte existe pour ${email}, un e-mail de réinitialisation a été envoyé. (Simulation)`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    }
  };

  const handleClose = () => {
      setEmail('');
      setMessage('');
      setError('');
      onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Mot de Passe Oublié">
      {message ? (
          <div>
            <p className="text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/50 p-3 rounded-md">{message}</p>
            <button
              onClick={handleClose}
              className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-900 font-bold bg-amber-500 hover:bg-amber-600"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Veuillez saisir votre adresse e-mail. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
            {error && <p role="alert" className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="mb-4">
              <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Adresse e-mail</label>
              <input
                type="email"
                id="forgot-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-amber-400 focus:border-amber-400"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleClose}
                className="py-2 px-4 border border-slate-300 dark:border-slate-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-600 hover:bg-gray-50 dark:hover:bg-slate-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-900 font-bold bg-amber-500 hover:bg-amber-600"
              >
                Envoyer
              </button>
            </div>
          </form>
        )}
    </Modal>
  );
};
