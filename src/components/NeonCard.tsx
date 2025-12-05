import React from 'react';
import { View, ViewProps } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);

interface NeonCardProps extends ViewProps {
    glowColor?: string;
    intensity?: 'low' | 'high';
}

export const NeonCard: React.FC<NeonCardProps> = ({
    children,
    style,
    glowColor = '#00F0FF',
    intensity = 'low',
    ...props
}) => {
    // Simulate neon glow with shadow props (iOS/Android handling differs, simplified here)
    const glowStyle = {
        shadowColor: glowColor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: intensity === 'high' ? 0.8 : 0.4,
        shadowRadius: intensity === 'high' ? 15 : 8,
        elevation: intensity === 'high' ? 10 : 5,
        borderWidth: 1,
        borderColor: glowColor,
        backgroundColor: '#1E1E1E'
    };

    return (
        <View style={[glowStyle, { borderRadius: 16, padding: 16 }, style]} {...props}>
            {children}
        </View>
    );
};
