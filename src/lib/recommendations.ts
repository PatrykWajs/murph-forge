import { WorkoutLog, UserStats } from '../db/schema';
import { getLogs, getUserStats } from '../db/db';

export interface WeeklyRecommendation {
    murph_target_percent: number;
    murph_details: string;
    heavy_deadlift_weight: number;
    rucking_target_desc: string;
    long_run_distance_km: number;
    notes: string;
    is_deload: boolean;
}

export const analyzeAndRecommend = async (): Promise<WeeklyRecommendation> => {
    // 1. Fetch last week's logs (Mocked for now as we don't have real data yet)
    const allLogs = await getLogs();
    const logs = allLogs.filter(l => new Date(l.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

    // 2. Calculate fatigue
    const avgFatigue = logs.reduce((acc, log) => acc + (log.fatigue_score || 5), 0) / (logs.length || 1);

    // 3. Current Defaults (Should be fetched from UserStats/History in real app)
    let currentMurphPercent = 40; // Default start
    let currentDeadlift = 100;
    let currentRun = 5; // km

    // 4. Logic Engine
    const recommendation: WeeklyRecommendation = {
        murph_target_percent: currentMurphPercent,
        murph_details: "",
        heavy_deadlift_weight: currentDeadlift,
        rucking_target_desc: "15kg x 5km",
        long_run_distance_km: currentRun,
        notes: "Steady progress.",
        is_deload: false
    };

    if (avgFatigue > 7) {
        recommendation.is_deload = true;
        recommendation.murph_target_percent = Math.max(20, currentMurphPercent - 20);
        recommendation.notes = "High fatigue detected. Deload week active. Volume reduced.";
        recommendation.heavy_deadlift_weight = currentDeadlift * 0.7;
    } else {
        // Progressive Overload
        // Cap increase at 10% roughly
        recommendation.murph_target_percent = Math.min(100, currentMurphPercent + 5);
        recommendation.heavy_deadlift_weight = currentDeadlift + 2.5;
        recommendation.long_run_distance_km = currentRun + 0.5;

        // Construct dynamic string
        const diff = recommendation.murph_target_percent - currentMurphPercent;
        recommendation.murph_details = `Increase volume by ~${diff}%. Focus on unbroken sets.`;
    }

    return recommendation;
};
