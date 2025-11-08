// services/authService.ts

export interface Reminder {
    id: string;
    name: string;
    dosage: string;
    time: string;
}

export type HealthDataType = 'heartRate' | 'bloodPressure' | 'bloodSugar' | 'spO2' | 'weight';

export interface HealthData {
    id: string;
    type: HealthDataType;
    value: string | { systolic: string, diastolic: string };
    date: string;
    unit: string;
}

export interface AlertSettings {
    bloodPressure: { highSystolic: number; highDiastolic: number; lowSystolic: number; lowDiastolic: number; };
    bloodSugar: { high: number; low: number; };
    spO2: { low: number; };
    weightChange: { amount: number; }; // in kg
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    status: 'free' | 'premium';
    alertSettings: AlertSettings;
}

const USERS_KEY = 'chronic_care_users';
const CURRENT_USER_KEY = 'chronic_care_current_user';

const defaultAlertSettings: AlertSettings = {
    bloodPressure: { highSystolic: 140, highDiastolic: 90, lowSystolic: 90, lowDiastolic: 60 },
    bloodSugar: { high: 180, low: 70 },
    spO2: { low: 92 },
    weightChange: { amount: 2 },
};

const initializeUsers = () => {
    if (!localStorage.getItem(USERS_KEY)) {
        const demoUser: User = {
            id: '1',
            name: 'Marie Curie',
            email: 'marie@curie.com',
            status: 'free',
            alertSettings: defaultAlertSettings,
        };
        const demoUserWithPassword = { ...demoUser, password: 'password123' };
        localStorage.setItem(USERS_KEY, JSON.stringify({ [demoUser.email]: demoUserWithPassword }));
    }
};

initializeUsers();

const getUsers = (): { [email: string]: User & { password?: string } } => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
};

const saveUsers = (users: { [email: string]: User & { password?: string } }) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const login = (email: string, password_param: string): User => {
    const users = getUsers();
    const userRecord = users[email];
    if (!userRecord || userRecord.password !== password_param) {
        throw new Error('Adresse e-mail ou mot de passe incorrect.');
    }
    const { password, ...user } = userRecord;
    // Ensure existing users have alert settings
    if (!user.alertSettings) {
        user.alertSettings = defaultAlertSettings;
    }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
};

export const signup = (name: string, email: string, password_param: string, phone: string): User => {
    const users = getUsers();
    if (users[email]) {
        throw new Error('Un compte existe déjà avec cette adresse e-mail.');
    }
    const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        phone,
        status: 'free',
        alertSettings: defaultAlertSettings,
    };
    const newUserWithPassword = { ...newUser, password: password_param };
    users[email] = newUserWithPassword;
    saveUsers(users);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return newUser;
};

export const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
};

export const updateUser = (updatedUser: User): User => {
    const users = getUsers();
    const userRecord = users[updatedUser.email];
    if (userRecord) {
        const updatedRecord = { ...userRecord, ...updatedUser };
        users[updatedUser.email] = updatedRecord;
        saveUsers(users);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }
    return updatedUser;
};

export const forgotPassword = (email: string) => {
    const users = getUsers();
    if (!users[email]) {
        console.log(`Password reset requested for ${email}. If user exists, email will be sent. (Simulation)`);
    } else {
        console.log(`Password reset requested for ${email}. If user exists, email will be sent. (Simulation)`);
    }
};
