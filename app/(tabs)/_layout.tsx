import React, { useContext } from 'react';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ThemeProvider, ThemeContext } from '../../lib/ThemeContext';

function ThemedTabs() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
         tabBarActiveTintColor: darkMode ? '#fff' : '#1A3164',
       tabBarInactiveTintColor: darkMode ? '#bbb' : '#888',
        tabBarStyle: {
          backgroundColor: darkMode ? '#121212' : '#fff',
          borderTopColor: darkMode ? '#222' : '#eee',
          height: 85,
          paddingTop: 5,
        },
       
      
         tabBarLabelStyle: {
  fontSize: 13,
  fontWeight: '500',
  marginTop: -5,
  color: darkMode ? '#fff' : '#000', // <- This does NOT always apply, see note below
},

      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <Ionicons name="home" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <Ionicons name="search" color={color} size={26} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="playlist-music" size={29} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <FontAwesome name="gear" color={color} size={25} />,
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <ThemeProvider>
      <ThemedTabs />
    </ThemeProvider>
  );
}
