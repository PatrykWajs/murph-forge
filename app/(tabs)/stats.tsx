import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Pressable, TextInput, Platform, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { NeonCard } from '../../src/components/NeonCard';
import { exportData, updateUserStats, getUserStats } from '../../src/db/db';

const { width } = Dimensions.get('window');

const MOCK_DATA_MURPH = [30, 35, 40, 35, 45, 50, 55, 60];
const MOCK_DATA_VOLUME = [12, 15, 18, 10, 22, 25, 28]; // Weekly volume arbitrary units

export default function StatsScreen() {
    const [weight, setWeight] = useState('');

    const handleUpdateWeight = async () => {
        if (!weight) return;
        await updateUserStats({ weight: parseFloat(weight) });
        setWeight('');
        alert("Bodyweight logged!");
    };

    const handleExport = async () => {
        const data = await exportData();
        if (Platform.OS === 'web') {
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `murph-forge-export-${Date.now()}.json`;
            a.click();
        } else {
            const uri = FileSystem.documentDirectory + 'murph_export.json';
            await FileSystem.writeAsStringAsync(uri, data);
            await Sharing.shareAsync(uri);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.title}>PERFORMANCE DATA</Text>
                    <Pressable onPress={handleExport} style={styles.exportBtn}>
                        <Text style={styles.exportText}>EXPORT DATA</Text>
                    </Pressable>
                </View>

                {/* Weight Tracker */}
                <NeonCard style={styles.chartCard} glowColor="#FFF">
                    <Text style={styles.chartTitle}>BODY METRICS</Text>
                    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 10 }}>
                        <TextInput
                            style={styles.input}
                            placeholder="Current Weight (kg)"
                            placeholderTextColor="#666"
                            keyboardType="numeric"
                            value={weight}
                            onChangeText={setWeight}
                        />
                        <Pressable onPress={handleUpdateWeight} style={styles.updateBtn}>
                            <Text style={styles.btnText}>LOG</Text>
                        </Pressable>
                    </View>
                </NeonCard>

                <NeonCard style={styles.chartCard} intensity="high" glowColor="#00F0FF">
                    <Text style={styles.chartTitle}>MURPH PROGRESSION (%)</Text>
                    <View style={styles.chartContainer}>
                        <SimpleLineChart data={MOCK_DATA_MURPH} color="#00F0FF" />
                    </View>
                </NeonCard>

                <NeonCard style={styles.chartCard} glowColor="#BC13FE">
                    <Text style={styles.chartTitle}>WEEKLY VOLUME LOAD</Text>
                    <View style={styles.chartContainer}>
                        <SimpleBarChart data={MOCK_DATA_VOLUME} color="#BC13FE" />
                    </View>
                </NeonCard>

                <NeonCard style={styles.chartCard} glowColor="#00FF66">
                    <Text style={styles.chartTitle}>1RM TRENDS (DEADLIFT)</Text>
                    <View style={styles.chartContainer}>
                        {/* Reusing Line Chart with different data */}
                        <SimpleLineChart data={[100, 105, 105, 110, 112.5, 120]} color="#00FF66" />
                    </View>
                </NeonCard>

            </ScrollView>
        </SafeAreaView>
    );
}

// Simple Custom Charts to avoid heavy library deps setup in this simplified demo
const SimpleLineChart = ({ data, color }: { data: number[], color: string }) => {
    const chartHeight = 150;
    const chartWidth = width - 80;
    const maxVal = Math.max(...data) * 1.2;
    const stepX = chartWidth / (data.length - 1);

    const points = data.map((val, i) => {
        const x = i * stepX + 10;
        const y = chartHeight - (val / maxVal) * chartHeight;
        return `${x},${y}`;
    }).join(' ');

    return (
        <Svg height={chartHeight} width="100%">
            <Path
                d={`M ${points}`}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {data.map((val, i) => {
                const x = i * stepX + 10;
                const y = chartHeight - (val / maxVal) * chartHeight;
                return <Circle key={i} cx={x} cy={y} r="4" fill="#000" stroke={color} strokeWidth="2" />;
            })}
        </Svg>
    );
};

const SimpleBarChart = ({ data, color }: { data: number[], color: string }) => {
    const chartHeight = 150;
    const chartWidth = width - 80;
    const maxVal = Math.max(...data) * 1.2;
    const barWidth = (chartWidth / data.length) * 0.6;
    const stepX = chartWidth / data.length;

    return (
        <Svg height={chartHeight} width="100%">
            {data.map((val, i) => {
                const height = (val / maxVal) * chartHeight;
                const x = i * stepX + 10;
                const y = chartHeight - height;
                return (
                    <Rect
                        key={i}
                        x={x}
                        y={y}
                        width={barWidth}
                        height={height}
                        fill={color}
                        rx={4}
                    />
                );
            })}
        </Svg>
    );
};


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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    chartCard: {
        marginBottom: 20,
        padding: 16,
    },
    chartTitle: {
        color: '#AAA',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10,
        letterSpacing: 1,
    },
    chartContainer: {
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
    },
    exportBtn: {
        backgroundColor: '#333',
        padding: 8,
        borderRadius: 8,
        marginBottom: 20
    },
    exportText: {
        color: '#00F0FF',
        fontWeight: 'bold',
        fontSize: 10
    },
    input: {
        backgroundColor: '#333',
        color: 'white',
        padding: 12,
        borderRadius: 8,
        flex: 1
    },
    updateBtn: {
        backgroundColor: '#00F0FF',
        padding: 12,
        borderRadius: 8
    },
    btnText: {
        fontWeight: 'bold',
        color: 'black'
    }
});
