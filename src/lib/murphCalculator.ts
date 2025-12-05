export interface MurphConfig {
    percentage: number; // 0-100
    vestWeight: number; // kg, usually 0, 10, or 20
}

export interface MurphVolume {
    run: number; // meters
    pullups: number;
    pushups: number;
    squats: number;
    rounds?: number; // if partitioned
}

const FULL_MURPH = {
    run: 3200, // 2 miles = ~3200m
    pullups: 100,
    pushups: 200,
    squats: 300,
};

export const calculateMurphScale = (config: MurphConfig): MurphVolume => {
    const scale = config.percentage / 100;

    return {
        run: Math.round(FULL_MURPH.run * scale),
        pullups: Math.round(FULL_MURPH.pullups * scale),
        pushups: Math.round(FULL_MURPH.pushups * scale),
        squats: Math.round(FULL_MURPH.squats * scale),
    };
};

export const suggestWorkouts = (percent: number) => {
    // Suggest partitions based on volume
    if (percent > 80) return "20 rounds: 5 Pull, 10 Push, 15 Squat";
    if (percent > 50) return "10 rounds: 5 Pull, 10 Push, 15 Squat (Scaled)";
    return "Accumulate volume as needed. Break into small sets.";
};
