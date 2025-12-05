import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { NeonCard } from '../../src/components/NeonCard';
import { calculateMurphScale, suggestWorkouts } from '../../src/lib/murphCalculator';

export default function WorkoutScreen() {
    const [isActive, setIsActive] = useState(false);
    const [percent, setPercent] = useState(50);
    const [vest, setVest] = useState(0);
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // Active Workout State
    const [volume, setVolume] = useState(calculateMurphScale({ percentage: 50, vestWeight: 0 }));

    useEffect(() => {
        setVolume(calculateMurphScale({ percentage: percent, vestWeight: vest }));
    }, [percent, vest]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning) {
            interval = setInterval(() => setTimer(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const toggleTimer = () => setIsTimerRunning(!isTimerRunning);

    if (isActive) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.activeHeader}>
                    <Text style={styles.timerText}>{formatTime(timer)}</Text>
                    <Pressable onPress={toggleTimer} style={styles.timerBtn}>
                        <FontAwesome name={isTimerRunning ? "pause" : "play"} size={24} color="black" />
                    </Pressable>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <NeonCard style={styles.missionCard} glowColor="#00FF66">
                        <Text style={styles.activeLabel}>CURRENT MISSION</Text>
                        <View style={styles.statRow}>
                            <Text style={styles.statLabel}>Run 1</Text>
                            <Text style={styles.statValue}>{volume.run}m</Text>
                        </View>
                        <View style={styles.statRow}>
                            <Text style={styles.statLabel}>Pull-ups</Text>
                            <Text style={styles.statValue}>{volume.pullups}</Text>
                        </View>
                        <View style={styles.statRow}>
                            <Text style={styles.statLabel}>Push-ups</Text>
                            <Text style={styles.statValue}>{volume.pushups}</Text>
                        </View>
                        <View style={styles.statRow}>
                            <Text style={styles.statLabel}>Squats</Text>
                            <Text style={styles.statValue}>{volume.squats}</Text>
                        </View>
                        <View style={styles.statRow}>
                            <Text style={styles.statLabel}>Run 2</Text>
                            <Text style={styles.statValue}>{volume.run}m</Text>
                        </View>
                    </NeonCard>

                    <Pressable
                        style={styles.finishBtn}
                        onPress={() => {
                            setIsActive(false);
                            setIsTimerRunning(false);
                            setTimer(0);
                            alert("Workout Logged!");
                        }}
                    >
                        <Text style={styles.finishText}>COMPLETE MISSION</Text>
                    </Pressable>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>FORGE YOUR MURPH</Text>

                {/* Wizard */}
                <NeonCard style={styles.wizardCard} intensity="high">
                    <Text style={styles.label}>VOLUME: {percent}%</Text>
                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={0}
                        maximumValue={100}
                        step={5}
                        value={percent}
                        onValueChange={setPercent}
                        minimumTrackTintColor="#00F0FF"
                        maximumTrackTintColor="#333"
                        thumbTintColor="#00F0FF"
                    />

                    <Text style={styles.label}>VEST WEIGHT: {vest} KG</Text>
                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={0}
                        maximumValue={20}
                        step={10}
                        value={vest}
                        onValueChange={setVest}
                        minimumTrackTintColor="#BC13FE"
                        maximumTrackTintColor="#333"
                        thumbTintColor="#BC13FE"
                    />

                    <View style={styles.previewContainer}>
                        <View style={styles.previewItem}>
                            <Text style={styles.previewVal}>{volume.run}m</Text>
                            <Text style={styles.previewLabel}>RUN</Text>
                        </View>
                        <View style={styles.previewItem}>
                            <Text style={styles.previewVal}>{volume.pullups}</Text>
                            <Text style={styles.previewLabel}>PULL</Text>
                        </View>
                        <View style={styles.previewItem}>
                            <Text style={styles.previewVal}>{volume.pushups}</Text>
                            <Text style={styles.previewLabel}>PUSH</Text>
                        </View>
                        <View style={styles.previewItem}>
                            <Text style={styles.previewVal}>{volume.squats}</Text>
                            <Text style={styles.previewLabel}>SQUAT</Text>
                        </View>
                    </View>

                    <Text style={styles.strategyText}>
                        Strategy: {suggestWorkouts(percent)}
                    </Text>
                </NeonCard>

                <Pressable
                    style={styles.startButton}
                    onPress={() => {
                        setIsActive(true);
                        setIsTimerRunning(true);
                    }}
                >
                    <Text style={styles.buttonText}>INITIATE SEQUENCE</Text>
                    <FontAwesome name="play" size={16} color="black" />
                </Pressable>

                <View style={styles.presets}>
                    <Text style={styles.sectionHeader}>PRESETS</Text>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <Pressable onPress={() => setPercent(50)} style={styles.chip}><Text style={styles.chipText}>Half Murph</Text></Pressable>
                        <Pressable onPress={() => setPercent(25)} style={styles.chip}><Text style={styles.chipText}>Quarter</Text></Pressable>
                        <Pressable onPress={() => setPercent(75)} style={styles.chip}><Text style={styles.chipText}>3/4</Text></Pressable>
                    </View>
                </View>

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
    },
    title: {
        color: 'white',
        fontSize: 28,
        fontFamily: 'System',
        fontWeight: 'bold',
        marginBottom: 20,
        letterSpacing: 1,
    },
    wizardCard: {
        marginBottom: 30,
        padding: 24,
    },
    label: {
        color: '#AAA',
        marginBottom: 10,
        marginTop: 10,
        fontWeight: 'bold',
    },
    previewContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    previewItem: {
        alignItems: 'center',
    },
    previewVal: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    previewLabel: {
        color: '#666',
        fontSize: 10,
        marginTop: 4,
    },
    strategyText: {
        color: '#00F0FF',
        fontStyle: 'italic',
        marginTop: 20,
        textAlign: 'center',
        fontSize: 12,
    },
    startButton: {
        backgroundColor: '#00F0FF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 12,
        gap: 10,
        marginBottom: 30,
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1,
    },
    sectionHeader: {
        color: 'white',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    chip: {
        backgroundColor: '#333',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    chipText: {
        color: 'white',
    },
    activeHeader: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    timerText: {
        color: '#FFF',
        fontSize: 60,
        fontFamily: 'System',
        fontWeight: 'bold',
        fontVariant: ['tabular-nums'],
    },
    timerBtn: {
        backgroundColor: '#00F0FF',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeLabel: {
        color: '#00FF66',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    missionCard: {
        marginBottom: 30,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    statLabel: {
        color: '#AAA',
        fontSize: 18,
    },
    statValue: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    finishBtn: {
        backgroundColor: '#BC13FE',
        paddingVertical: 20,
        borderRadius: 16,
        alignItems: 'center',
    },
    finishText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1,
    },
    presets: {
        marginTop: 20,
    }
});
