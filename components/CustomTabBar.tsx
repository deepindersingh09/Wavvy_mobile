import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CustomTabBar() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tabButton} onPress={() => router.replace('/home')}>
        <Ionicons name="home-outline" size={26} color="#1A3164" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabButton} onPress={() => router.replace('/search')}>
        <Ionicons name="search-outline" size={26} color="#1A3164" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabButton} onPress={() => router.replace('/library')}>
        <Ionicons name="musical-notes-outline" size={26} color="#1A3164" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabButton} onPress={() => router.replace('/settings')}>
        <Ionicons name="settings-outline" size={26} color="#1A3164" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: SCREEN_WIDTH,
    height: 100,
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -0 }, 
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 10,
    marginTop:40,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    marginTop:-45
  },
});

