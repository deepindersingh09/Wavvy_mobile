import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TermsOfUse() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A3164" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Use</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Welcome to Wavvy</Text>
        <Text style={styles.text}>
          By using our app, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
        </Text>

        <Text style={styles.sectionTitle}>User Responsibilities</Text>
        <Text style={styles.text}>
          You agree to use Wavvy only for lawful purposes and in a way that does not infringe the rights of others or restrict their use of the app.
        </Text>

        <Text style={styles.sectionTitle}>Privacy</Text>
        <Text style={styles.text}>
          Please review our Privacy Policy to understand how we collect, use, and protect your information.
        </Text>

        <Text style={styles.sectionTitle}>Intellectual Property</Text>
        <Text style={styles.text}>
          All content and features of Wavvy are the intellectual property of the developers and are protected by law.
        </Text>

        <Text style={styles.sectionTitle}>Changes to Terms</Text>
        <Text style={styles.text}>
          We reserve the right to modify these terms at any time. Your continued use of Wavvy constitutes acceptance of the updated terms.
        </Text>

        <Text style={styles.text}>
          If you have any questions, please contact us at <Text style={{ fontWeight: 'bold' }}>support@wavvy.com</Text>.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 18 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1A3164',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A3164',
  },
  text: {
    fontSize: 15,
    color: '#1A3164',
    marginBottom: 15,
    lineHeight: 22,
  },
});
