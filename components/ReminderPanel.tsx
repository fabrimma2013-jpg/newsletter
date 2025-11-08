import React from 'react';
// FIX: The Reminder type is defined in the authService, not the App component.
import { Reminder } from '../services/authService';
import { BellIcon, ClockIcon, PillIcon, TrashIcon } from './icons';

interface ReminderPanelProps {
  reminders: Reminder[];
  onAddClick: () => void;
  onDeleteReminder: (id: string) => void;
  userStatus: 'free' | 'premium';
  onUpgradeClick: () => void;
}

export const ReminderPanel: React.FC<ReminderPanelProps> = ({ reminders, onAddClick, onDeleteReminder, userStatus, onUpgradeClick }) => {
  return (
    <div className="w-full bg-transparent p-4 flex flex-col h-full">
      <div className="flex items-center mb-4">
        <BellIcon />
        <h2 className="text-lg font-bold ml-2">Rappels de Médicaments</h2>
      </div>
       {userStatus === 'free' && (
          <div className="text-center text-xs text-stone-500 dark:text-stone-400 mb-3 p-2 bg-stone-100 dark:bg-stone-900/50 rounded-md">
              Vous avez {reminders.length} / 3 rappels. <button onClick={onUpgradeClick} className="font-semibold text-[#c5a382] hover:underline">Passez à Pro</button> pour en ajouter plus.
          </div>
      )}
      <button
        onClick={onAddClick}
        className="w-full bg-[#c5a382] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#b89572] transition-colors duration-200 mb-4"
      >
        Ajouter un rappel
      </button>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {reminders.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <p>Aucun rappel programmé.</p>
            <p className="text-sm">Ajoutez-en un manuellement ou demandez à l'assistant.</p>
          </div>
        ) : (
          reminders.map(reminder => (
            <div key={reminder.id} className="bg-white dark:bg-stone-700 rounded-lg p-3 flex items-start space-x-3 shadow">
                <div className="flex-shrink-0 w-8 h-8 bg-[#c5a382] rounded-full flex items-center justify-center text-white">
                    <PillIcon/>
                </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 dark:text-gray-200">{reminder.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{reminder.dosage}</p>
                <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <ClockIcon />
                  <span className="ml-1">{reminder.time}</span>
                </div>
              </div>
              <button
                onClick={() => onDeleteReminder(reminder.id)}
                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                aria-label="Delete reminder"
              >
                <TrashIcon />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
