import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming, Easing } from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
    progress: number; // 0 to 1
    size?: number;
    strokeWidth?: number;
    color?: string;
    label?: string;
    subLabel?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
    progress,
    size = 200,
    strokeWidth = 15,
    color = "#00F0FF",
    label = "0%",
    subLabel = "Progress"
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const animatedProgress = useSharedValue(0);

    useEffect(() => {
        animatedProgress.value = withTiming(progress, {
            duration: 1500,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
    }, [progress]);

    const animatedProps = useAnimatedProps(() => {
        return {
            strokeDashoffset: circumference * (1 - animatedProgress.value),
        };
    });

    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={size} height={size}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#333"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    originX={size / 2}
                    originY={size / 2}
                    rotation="-90"
                    animatedProps={animatedProps}
                />
            </Svg>
            <View style={StyleSheet.absoluteFillObject} className="justify-center items-center">
                <Text style={{ fontSize: size * 0.22, color: 'white', fontWeight: 'bold' }}>
                    {label}
                </Text>
                <Text style={{ fontSize: size * 0.08, color: '#AAA' }}>
                    {subLabel}
                </Text>
            </View>
        </View>
    );
};
