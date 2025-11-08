import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AuthPage } from './components/AuthPage';
import { Header } from './components/Header';
import { User, Reminder, HealthData, login, logout, updateUser, AlertSettings } from './services/authService';
import { getChatResponse, getTextToSpeech } from './services/geminiService';
import { Message, ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { SidePanel } from './components/SidePanel';
import { ReminderPanel } from './components/ReminderPanel';
import { HealthStatsPanel } from './components/HealthStatsPanel';
import { SymptomCheckerPanel } from './components/SymptomCheckerPanel';
import { EducationPanel } from './components/EducationPanel';
import { ImageEditorPanel } from './components/ImageEditorPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { SubscriptionPanel } from './components/SubscriptionPanel';
import { PremiumFeatureLock } from './components/PremiumFeatureLock';
import { ReminderModal } from './components/ReminderModal';
import { HealthDataModal } from './components/HealthDataModal';
import { PaymentModal } from './components/PaymentModal';
import { AlertBanner, HealthAlert } from './components/AlertBanner';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { showNotification, setupNotifications } from './services/notificationService';

type SidePanelTab = 'stats' | 'reminders' | 'symptoms' | 'education' | 'images' | 'subscription' | 'settings';

const generateHistoricalData = (): HealthData[] => {
    const data: HealthData[] = [];
    const now = new Date();
    for (let i = 30; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const isoDate = date.toISOString();

        // Blood Pressure
        const systolic = 120 + Math.floor(Math.random() * 20) - 10;
        const diastolic = 80 + Math.floor(Math.random() * 10) - 5;
        data.push({ id: `bp-${i}`, type: 'bloodPressure', value: { systolic: String(systolic), diastolic: String(diastolic) }, date: isoDate, unit: 'mmHg' });

        // Heart Rate
        const heartRate = 70 + Math.floor(Math.random() * 15) - 7;
        data.push({ id: `hr-${i}`, type: 'heartRate', value: String(heartRate), date: isoDate, unit: 'bpm' });
        
        // Blood Sugar (less frequent)
        if (i % 3 === 0) {
             const bloodSugar = 90 + Math.floor(Math.random() * 40) - 20;
             data.push({ id: `bs-${i}`, type: 'bloodSugar', value: String(bloodSugar), date: isoDate, unit: 'mg/dL' });
        }
    }
    return data;
};


const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeSidePanelTab, setActiveSidePanelTab] = useState<SidePanelTab>('stats');
    
    // State for modals
    const [isReminderModalOpen, setReminderModalOpen] = useState(false);
    const [isHealthDataModalOpen, setHealthDataModalOpen] = useState(false);
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

    // App data state
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [healthData, setHealthData] = useState<HealthData[]>([]);
    const [activeAlerts, setActiveAlerts] = useState<HealthAlert[]>([]);
    const [isThinkingMode, setIsThinkingMode] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);

    const handleTranscriptionComplete = (fullTranscript: string) => {
        if (fullTranscript.trim()) {
            handleSendMessage(fullTranscript.trim());
        }
    };
    
    const { isRecording, transcript, startRecording, stopRecording } = useAudioRecorder({
        onTranscriptionComplete: handleTranscriptionComplete,
        onError: (error) => console.error("Recording Error:", error),
    });

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('chronic_care_current_user');
            if (storedUser && storedUser !== 'undefined') {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                // Load user-specific data
                setReminders([
                    { id: '1', name: 'Metformin', dosage: '1 comprimé', time: '08:00' },
                    { id: '2', name: 'Lisinopril', dosage: '10mg', time: '09:00' },
                ]);
                setHealthData(generateHistoricalData());
                setupNotifications();
            }
        } catch (error) {
            console.error("Échec de la restauration de la session, déconnexion :", error);
            // If user data is corrupted, clean it up to prevent an error loop
            logout();
        }
    }, []);
    
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    const handleLoginSuccess = (loggedInUser: User) => {
        setUser(loggedInUser);
        setupNotifications();
    };

    const handleLogout = () => {
        logout();
        setUser(null);
        setMessages([]);
    };

    const handleSendMessage = async (message: string) => {
        if (!message.trim()) return;

        const userMessage: Message = { role: 'user', text: message };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await getChatResponse(message, messages, isThinkingMode);
            
            const modelResponseText = response.text;
            let audioUrl = '';
            
            if (modelResponseText) {
                audioUrl = await getTextToSpeech(modelResponseText);
            }

            const modelMessage: Message = {
                role: 'model',
                text: modelResponseText,
                audioUrl: audioUrl,
            };
            setMessages(prev => [...prev, modelMessage]);

        } catch (error) {
            console.error('Error fetching chat response:', error);
            const errorMessage: Message = {
                role: 'model',
                text: "Désolé, une erreur s'est produite. Veuillez réessayer.",
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const checkHealthAlerts = (dataPoint: HealthData, settings: AlertSettings) => {
        const newAlerts: HealthAlert[] = [];
        const { type, value, unit } = dataPoint;

        switch (type) {
            case 'bloodPressure':
                if (typeof value === 'object') {
                    const { systolic, diastolic } = value;
                    if (Number(systolic) > settings.bloodPressure.highSystolic) {
                        newAlerts.push({ id: Date.now().toString() + 'systolic-high', message: `Tension systolique élevée: ${systolic} ${unit}` });
                    }
                    if (Number(systolic) < settings.bloodPressure.lowSystolic) {
                        newAlerts.push({ id: Date.now().toString() + 'systolic-low', message: `Tension systolique basse: ${systolic} ${unit}` });
                    }
                    if (Number(diastolic) > settings.bloodPressure.highDiastolic) {
                        newAlerts.push({ id: Date.now().toString() + 'diastolic-high', message: `Tension diastolique élevée: ${diastolic} ${unit}` });
                    }
                    if (Number(diastolic) < settings.bloodPressure.lowDiastolic) {
                        newAlerts.push({ id: Date.now().toString() + 'diastolic-low', message: `Tension diastolique basse: ${diastolic} ${unit}` });
                    }
                }
                break;
            case 'bloodSugar':
                if (Number(value) > settings.bloodSugar.high) {
                    newAlerts.push({ id: Date.now().toString(), message: `Glycémie élevée: ${value} ${unit}` });
                }
                if (Number(value) < settings.bloodSugar.low) {
                    newAlerts.push({ id: Date.now().toString(), message: `Glycémie basse: ${value} ${unit}` });
                }
                break;
            case 'spO2':
                 if (Number(value) < settings.spO2.low) {
                    newAlerts.push({ id: Date.now().toString(), message: `Faible saturation en oxygène: ${value} ${unit}` });
                }
                break;
            // Add checks for other types like weight if needed
        }
        
        if (newAlerts.length > 0) {
            setActiveAlerts(prev => [...prev, ...newAlerts]);
            newAlerts.forEach(alert => {
                showNotification('Alerte Santé - ChronicCare AI', { body: alert.message });
            });
        }
    };
    
    // --- Data Handlers ---
    const handleAddReminder = (name: string, dosage: string, time: string) => {
        const newReminder: Reminder = { id: Date.now().toString(), name, dosage, time };
        setReminders(prev => [...prev, newReminder]);
        showNotification('Rappel de médicament ajouté', { body: `${name} (${dosage}) à ${time}`});
    };
    
    const handleDeleteReminder = (id: string) => {
        setReminders(prev => prev.filter(r => r.id !== id));
    };
    
    const handleAddHealthData = (data: Omit<HealthData, 'id'>) => {
        const newData: HealthData = { ...data, id: Date.now().toString() };
        setHealthData(prev => [...prev, newData]);
        if (user) {
            checkHealthAlerts(newData, user.alertSettings);
        }
    };
    
     const handleDismissAlert = (id: string) => {
        setActiveAlerts(prev => prev.filter(alert => alert.id !== id));
    };
    
    const handleUpdateAlertSettings = (settings: any) => {
        if(user) {
            const updatedUser = { ...user, alertSettings: settings };
            setUser(updatedUser);
            updateUser(updatedUser);
        }
    };

    const handleUpgradeSuccess = () => {
        if (user) {
            const upgradedUser = { ...user, status: 'premium' as const };
            setUser(upgradedUser);
            updateUser(upgradedUser);
        }
    };

    const handleSetActiveTab = (tab: SidePanelTab) => {
        setActiveSidePanelTab(tab);
    };

    const renderSidePanel = () => {
        if (!user) return null;
        switch (activeSidePanelTab) {
            case 'stats':
                return <HealthStatsPanel healthData={healthData} onAddHealthDataClick={() => setHealthDataModalOpen(true)} user={user} onUpgradeClick={() => handleSetActiveTab('subscription')} />;
            case 'reminders':
                return <ReminderPanel reminders={reminders} onAddClick={() => setReminderModalOpen(true)} onDeleteReminder={handleDeleteReminder} userStatus={user.status} onUpgradeClick={() => handleSetActiveTab('subscription')}/>;
            case 'symptoms':
                return <SymptomCheckerPanel />;
            case 'education':
                return <EducationPanel />;
            case 'images':
                 return user.status === 'premium' ? <ImageEditorPanel /> : <PremiumFeatureLock featureName="Éditeur d'Images IA" onUpgradeClick={() => handleSetActiveTab('subscription')} />;
            case 'subscription':
                return <SubscriptionPanel status={user.status} onUpgradeClick={() => setPaymentModalOpen(true)} />;
            case 'settings':
                return user.status === 'premium' ? <SettingsPanel alertSettings={user.alertSettings} onUpdateAlertSettings={handleUpdateAlertSettings} /> : <PremiumFeatureLock featureName="Paramètres d'alerte" onUpgradeClick={() => handleSetActiveTab('subscription')} />;
            default:
                return null;
        }
    };

    if (!user) {
        return <AuthPage onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="flex flex-col h-screen bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-stone-200">
            <Header userName={user.name} onLogout={handleLogout} />
            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 flex flex-col relative">
                    <AlertBanner alerts={activeAlerts} onDismiss={handleDismissAlert} />
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                       {messages.map((msg, index) => (
                          <ChatMessage key={index} message={msg} />
                       ))}
                        {isLoading && (
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-[#c5a382] text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse"><path d="M12 2a10 10 0 0 0-3.54 19.54A10 10 0 0 0 12 2Z"/></svg>
                                </div>
                                <div className="max-w-xl px-4 py-3 rounded-lg shadow-md bg-white dark:bg-stone-700 animate-pulse">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                                </div>
                            </div>
                        )}
                       <div ref={chatEndRef} />
                    </div>
                    <ChatInput
                        onSendMessage={handleSendMessage}
                        isLoading={isLoading}
                        isRecording={isRecording}
                        startRecording={startRecording}
                        stopRecording={stopRecording}
                        transcript={transcript}
                    />
                </main>

                <SidePanel activeTab={activeSidePanelTab} setActiveTab={handleSetActiveTab}>
                    {renderSidePanel()}
                </SidePanel>
            </div>
            
            <ReminderModal 
                isOpen={isReminderModalOpen} 
                onClose={() => setReminderModalOpen(false)} 
                onAddReminder={handleAddReminder} 
            />
            <HealthDataModal
                isOpen={isHealthDataModalOpen}
                onClose={() => setHealthDataModalOpen(false)}
                onAddData={handleAddHealthData}
            />
            <PaymentModal 
                isOpen={isPaymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                onSuccess={handleUpgradeSuccess}
            />
        </div>
    );
};

export default App;