import * as SQLite from 'expo-sqlite';
import { INIT_QUERIES } from './schema';

const db = SQLite.openDatabase('murph.db');

export const initDatabase = () => {
    return new Promise<void>((resolve, reject) => {
        db.transaction(tx => {
            for (const query of INIT_QUERIES) {
                tx.executeSql(query);
            }
        },
            (error) => {
                console.error("DB Init Error", error);
                reject(error);
            },
            () => {
                console.log("DB Initialized");
                resolve();
            });
    });
};

export const getDB = () => db;

// Helper to run queries as promises
export const runQuery = (query: string, params: any[] = []): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(query, params, (_, { rows }) => {
                resolve(rows._array);
            }, (_, error) => {
                reject(error);
                return false;
            });
        });
    });
};

export const runInsert = (query: string, params: any[] = []): Promise<number> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(query, params, (_, { insertId }) => {
                resolve(insertId || 0);
            }, (_, error) => {
                reject(error);
                return false;
            });
        });
    });
};
