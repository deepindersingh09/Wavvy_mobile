import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PrivacyPolicy() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#1A3164" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy Policy</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.sectionTitle}>Our Commitment to Privacy</Text>
                <Text style={styles.text}>
                    We respect your privacy. Your data is secure and will not be shared with third parties without your consent...
                </Text>
                <Text style={styles.text}>
                    For more detailed information, please contact us at 
                    <Text style={{ fontWeight: 'bold' }}> support@wavvy.com</Text>.
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
        color: '#1A3164'
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        justifyContent: 'space-between'
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
        lineHeight: 22
    }
});
