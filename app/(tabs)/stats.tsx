import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Line, Circle, Rect } from 'react-native-svg';

import { NeonCard } from '../../src/components/NeonCard';

const { width } = Dimensions.get('window');

const MOCK_DATA_MURPH = [30, 35, 40, 35, 45, 50, 55, 60];
const MOCK_DATA_VOLUME = [12, 15, 18, 10, 22, 25, 28]; // Weekly volume arbitrary units

export default function StatsScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>PERFORMANCE DATA</Text>

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
    }
});
