import React, { useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { ThemeContext } from '../../lib/ThemeContext'; // import your ThemeContext

export default function Settings() {
  const router = useRouter();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/landing');
  };

  // Safely handle toggle if setDarkMode not provided
  const toggleDarkMode = () => {
    if (setDarkMode) setDarkMode(!darkMode);
  };

  return (
    <SafeAreaView style={[styles.safeArea, darkMode && styles.darkSafeArea]}>
      <ScrollView
        style={[styles.container, darkMode && styles.darkContainer]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.sideContainer}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={darkMode ? '#fff' : '#1A3164'} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.title, darkMode && styles.darkTitle]}>Settings</Text>

          <View style={styles.sideContainer} />
        </View>

        {/* ACCOUNT Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkSectionTitle]}>ACCOUNT</Text>

          <TouchableOpacity
            style={[styles.item, darkMode && styles.darkItem]}
            onPress={() => router.push('/account')}
          >
            <Text style={[styles.itemText, darkMode && styles.darkItemText]}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.item, darkMode && styles.darkItem]}>
            <Text style={[styles.itemText, darkMode && styles.darkItemText]}>Change Password</Text>
          </TouchableOpacity>
        </View>

        {/* PREFERENCES Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkSectionTitle]}>PREFERENCES</Text>
          <View style={[styles.row, darkMode && styles.darkRow]}>
            <Text style={[styles.itemText, darkMode && styles.darkItemText]}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#888', true: '#1A3164' }}
              thumbColor={darkMode ? '#fff' : '#1A3164'}
            />
          </View>
        </View>

        {/* ABOUT Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkSectionTitle]}>ABOUT</Text>

          <TouchableOpacity
            style={[styles.item, darkMode && styles.darkItem]}
            onPress={() => router.push('/privacy-policy')}
          >
            <Text style={[styles.itemText, darkMode && styles.darkItemText]}>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.item, darkMode && styles.darkItem]}
            onPress={() => router.push('/terms')}
          >
            <Text style={[styles.itemText, darkMode && styles.darkItemText]}>Terms of Service</Text>
          </TouchableOpacity>
        </View>

        {/* Log out */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkSafeArea: {
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 18,
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#888',
    marginBottom: 10,
    paddingLeft: 5,
  },
  darkSectionTitle: {
    color: '#bbb',
  },
  item: {
    backgroundColor: '#EDF0F7',
    borderRadius: 13,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  darkItem: {
    backgroundColor: '#222',
  },
  itemText: {
    color: '#1A3164',
    fontSize: 15,
    fontWeight: '500',
  },
  darkItemText: {
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EDF0F7',
    borderRadius: 13,
    paddingVertical: 3,
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  darkRow: {
    backgroundColor: '#222',
  },
  logoutButton: {
    backgroundColor: '#1A3164',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 22,
  },
  sideContainer: {
    width: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A3164',
    textAlign: 'center',
    flex: 1,
  },
  darkTitle: {
    color: '#fff',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },
});
