import React, { useState, useMemo } from 'react';
import { HealthData, HealthDataType } from '../services/authService';

interface HealthChartProps {
    data: HealthData[];
    title: string;
    type: HealthDataType;
}

type TimeRange = '7d' | '30d';

export const HealthChart: React.FC<HealthChartProps> = ({ data, title, type }) => {
    const [timeRange, setTimeRange] = useState<TimeRange>('7d');

    const filteredData = useMemo(() => {
        const now = new Date();
        const days = timeRange === '7d' ? 7 : 30;
        const cutoffDate = new Date(now.setDate(now.getDate() - days));
        return data
            .filter(d => new Date(d.date) >= cutoffDate)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [data, timeRange]);
    
    const isBloodPressure = type === 'bloodPressure';
    const values = isBloodPressure
        ? filteredData.flatMap(d => typeof d.value === 'object' ? [Number(d.value.systolic), Number(d.value.diastolic)] : [])
        : filteredData.map(d => Number(d.value));

    if (filteredData.length < 2) {
        return (
            <div className="p-4 text-center text-sm text-gray-500 bg-stone-50 dark:bg-stone-800 rounded-b-lg">
                Données insuffisantes pour afficher un graphique.
            </div>
        );
    }
    
    const yMin = Math.min(...values) - 5;
    const yMax = Math.max(...values) + 5;
    const xMin = new Date(filteredData[0].date).getTime();
    const xMax = new Date(filteredData[filteredData.length - 1].date).getTime();

    const svgWidth = 300;
    const svgHeight = 150;
    const padding = { top: 10, right: 10, bottom: 20, left: 30 };
    const chartWidth = svgWidth - padding.left - padding.right;
    const chartHeight = svgHeight - padding.top - padding.bottom;

    const toSvgX = (date: string) => padding.left + ((new Date(date).getTime() - xMin) / (xMax - xMin)) * chartWidth;
    const toSvgY = (val: number) => padding.top + chartHeight - ((val - yMin) / (yMax - yMin)) * chartHeight;
    
    const generatePath = (valueExtractor: (d: HealthData) => number) => {
        return filteredData
            .map((d, i) => {
                const x = toSvgX(d.date);
                const y = toSvgY(valueExtractor(d));
                return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
            })
            .join(' ');
    };
    
    const systolicPath = isBloodPressure ? generatePath(d => Number((d.value as {systolic: string}).systolic)) : '';
    const diastolicPath = isBloodPressure ? generatePath(d => Number((d.value as {diastolic: string}).diastolic)) : '';
    const singleValuePath = !isBloodPressure ? generatePath(d => Number(d.value)) : '';

    return (
        <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-b-lg -mt-1">
            <div className="flex justify-between items-center mb-2">
                 <div className="flex items-center space-x-2 text-xs">
                    {isBloodPressure && <>
                        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>Sys</span>
                        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>Dia</span>
                    </>}
                </div>
                <div className="flex space-x-1 p-0.5 bg-stone-200 dark:bg-stone-700 rounded-md text-xs">
                    <button onClick={() => setTimeRange('7d')} className={`px-2 py-0.5 rounded ${timeRange === '7d' ? 'bg-white dark:bg-stone-600 shadow-sm' : ''}`}>7j</button>
                    <button onClick={() => setTimeRange('30d')} className={`px-2 py-0.5 rounded ${timeRange === '30d' ? 'bg-white dark:bg-stone-600 shadow-sm' : ''}`}>30j</button>
                </div>
            </div>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto" aria-labelledby="chart-title" role="img">
                <title id="chart-title">Graphique de l'évolution de {title} sur {timeRange === '7d' ? '7 jours' : '30 jours'}</title>
                
                {/* Y-Axis labels */}
                <text x={padding.left - 5} y={padding.top} textAnchor="end" alignmentBaseline="hanging" fontSize="10" className="fill-current text-gray-500 dark:text-gray-400">{Math.round(yMax)}</text>
                <text x={padding.left - 5} y={svgHeight - padding.bottom} textAnchor="end" alignmentBaseline="baseline" fontSize="10" className="fill-current text-gray-500 dark:text-gray-400">{Math.round(yMin)}</text>
                
                {/* Grid lines */}
                <line x1={padding.left} y1={padding.top} x2={svgWidth - padding.right} y2={padding.top} strokeDasharray="2" className="stroke-current text-gray-200 dark:text-gray-600" />
                <line x1={padding.left} y1={svgHeight - padding.bottom} x2={svgWidth - padding.right} y2={svgHeight - padding.bottom} strokeDasharray="2" className="stroke-current text-gray-200 dark:text-gray-600" />

                {/* Data paths */}
                {isBloodPressure ? <>
                    <path d={systolicPath} fill="none" strokeWidth="2" className="stroke-current text-red-500" />
                    <path d={diastolicPath} fill="none" strokeWidth="2" className="stroke-current text-blue-500" />
                </> : 
                    <path d={singleValuePath} fill="none" strokeWidth="2" className="stroke-current text-[#c5a382]" />
                }
            </svg>
        </div>
    );
};
