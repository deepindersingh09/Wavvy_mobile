import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function EditProfile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('user_details')
          .select('first_name, last_name')
          .eq('uuid', user.id)
          .single();
        if (data) {
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
        }
      }
    };
    loadProfile();
  }, []);

  const saveProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('user_details')
        .update({ first_name: firstName, last_name: lastName })
        .eq('uuid', user.id);
      if (error) return Alert.alert('Error', error.message);
      Alert.alert('Profile updated!');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 24, backgroundColor: '#fff' }}>

       {/* Header with Back Button and Title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A3164" style={styles.backarrow}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>


      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={saveProfile}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  input: {
    backgroundColor: '#EDF0F7',
    borderRadius: 10,
    fontSize: 16,
    padding: 12,
    marginBottom: 15,
    marginHorizontal: 14,
    color: '#1A3164',
  },
  button: {
    backgroundColor: '#1A3164',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 14,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,

  },
   headerTitle: {
    fontSize: 22,
    color: '#1A3164',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  backarrow: {
    marginLeft: 12,
    color: '#1A3164',
  },
});
