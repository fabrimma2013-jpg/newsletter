import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BookIcon, LoadingIcon, SendIcon } from './icons';

// Fix: Initialize the Gemini AI client for this component. This was a placeholder file.
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const EducationPanel: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!topic.trim()) return;
        const topicToSearch = topic;
        setTopic('');
        setIsLoading(true);
        setError(null);
        setContent('');

        try {
            const model = 'gemini-2.5-flash';
            const prompt = `Expliquez brièvement et simplement le sujet suivant pour un patient : "${topicToSearch}". Mettez l'accent sur les points clés à retenir.`;
            
            const response = await ai.models.generateContent({
              model: model,
              contents: prompt,
              config: {
                systemInstruction: "Vous êtes un éducateur en santé, expliquant des concepts médicaux de manière simple et accessible.",
              }
            });

            setContent(response.text);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Une erreur inconnue s'est produite.";
            setError(`Échec de la recherche d'informations : ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch();
    };

    return (
        <div className="w-full bg-transparent p-4 flex flex-col h-full">
            <div className="flex items-center mb-4">
                <BookIcon />
                <h2 className="text-lg font-bold ml-2">Éducation Patient</h2>
            </div>
            <div className="mb-4">
                <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Ex: 'Hypertension', 'Diabète de type 2'..."
                        className="flex-1 block w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !topic.trim()}
                        className="p-2 rounded-full bg-amber-400 text-slate-900 disabled:bg-amber-200 dark:disabled:bg-slate-700 disabled:cursor-not-allowed hover:bg-amber-500 transition-colors"
                    >
                       {isLoading ? <LoadingIcon className="h-5 w-5" /> : <SendIcon className="h-5 w-5"/>}
                    </button>
                </form>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                {isLoading && (
                    <div className="flex justify-center items-center h-full">
                        <LoadingIcon />
                        <span className="ml-2">Recherche d'informations...</span>
                    </div>
                )}
                {error && <div className="text-red-500 text-sm">{error}</div>}
                {content ? (
                    <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                        {content}
                    </div>
                ) : (
                    !isLoading && <p className="text-center text-gray-500 dark:text-gray-400 mt-8">Recherchez un sujet pour en savoir plus.</p>
                )}
            </div>
        </div>
    );
};