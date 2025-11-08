import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { HealthData, HealthDataType } from '../services/authService';

interface HealthDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddData: (data: Omit<HealthData, 'id'>) => void;
}

const dataTypesConfig: Record<HealthDataType, { label: string; unit: string; }> = {
    bloodPressure: { label: "Tension Artérielle", unit: "mmHg" },
    heartRate: { label: "Fréquence Cardiaque", unit: "bpm" },
    bloodSugar: { label: "Glycémie", unit: "mg/dL" },
    spO2: { label: "Saturation en Oxygène (SpO2)", unit: "%" },
    weight: { label: "Poids", unit: "kg" },
};

export const HealthDataModal: React.FC<HealthDataModalProps> = ({ isOpen, onClose, onAddData }) => {
  const [type, setType] = useState<HealthDataType>('bloodPressure');
  const [value, setValue] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // Reset fields when type changes
    setValue('');
    setSystolic('');
    setDiastolic('');
  }, [type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const unit = dataTypesConfig[type].unit;

    if (type === 'bloodPressure') {
      if (systolic && diastolic && date) {
        onAddData({ type, value: { systolic, diastolic }, date, unit });
      }
    } else {
      if (value && date) {
        onAddData({ type, value, date, unit });
      }
    }
    
    // Clear form and close
    setValue('');
    setSystolic('');
    setDiastolic('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter une Donnée de Santé">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="health-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type de mesure</label>
            <select
              id="health-type"
              value={type}
              onChange={(e) => setType(e.target.value as HealthDataType)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-amber-400 focus:border-amber-400"
            >
              {Object.entries(dataTypesConfig).map(([key, {label}]) => (
                  <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {type === 'bloodPressure' ? (
            <div className="flex space-x-2 mb-4">
              <div className="flex-1">
                <label htmlFor="health-systolic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Systolique</label>
                <input type="number" id="health-systolic" value={systolic} onChange={(e) => setSystolic(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-amber-400 focus:border-amber-400" required />
              </div>
              <div className="flex-1">
                <label htmlFor="health-diastolic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Diastolique</label>
                <input type="number" id="health-diastolic" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-amber-400 focus:border-amber-400" required />
              </div>
            </div>
          ) : (
            <div className="mb-4">
                <label htmlFor="health-value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valeur ({dataTypesConfig[type].unit})</label>
                <input type="number" id="health-value" value={value} onChange={(e) => setValue(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-amber-400 focus:border-amber-400" required />
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="health-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
            <input
              type="date"
              id="health-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-amber-400 focus:border-amber-400"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="py-2 px-4 border border-slate-300 dark:border-slate-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-600 hover:bg-gray-50 dark:hover:bg-slate-500">
              Annuler
            </button>
            <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-900 font-bold bg-amber-500 hover:bg-amber-600">
              Ajouter
            </button>
          </div>
        </form>
    </Modal>
  );
};
