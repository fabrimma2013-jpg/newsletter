import React from 'react';
import { StarIcon, SparklesIcon } from './icons';

interface PremiumFeatureLockProps {
    featureName: string;
    onUpgradeClick: () => void;
}

export const PremiumFeatureLock: React.FC<PremiumFeatureLockProps> = ({ featureName, onUpgradeClick }) => {
    return (
        <div className="w-full bg-transparent p-4 flex flex-col h-full items-center justify-center text-center">
             <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="w-8 h-8 text-amber-500"/>
            </div>
            <h3 className="text-lg font-bold">Fonctionnalité Premium</h3>
            <p className="text-slate-600 dark:text-slate-300 mt-2 px-4">
                L'accès à la fonctionnalité "{featureName}" est réservé aux membres Pro.
            </p>
            <button
                onClick={onUpgradeClick}
                className="mt-6 w-full max-w-xs bg-amber-400 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-amber-500 transition-colors duration-200 flex items-center justify-center"
            >
                <StarIcon className="w-5 h-5 mr-2"/>
                Passer à Pro
            </button>
        </div>
    );
};