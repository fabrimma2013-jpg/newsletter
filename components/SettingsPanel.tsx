import React, { useState, useEffect } from 'react';
import { AlertSettings } from '../services/authService';
// FIX: SaveIcon is not exported from ./icons as it is defined locally in this file.
import { SettingsIcon, SunIcon, MoonIcon } from './icons';

type Theme = 'light' | 'dark';

interface SettingsPanelProps {
    alertSettings: AlertSettings;
    onUpdateAlertSettings: (settings: AlertSettings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ alertSettings, onUpdateAlertSettings }) => {
    const [settings, setSettings] = useState<AlertSettings>(alertSettings);
    const [isSaved, setIsSaved] = useState(false);
    
    const [theme, setTheme] = useState<Theme>(() => {
        return (localStorage.getItem('theme') as Theme) || 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    const handleChange = (category: keyof AlertSettings, field: string, value: string) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                // @ts-ignore
                ...prev[category],
                [field]: Number(value)
            }
        }));
    };

    const handleSave = () => {
        onUpdateAlertSettings(settings);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="w-full bg-transparent p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <SettingsIcon />
                    <h2 className="text-lg font-bold ml-2">Paramètres</h2>
                </div>
                <button 
                    onClick={handleSave}
                    className="flex items-center space-x-2 py-1 px-3 bg-amber-400 text-slate-900 rounded-lg hover:bg-amber-500 disabled:bg-amber-300 transition-colors"
                >
                    <SaveIcon className="w-4 h-4" />
                    <span className="text-sm font-bold">{isSaved ? 'Enregistré!' : 'Enregistrer'}</span>
                </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                <div>
                    <h3 className="text-md font-semibold mb-2 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-1">Seuils d'Alerte</h3>
                    
                    <div className="mt-4">
                         <label className="font-medium">Tension Artérielle (mmHg)</label>
                         <div className="grid grid-cols-2 gap-2 mt-1">
                            <InputField label="Systolique haute" value={settings.bloodPressure.highSystolic} onChange={e => handleChange('bloodPressure', 'highSystolic', e.target.value)} />
                            <InputField label="Diastolique haute" value={settings.bloodPressure.highDiastolic} onChange={e => handleChange('bloodPressure', 'highDiastolic', e.target.value)} />
                            <InputField label="Systolique basse" value={settings.bloodPressure.lowSystolic} onChange={e => handleChange('bloodPressure', 'lowSystolic', e.target.value)} />
                            <InputField label="Diastolique basse" value={settings.bloodPressure.lowDiastolic} onChange={e => handleChange('bloodPressure', 'lowDiastolic', e.target.value)} />
                         </div>
                    </div>
                     <div className="mt-4">
                         <label className="font-medium">Glycémie (mg/dL)</label>
                         <div className="grid grid-cols-2 gap-2 mt-1">
                            <InputField label="Haute" value={settings.bloodSugar.high} onChange={e => handleChange('bloodSugar', 'high', e.target.value)} />
                            <InputField label="Basse" value={settings.bloodSugar.low} onChange={e => handleChange('bloodSugar', 'low', e.target.value)} />
                         </div>
                    </div>
                     <div className="mt-4">
                         <label className="font-medium">Saturation en Oxygène (SpO2)</label>
                         <div className="grid grid-cols-2 gap-2 mt-1">
                            <InputField label="Seuil bas (%)" value={settings.spO2.low} onChange={e => handleChange('spO2', 'low', e.target.value)} />
                         </div>
                    </div>

                </div>

                <div>
                    <h3 className="text-md font-semibold mb-2 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-1">Apparence</h3>
                    <div className="flex items-center space-x-2 p-1 bg-slate-200 dark:bg-slate-700 rounded-lg mt-2">
                        <button onClick={() => setTheme('light')} className={`w-full p-2 rounded-md flex items-center justify-center space-x-2 transition-colors ${theme === 'light' ? 'bg-white dark:bg-slate-600 shadow' : 'hover:bg-slate-300/50 dark:hover:bg-slate-600/50'}`}>
                            <SunIcon /> <span>Clair</span>
                        </button>
                        <button onClick={() => setTheme('dark')} className={`w-full p-2 rounded-md flex items-center justify-center space-x-2 transition-colors ${theme === 'dark' ? 'bg-white dark:bg-slate-600 shadow' : 'hover:bg-slate-300/50 dark:hover:bg-slate-600/50'}`}>
                            <MoonIcon /> <span>Sombre</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InputField = ({ label, value, onChange }: { label: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div>
        <label className="block text-xs text-gray-600 dark:text-gray-400">{label}</label>
        <input
            type="number"
            value={value}
            onChange={onChange}
            className="mt-1 w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-sm"
        />
    </div>
);

// We need a SaveIcon for the settings panel
const SaveIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
);
