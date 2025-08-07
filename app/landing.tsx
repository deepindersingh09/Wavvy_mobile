import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function Landing() {
  const router = useRouter();
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 8000 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <Animated.Image
          source={require('../assets/images/wavvy-logo.png')}
          style={[styles.logo, animatedStyle]}
        />
        <Text style={styles.title}>Wavvy</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, { marginRight: 10 }]}
          onPress={() => router.push('/auth/login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/auth/signup')}
        >
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const BUTTON_WIDTH = (width * 0.9 - 10) / 2; // Two buttons side by side with 10px gap

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 50,
  },
  centerContent: {
    alignItems: 'center',
    marginTop: '40%',
  },
  logo: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    marginTop: 130,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A3164',
    fontFamily: 'System',
    marginTop: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#1A3164',
    paddingVertical: 14,
    borderRadius: 30,
    width: BUTTON_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
