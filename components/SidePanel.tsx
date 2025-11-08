import React, { useRef, useEffect, useCallback } from 'react';
import { ActivityIcon, BellIcon, BookIcon, SettingsIcon, StarIcon, StethoscopeIcon, ImageIcon } from './icons';

type SidePanelTab = 'stats' | 'reminders' | 'symptoms' | 'education' | 'images' | 'subscription' | 'settings';

interface SidePanelProps {
    activeTab: SidePanelTab;
    setActiveTab: (tab: SidePanelTab) => void;
    children: React.ReactNode;
}

const tabs: { id: SidePanelTab, name: string, icon: React.ReactNode }[] = [
    { id: 'stats', name: 'Suivi', icon: <ActivityIcon /> },
    { id: 'reminders', name: 'Rappels', icon: <BellIcon /> },
    { id: 'symptoms', name: 'Symptômes', icon: <StethoscopeIcon /> },
    { id: 'education', name: 'Éducation', icon: <BookIcon /> },
    { id: 'images', name: 'Images', icon: <ImageIcon /> },
    { id: 'subscription', name: 'Abonnement', icon: <StarIcon /> },
    { id: 'settings', name: 'Paramètres', icon: <SettingsIcon /> },
];

export const SidePanel: React.FC<SidePanelProps> = ({ activeTab, setActiveTab, children }) => {
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);
        if (activeTabIndex !== -1) {
            tabRefs.current[activeTabIndex]?.focus();
        }
    }, [activeTab]);
    
    const handleTabClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        const tabId = event.currentTarget.dataset.tabId as SidePanelTab | undefined;
        if (tabId) {
            setActiveTab(tabId);
        }
    }, [setActiveTab]);

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        let nextIndex = index;
        if (e.key === 'ArrowRight') {
            nextIndex = (index + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft') {
            nextIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
            nextIndex = 0;
        } else if (e.key === 'End') {
            nextIndex = tabs.length - 1;
        } else {
            return;
        }
        
        e.preventDefault();
        const nextTab = tabRefs.current[nextIndex];
        if (nextTab) {
            nextTab.focus();
            setActiveTab(tabs[nextIndex].id);
        }
    };


    return (
        <aside className="flex-shrink-0 bg-white dark:bg-stone-800 border-l border-stone-200 dark:border-stone-700 w-full md:w-96 flex flex-col" role="complementary">
            <div className="flex items-center justify-center p-2 border-b border-stone-200 dark:border-stone-700" role="tablist" aria-label="Panneaux latéraux">
                {tabs.map((tab, index) => (
                    <button
                        key={tab.id}
                        ref={(el) => { tabRefs.current[index] = el; }}
                        id={`tab-${tab.id}`}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`panel-${tab.id}`}
                        tabIndex={activeTab === tab.id ? 0 : -1}
                        data-tab-id={tab.id}
                        onClick={handleTabClick}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-stone-800 focus:ring-[#c5a382] ${
                            activeTab === tab.id
                            ? 'bg-[#c5a382] text-white shadow-sm'
                            : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                        }`}
                        title={tab.name}
                    >
                        <span className="sm:hidden">{tab.icon}</span>
                        <span className="hidden sm:inline">{tab.name}</span>
                    </button>
                ))}
            </div>
            <div id={`panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`} className="flex-1 overflow-y-auto">
                {children}
            </div>
        </aside>
    );
};