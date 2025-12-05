import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutLog, UserStats } from './schema';

const STORAGE_KEYS = {
    LOGS: '@murph_forge_logs',
    STATS: '@murph_forge_stats'
};

export const initDatabase = async () => {
    // Check if keys exist, if not, init them
    const logs = await AsyncStorage.getItem(STORAGE_KEYS.LOGS);
    if (!logs) await AsyncStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify([]));

    const stats = await AsyncStorage.getItem(STORAGE_KEYS.STATS);
    if (!stats) {
        const initialStats: UserStats = { id: 1, weight: 75 };
        await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(initialStats));
    }
};

// Generic Helpers
export const getLogs = async (): Promise<WorkoutLog[]> => {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.LOGS);
    return json ? JSON.parse(json) : [];
};

export const addLog = async (log: WorkoutLog) => {
    const logs = await getLogs();
    const newLog = { ...log, id: Date.now() }; // Simple ID
    logs.push(newLog);
    await AsyncStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    return newLog.id;
};

export const getUserStats = async (): Promise<UserStats> => {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.STATS);
    return json ? JSON.parse(json) : { weight: 75 };
};

export const updateUserStats = async (updates: Partial<UserStats>) => {
    const current = await getUserStats();
    const updated = { ...current, ...updates };
    await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));
};

export const exportData = async () => {
    const logs = await getLogs();
    const stats = await getUserStats();
    return JSON.stringify({ logs, stats }, null, 2);
};
