export interface WorkoutLog {
    id?: number;
    date: string;
    type: 'MURPH' | 'HEAVY' | 'RUN' | 'RUCK' | 'REST' | 'OTHER';
    details: string; // JSON string of specific metrics
    fatigue_score?: number; // 1-10
    notes?: string;
}

export interface Recommendation {
    id?: number;
    week_start_date: string;
    generated_at: string;
    targets: string; // JSON string of target metrics for each workout type
}

export interface UserStats {
    id?: number;
    weight: number;
    murph_pr_time?: number; // seconds
    deadlift_1rm?: number;
    bench_1rm?: number;
    squat_1rm?: number;
    weighted_pullup_1rm?: number;
}

export const INIT_QUERIES = [
    `CREATE TABLE IF NOT EXISTS workout_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    type TEXT NOT NULL,
    details TEXT,
    fatigue_score INTEGER,
    notes TEXT
  );`,
    `CREATE TABLE IF NOT EXISTS recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    week_start_date TEXT NOT NULL,
    generated_at TEXT NOT NULL,
    targets TEXT
  );`,
    `CREATE TABLE IF NOT EXISTS user_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    weight REAL,
    murph_pr_time INTEGER,
    deadlift_1rm REAL,
    bench_1rm REAL,
    squat_1rm REAL,
    weighted_pullup_1rm REAL
  );`,
    // Seed initial data if empty
    `INSERT OR IGNORE INTO user_stats (id, weight) VALUES (1, 75);`
];
