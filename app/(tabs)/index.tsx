import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { NeonCard } from '../../src/components/NeonCard';
import { ProgressRing } from '../../src/components/ProgressRing';
import { analyzeAndRecommend, WeeklyRecommendation } from '../../src/lib/recommendations';

const SCHEDULE = [
    "Rest / Full Recovery", // 0 Sun
    "Scaled Murph (Bodyweight)", // 1 Mon
    "Heavy Day: Deadlift + Pull", // 2 Tue
    "Scaled Murph / Active Recovery", // 3 Wed
    "Long Slow Distance Run (Zone 2)", // 4 Thu
    "Scaled Murph (Time Trial)", // 5 Fri
    "Rucking (Weighted March)", // 6 Sat
];

export default function HomeScreen() {
    const router = useRouter();
    const [recommendation, setRecommendation] = useState<WeeklyRecommendation | null>(null);
    const [todayIndex, setTodayIndex] = useState(new Date().getDay());

    useEffect(() => {
        loadRecommendations();
    }, []);

    const loadRecommendations = async () => {
        try {
            const rec = await analyzeAndRecommend();
            setRecommendation(rec);
        } catch (e) {
            console.error(e);
        }
    };

    const todayWorkout = SCHEDULE[todayIndex];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Welcome, Athlete</Text>
                        <Text style={styles.date}>{format(new Date(), 'EEEE, MMM do')}</Text>
                    </View>
                    <View style={styles.streakContainer}>
                        <FontAwesome name="fire" size={24} color="#FF4500" />
                        <Text style={styles.streakText}>12</Text>
                    </View>
                </View>

                {/* Progress Section */}
                <View style={styles.progressSection}>
                    <ProgressRing
                        progress={(recommendation?.murph_target_percent || 0) / 100}
                        label={`${recommendation?.murph_target_percent || 0}%`}
                        subLabel="Murph Vol"
                        color="#00F0FF"
                        size={220}
                    />
                </View>

                {/* Today's Workout Card */}
                <NeonCard intensity="high" style={styles.workoutCard} glowColor="#BC13FE">
                    <LinearGradient
                        colors={['rgba(188, 19, 254, 0.1)', 'transparent']}
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardLabel}>TODAY'S MISSION</Text>
                        <View style={styles.pill}>
                            <Text style={styles.pillText}>PRIORITY</Text>
                        </View>
                    </View>

                    <Text style={styles.workoutTitle}>{todayWorkout}</Text>

                    {todayIndex === 1 || todayIndex === 3 || todayIndex === 5 ? (
                        <Text style={styles.workoutDetail}>
                            Target: {recommendation?.murph_target_percent}% Volume.
                            {'\n'}{recommendation?.murph_details}
                        </Text>
                    ) : (
                        <Text style={styles.workoutDetail}>
                            Consult the Forge for details.
                        </Text>
                    )}

                    <Pressable
                        style={({ pressed }) => [styles.startButton, pressed && styles.buttonPressed]}
                        onPress={() => router.push('/workout')}
                    >
                        <Text style={styles.buttonText}>START WORKOUT</Text>
                        <FontAwesome name="arrow-right" size={16} color="black" />
                    </Pressable>
                </NeonCard>

                {/* Next Week Preview */}
                <NeonCard style={styles.statsCard} glowColor="#00FF66">
                    <Text style={styles.cardLabel}>NEXT WEEK PREVIEW</Text>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Murph Scale</Text>
                        <Text style={styles.statValue}>+5%</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Deadlift</Text>
                        <Text style={styles.statValue}>+2.5kg</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Run</Text>
                        <Text style={styles.statValue}>+0.5km</Text>
                    </View>
                </NeonCard>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    greeting: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'System',
    },
    date: {
        color: '#666',
        fontSize: 14,
    },
    streakContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#1E1E1E',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    streakText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
    progressSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    workoutCard: {
        marginBottom: 20,
        minHeight: 180,
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    cardLabel: {
        color: '#00F0FF',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    pill: {
        backgroundColor: '#BC13FE',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    pillText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    workoutTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    workoutDetail: {
        color: '#AAA',
        fontSize: 14,
        marginBottom: 20,
    },
    startButton: {
        backgroundColor: '#00F0FF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 10,
    },
    buttonPressed: {
        opacity: 0.8,
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },
    statsCard: {
        gap: 12,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        paddingBottom: 8,
    },
    statLabel: {
        color: '#CCC',
    },
    statValue: {
        color: '#00FF66',
        fontWeight: 'bold',
    }
});
