import React from 'react';
import { LogoIcon } from './icons';

interface HeaderProps {
    userName: string;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userName, onLogout }) => {
  return (
    <header className="flex-shrink-0 flex items-center justify-between p-3 bg-white dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 shadow-sm">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-[#c5a382] rounded-full flex items-center justify-center">
          <LogoIcon className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold ml-3 text-stone-800 dark:text-stone-100">
          ChronicCare <span className="font-light text-stone-500 dark:text-stone-300">AI</span>
        </h1>
      </div>
       <div className="flex items-center space-x-4">
        <span className="hidden sm:inline text-sm font-medium text-stone-700 dark:text-stone-300">Bonjour, {userName.split(' ')[0]}</span>
        <button 
          onClick={onLogout}
          className="px-3 py-1.5 text-sm font-semibold rounded-md transition-colors text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700"
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
};
