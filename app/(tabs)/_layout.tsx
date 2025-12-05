import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#00F0FF',
                tabBarInactiveTintColor: '#666',
                tabBarStyle: {
                    backgroundColor: '#000',
                    borderTopColor: '#333'
                },
                headerStyle: {
                    backgroundColor: '#000',
                },
                headerTitleStyle: {
                    color: '#FFF'
                }
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="workout"
                options={{
                    title: 'Forge',
                    tabBarIcon: ({ color }) => <TabBarIcon name="fire" color={color} />,
                }}
            />
            <Tabs.Screen
                name="stats"
                options={{
                    title: 'Stats',
                    tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
                }}
            />
        </Tabs>
    );
}
