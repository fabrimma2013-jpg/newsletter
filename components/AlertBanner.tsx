import React from 'react';
import { AlertTriangleIcon, CloseIcon } from './icons';

export interface HealthAlert {
    id: string;
    message: string;
}

interface AlertBannerProps {
    alerts: HealthAlert[];
    onDismiss: (id: string) => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ alerts, onDismiss }) => {
    if (alerts.length === 0) {
        return null;
    }

    return (
        <div className="absolute top-0 left-0 right-0 z-10 p-2" role="alert">
            <div className="max-w-4xl mx-auto space-y-2">
            {alerts.map(alert => (
                <div key={alert.id} className="bg-red-500 text-white p-3 rounded-lg shadow-lg flex items-center justify-between animate-fade-in-down">
                    <div className="flex items-center">
                        <AlertTriangleIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium">{alert.message}</span>
                    </div>
                    <button onClick={() => onDismiss(alert.id)} className="p-1 rounded-full hover:bg-red-600 transition-colors" aria-label="Fermer l'alerte">
                        <CloseIcon className="h-4 w-4" />
                    </button>
                </div>
            ))}
            </div>
             <style>{`
                @keyframes fade-in-down {
                    0% {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};
