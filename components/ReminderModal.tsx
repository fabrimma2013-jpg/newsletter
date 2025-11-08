import React, { useState } from 'react';
import { Modal } from './Modal';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReminder: (name: string, dosage: string, time: string) => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({ isOpen, onClose, onAddReminder }) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && time) {
      onAddReminder(name, dosage, time);
      setName('');
      setDosage('');
      setTime('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter un Rappel">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="med-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom du médicament</label>
            <input
              type="text"
              id="med-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-amber-400 focus:border-amber-400"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="med-dosage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dosage (ex: 1 comprimé)</label>
            <input
              type="text"
              id="med-dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-amber-400 focus:border-amber-400"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="med-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Heure</label>
            <input
              type="time"
              id="med-time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-amber-400 focus:border-amber-400"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 border border-slate-300 dark:border-slate-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-600 hover:bg-gray-50 dark:hover:bg-slate-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-900 font-bold bg-amber-500 hover:bg-amber-600"
            >
              Ajouter
            </button>
          </div>
        </form>
    </Modal>
  );
};
