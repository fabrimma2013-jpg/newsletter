import React, { useState } from 'react';
import { GenerateContentResponse } from '@google/genai';
import { getSymptomAnalysis } from '../services/geminiService';
import { StethoscopeIcon, LoadingIcon, SendIcon } from './icons';

export const SymptomCheckerPanel: React.FC = () => {
    const [symptoms, setSymptoms] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCheckSymptoms = async () => {
        if (!symptoms.trim()) return;
        const symptomsToAnalyze = symptoms;
        setSymptoms('');
        setIsLoading(true);
        setError(null);
        setAnalysis('');

        try {
            const response: GenerateContentResponse = await getSymptomAnalysis(symptomsToAnalyze);
            setAnalysis(response.text);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Une erreur inconnue s'est produite.";
            setError(`L'analyse a échoué : ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleCheckSymptoms();
    };

    return (
        <div className="w-full bg-transparent p-4 flex flex-col h-full">
            <div className="flex items-center mb-4">
                <StethoscopeIcon />
                <h2 className="text-lg font-bold ml-2">Vérificateur de Symptômes</h2>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/50 border-l-4 border-yellow-400 text-yellow-800 dark:text-yellow-200 text-sm" role="alert">
                    <p className="font-bold">Avertissement</p>
                    <p>Cet outil est à titre informatif uniquement et ne remplace pas un avis médical professionnel. Consultez toujours un médecin pour un diagnostic.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label htmlFor="symptoms-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Décrivez vos symptômes</label>
                        <textarea
                            id="symptoms-input"
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            placeholder="Ex: 'J'ai mal à la tête et le nez qui coule...'"
                            className="mt-1 block w-full p-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c5a382]"
                            rows={3}
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !symptoms.trim()}
                        className="w-full bg-[#c5a382] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#b89572] transition-colors duration-200 disabled:bg-stone-300 dark:disabled:bg-stone-600 flex items-center justify-center space-x-2"
                    >
                        {isLoading ? <LoadingIcon /> : <SendIcon />}
                        <span>{isLoading ? 'Analyse en cours...' : 'Vérifier les symptômes'}</span>
                    </button>
                </form>

                {error && <div className="text-red-500 text-sm p-2 bg-red-100 dark:bg-red-900/50 rounded-md">{error}</div>}

                {analysis && (
                    <div className="border-t border-stone-200 dark:border-stone-700 pt-4">
                        <h3 className="text-md font-semibold mb-2">Résultats de l'analyse :</h3>
                        <div className="whitespace-pre-wrap text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-900/50 rounded-lg p-3">
                            {analysis}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};