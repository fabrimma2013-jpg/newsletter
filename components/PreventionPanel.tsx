import React, { useState } from 'react';
import { User, HealthData } from '../services/authService';
import { getPreventiveTips } from '../services/geminiService';
import { ShieldIcon, SparklesIcon, LoadingIcon } from './icons';

interface PreventionPanelProps {
    user: User;
    healthData: HealthData[];
}

export const PreventionPanel: React.FC<PreventionPanelProps> = ({ user, healthData }) => {
    const [tips, setTips] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateTips = async () => {
        setIsLoading(true);
        setError(null);
        setTips([]);
        try {
            const generatedTips = await getPreventiveTips(user, healthData);
            setTips(generatedTips);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Une erreur inconnue s'est produite.";
            setError(`Échec de la génération des conseils : ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="w-full bg-transparent p-4 flex flex-col h-full">
            <div className="flex items-center mb-4">
                <ShieldIcon />
                <h2 className="text-lg font-bold ml-2">Conseils Préventifs</h2>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/50 border-l-4 border-blue-400 text-blue-800 dark:text-blue-200 text-sm" role="alert">
                    <p className="font-bold">Important</p>
                    <p>Ces conseils sont générés par une IA et sont destinés à des fins éducatives. Ils ne remplacent pas un avis médical. Consultez toujours votre médecin.</p>
                </div>

                <button
                    onClick={handleGenerateTips}
                    disabled={isLoading}
                    className="w-full bg-[#c5a382] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#b89572] transition-colors duration-200 disabled:bg-stone-300 dark:disabled:bg-stone-600 flex items-center justify-center space-x-2"
                >
                    {isLoading ? <LoadingIcon /> : <SparklesIcon />}
                    <span>{isLoading ? 'Génération en cours...' : 'Générer mes conseils'}</span>
                </button>
                
                {error && <div className="text-red-500 text-sm p-2 bg-red-100 dark:bg-red-900/50 rounded-md">{error}</div>}

                {tips.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-stone-200 dark:border-stone-700">
                        {tips.map((tip, index) => (
                            <div key={index} className="bg-white dark:bg-stone-700 rounded-lg p-3 flex items-start space-x-3 shadow">
                                <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                                    <ShieldIcon className="w-5 h-5"/>
                                </div>
                                <p className="text-stone-700 dark:text-stone-300 text-sm">{tip}</p>
                            </div>
                        ))}
                    </div>
                )}
                 {!isLoading && tips.length === 0 && !error && (
                    <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                        <p>Cliquez sur le bouton pour recevoir des conseils de prévention adaptés à votre profil.</p>
                    </div>
                 )}
            </div>
        </div>
    );
};
