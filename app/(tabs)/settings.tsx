import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function Settings() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/landing'); // Or wherever your login/landing is
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity
            style={styles.item}
            onPress={() => router.push('/account')}
          >
            <Text style={styles.itemText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>Change Password</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.row}>
            <Text style={styles.itemText}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#EDF0F7", true: "#1A3164" }}
              thumbColor={darkMode ? "#fff" : "#1A3164"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>Terms of Service</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff', padding: 18 },
  title: { fontSize: 24, fontWeight: '700', color: '#1A3164', marginBottom: 22, textAlign: 'center' },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#888', marginBottom: 10, paddingLeft: 5 },
  item: {
    backgroundColor: '#EDF0F7',
    borderRadius: 13,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  itemText: { color: '#1A3164', fontSize: 15, fontWeight: '500' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EDF0F7',
    borderRadius: 13,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#1A3164',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  logoutText: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 1 },
});
