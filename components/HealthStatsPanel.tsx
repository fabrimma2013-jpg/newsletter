import React, { useState } from 'react';
import { User, HealthData, HealthDataType } from '../services/authService';
import { ActivityIcon, PlusIcon, HeartIcon, LungsIcon, DropletIcon, ScaleIcon, DownloadIcon } from './icons';
import { HealthChart } from './HealthChart';

interface HealthStatsPanelProps {
  healthData: HealthData[];
  onAddHealthDataClick: () => void;
  user: User;
  onUpgradeClick: () => void;
}

const healthTypeConfig: Record<HealthDataType, { title: string; icon: React.ReactNode }> = {
    heartRate: { title: 'Fréquence Cardiaque', icon: <HeartIcon /> },
    bloodPressure: { title: 'Tension Artérielle', icon: <ActivityIcon /> },
    bloodSugar: { title: 'Glycémie', icon: <DropletIcon /> },
    spO2: { title: 'SpO2', icon: <LungsIcon /> },
    weight: { title: 'Poids', icon: <ScaleIcon /> },
};

const generateReportHtml = (data: HealthData[], userName: string): string => {
    const reportDate = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
    let body = '';

    for (const type in healthTypeConfig) {
        const config = healthTypeConfig[type as HealthDataType];
        const typeData = data.filter(d => d.type === type).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        if (typeData.length > 0) {
            body += `<h2>${config.title}</h2>`;
            body += '<table><thead><tr><th>Date</th><th>Valeur</th><th>Unité</th></tr></thead><tbody>';
            typeData.forEach(reading => {
                const date = new Date(reading.date).toLocaleDateString('fr-FR');
                let value: string;
                if (reading.type === 'bloodPressure' && typeof reading.value === 'object') {
                    value = `${reading.value.systolic} / ${reading.value.diastolic}`;
                } else {
                    value = String(reading.value);
                }
                body += `<tr><td>${date}</td><td>${value}</td><td>${reading.unit}</td></tr>`;
            });
            body += '</tbody></table>';
        }
    }

    return `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <title>Rapport de Santé - ${userName}</title>
            <style>
                body { font-family: sans-serif; margin: 2rem; color: #333; }
                h1, h2 { color: #c5a382; }
                h1 { border-bottom: 2px solid #eee; padding-bottom: 0.5rem; }
                table { width: 100%; border-collapse: collapse; margin-top: 1rem; margin-bottom: 2rem; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                @media print {
                    body { margin: 1rem; }
                    button { display: none; }
                }
            </style>
        </head>
        <body>
            <h1>Rapport de Santé pour ${userName}</h1>
            <p>Généré le: ${reportDate}</p>
            ${body}
        </body>
        </html>
    `;
};


export const HealthStatsPanel: React.FC<HealthStatsPanelProps> = ({ healthData, onAddHealthDataClick, user, onUpgradeClick }) => {
  
  const [expandedChart, setExpandedChart] = useState<HealthDataType | null>(null);

  const getLastReading = (type: HealthDataType) => {
    const readings = healthData.filter(d => d.type === type);
    return readings.length > 0 ? readings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : null;
  };

  const handleExport = () => {
    const htmlContent = generateReportHtml(healthData, user.name);
    const reportWindow = window.open('', '_blank');
    if (reportWindow) {
        reportWindow.document.write(htmlContent);
        reportWindow.document.close();
        reportWindow.focus();
        setTimeout(() => {
            reportWindow.print();
        }, 500); // Give the browser a moment to render
    }
  };
  
  const readingsToShow: HealthDataType[] = ['bloodPressure', 'heartRate', 'bloodSugar', 'spO2', 'weight'];

  return (
    <div className="w-full bg-transparent p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
            <ActivityIcon />
            <h2 className="text-lg font-bold ml-2">Suivi de Santé</h2>
        </div>
         <button
            onClick={handleExport}
            className="flex items-center space-x-2 py-1 px-3 bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-lg hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
            title="Exporter les données en PDF"
        >
            <DownloadIcon className="w-4 h-4" />
            <span className="text-sm font-semibold hidden sm:inline">Exporter</span>
        </button>
      </div>
      {user.status === 'free' && (
          <div className="text-center text-xs text-stone-500 dark:text-stone-400 mb-3 p-2 bg-stone-100 dark:bg-stone-900/50 rounded-md">
              Vous avez {healthData.length} entrées. <button onClick={onUpgradeClick} className="font-semibold text-[#c5a382] hover:underline">Passez à Pro</button> pour un suivi illimité.
          </div>
      )}
      <button
        onClick={onAddHealthDataClick}
        className="w-full bg-[#c5a382] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#b89572] transition-colors duration-200 mb-4 flex items-center justify-center space-x-2"
        aria-label="Ajouter de nouvelles données de santé"
      >
        <PlusIcon />
        <span>Ajouter des données</span>
      </button>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {healthData.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <p>Aucune donnée de santé enregistrée.</p>
            <p className="text-sm">Commencez par ajouter une mesure.</p>
          </div>
        ) : (
          <div className="space-y-4">
             {readingsToShow.map(type => {
                const reading = getLastReading(type);
                const config = healthTypeConfig[type];
                if (!reading) return null;
                const isExpanded = expandedChart === type;

                return (
                    <div key={type}>
                        <StatCard 
                            icon={config.icon} 
                            title={config.title} 
                            reading={reading} 
                            isExpanded={isExpanded}
                            onClick={() => setExpandedChart(isExpanded ? null : type)}
                        />
                        {isExpanded && (
                            <HealthChart 
                                title={config.title}
                                data={healthData.filter(d => d.type === type)} 
                                type={type}
                            />
                        )}
                    </div>
                );
             })}
          </div>
        )}
      </div>
    </div>
  );
};

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    reading: HealthData;
    isExpanded: boolean;
    onClick: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, reading, isExpanded, onClick }) => {
    let displayValue: string;

    if (reading.type === 'bloodPressure' && typeof reading.value === 'object') {
        displayValue = `${reading.value.systolic}/${reading.value.diastolic}`;
    } else {
        displayValue = String(reading.value);
    }
    
    return (
        <button 
            onClick={onClick}
            className={`w-full bg-white dark:bg-stone-700 rounded-lg p-3 shadow flex items-center space-x-4 text-left transition-all duration-300 ${isExpanded ? 'ring-2 ring-[#c5a382]' : 'hover:bg-stone-50 dark:hover:bg-stone-600'}`} 
            role="button" 
            aria-expanded={isExpanded}
            aria-label={`Dernière mesure de ${title}, cliquez pour voir le graphique`}
        >
            <div className="flex-shrink-0 w-10 h-10 bg-[#c5a382]/20 dark:bg-[#c5a382]/20 rounded-full flex items-center justify-center text-[#c5a382]">
                {icon}
            </div>
            <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                <p className="font-bold text-xl">
                    {displayValue} <span className="text-base font-normal">{reading.unit}</span>
                </p>
                 <p className="text-xs text-gray-400 dark:text-gray-500">Dernière mesure: {new Date(reading.date).toLocaleDateString()}</p>
            </div>
             <svg className={`w-5 h-5 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
        </button>
    )
}
