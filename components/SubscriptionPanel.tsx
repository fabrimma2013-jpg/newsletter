
import React from 'react';
import { StarIcon, SparklesIcon } from './icons';

interface SubscriptionPanelProps {
    status: 'free' | 'premium';
    onUpgradeClick: () => void;
}

export const SubscriptionPanel: React.FC<SubscriptionPanelProps> = ({ status, onUpgradeClick }) => {
    return (
        <div className="w-full bg-transparent p-4 flex flex-col h-full">
            <div className="flex items-center mb-4">
                <StarIcon />
                <h2 className="text-lg font-bold ml-2">Abonnement</h2>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 bg-white dark:bg-slate-700 rounded-lg p-4 text-center shadow">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SparklesIcon className="w-8 h-8 text-amber-500"/>
                </div>
                
                {status === 'free' ? (
                    <>
                        <h3 className="text-xl font-bold">Passez à ChronicCare AI Pro</h3>
                        <p className="text-slate-600 dark:text-slate-300">
                            Débloquez des fonctionnalités avancées comme le mode de pensée avancé pour des réponses plus approfondies.
                        </p>
                        <div className="my-6">
                            <span className="text-4xl font-extrabold">$9.99</span>
                            <span className="text-slate-500">/ mois</span>
                        </div>
                        <button
                            onClick={onUpgradeClick}
                            className="w-full bg-amber-400 text-slate-900 font-bold py-3 px-4 rounded-lg hover:bg-amber-500 transition-colors duration-200"
                        >
                            Mettre à niveau maintenant
                        </button>
                    </>
                ) : (
                    <>
                        <h3 className="text-xl font-bold">Vous êtes un membre Pro !</h3>
                        <p className="text-slate-600 dark:text-slate-300">
                            Merci pour votre soutien. Vous avez accès à toutes les fonctionnalités avancées de ChronicCare AI.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};
