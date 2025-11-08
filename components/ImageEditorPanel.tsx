import React, { useState, useRef } from 'react';
import { editImage } from '../services/geminiService';
import { ImageIcon, UploadIcon, SparklesIcon, LoadingIcon, DownloadIcon } from './icons';

interface ImageData {
    base64: string;
    mimeType: string;
    dataUrl: string;
}

export const ImageEditorPanel: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Veuillez sélectionner un fichier image valide.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result as string;
                const mimeType = dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
                const base64 = dataUrl.split(',')[1];
                setOriginalImage({ base64, mimeType, dataUrl });
                setEditedImage(null);
                setError(null);
            };
            reader.onerror = () => {
                setError("Erreur lors de la lecture du fichier.");
            }
            reader.readAsDataURL(file);
        }
    };
    
    const handleGenerate = async () => {
        if (!originalImage || !prompt.trim()) {
            setError('Veuillez charger une image et saisir une instruction.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setEditedImage(null);
        try {
            const newImageBase64 = await editImage(originalImage.base64, originalImage.mimeType, prompt);
            setEditedImage(`data:image/png;base64,${newImageBase64}`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Une erreur inconnue s'est produite.";
            setError(`Échec de la génération : ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full bg-transparent p-4 flex flex-col h-full">
            <div className="flex items-center mb-4">
                <ImageIcon />
                <h2 className="text-lg font-bold ml-2">Éditeur d'Images IA</h2>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />

                {!originalImage ? (
                     <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-40 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        <UploadIcon />
                        <span className="mt-2 text-sm font-semibold">Cliquez pour charger</span>
                    </button>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Image Originale</label>
                            <img src={originalImage.dataUrl} alt="Original" className="mt-1 rounded-lg w-full object-contain max-h-48" />
                             <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full text-sm mt-2 text-amber-500 hover:underline"
                            >
                                Changer d'image
                            </button>
                        </div>
                        <div>
                            <label htmlFor="edit-prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Instruction de modification</label>
                            <textarea
                                id="edit-prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Ex: 'Ajouter un filtre rétro' ou 'Rendre le fond flou'"
                                className="mt-1 block w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                rows={2}
                                disabled={isLoading}
                            />
                        </div>
                         <button
                            onClick={handleGenerate}
                            disabled={isLoading || !prompt.trim()}
                            className="w-full bg-amber-400 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-amber-500 transition-colors duration-200 disabled:bg-amber-200 dark:disabled:bg-slate-700 flex items-center justify-center"
                        >
                            {isLoading ? <LoadingIcon /> : <SparklesIcon />}
                            <span>{isLoading ? 'Génération...' : 'Générer'}</span>
                        </button>
                    </div>
                )}
                
                {error && <div className="text-red-500 text-sm p-2 bg-red-100 dark:bg-red-900/50 rounded-md">{error}</div>}

                {editedImage && (
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                        <label className="text-sm font-medium">Image Modifiée</label>
                         <div className="relative mt-1">
                            <img src={editedImage} alt="Édité" className="rounded-lg w-full object-contain max-h-64" />
                             <a
                                href={editedImage}
                                download="edited-image.png"
                                className="absolute top-2 right-2 p-2 bg-white/70 dark:bg-slate-900/70 rounded-full text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                                title="Télécharger l'image"
                            >
                                <DownloadIcon />
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};