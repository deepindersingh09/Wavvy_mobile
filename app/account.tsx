import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
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
      <Text style={{ fontSize: 22, color: '#1A3164', fontWeight: 'bold', marginBottom: 18 }}>
        Edit Profile
      </Text>
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
    color: '#1A3164',
  },
  button: {
    backgroundColor: '#1A3164',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
