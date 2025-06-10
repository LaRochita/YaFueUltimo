import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    // Simulate checking auth state
    const timer = setTimeout(() => {
      // For demo purposes, redirect to auth
      // In real app, check if user is authenticated
      router.replace('/auth');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#EC4899']}
        style={styles.gradient}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <View style={styles.logoText}>
              <View style={styles.yaText} />
              <View style={styles.fueText} />
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    alignItems: 'center',
  },
  yaText: {
    width: 40,
    height: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
  },
  fueText: {
    width: 50,
    height: 15,
    backgroundColor: 'white',
    borderRadius: 8,
  },
});