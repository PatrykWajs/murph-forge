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

// SQLite queries removed for Web compatibility
