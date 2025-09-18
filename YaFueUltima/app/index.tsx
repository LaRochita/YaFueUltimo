import { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '../store/userStore';
import { gradients } from '../constants/colors';

export default function IndexScreen() {
  const router = useRouter();
  const user = useUserStore(state => state.user);
  const isLoading = useUserStore(state => state.isLoading);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (user) {
          router.replace('/(tabs)');
        } else {
          router.replace('/auth');
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, user]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradients.hero as any}
        style={styles.gradient}
      >
        <View style={styles.logoContainer}>
          <Image source={require('../assets/images/isologo.png')} style={styles.logo} />
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