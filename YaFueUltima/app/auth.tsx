import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { createUser, loginUser, loginUserWithGoogle } from '../services/users';
import { useUserStore } from '../store/userStore';
import { useAppColors } from '../context/ThemeContext';
import { ThemedButton, ThemedCard, ThemedText } from '../components';
import { gradients } from '../constants/colors';

export default function AuthScreen() {
  const router = useRouter();
  const setUser = useUserStore(state => state.setUser);
  const { colors } = useAppColors();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    username: '',
  });

  const handleSocialAuth = async (provider: string) => {
    if (provider === 'Google') {
      try {
        setIsSocialLoading(true);
        // Here you would normally get the email from Google OAuth
        const email = formData.email; // This is just for testing
        const response = await loginUserWithGoogle(email);
        await setUser(response);
        router.replace('/(tabs)');
      } catch (error) {
        console.error('Google auth failed:', error);
      } finally {
        setIsSocialLoading(false);
      }
    }
  };

  const handleEmailAuth = async () => {
    try {
      setIsLoading(true);
      if (isLogin) {
        const response = await loginUser(formData.email, formData.password);
        await setUser(response);
      } else {
        const userData = {
          ...formData,
          image: null, // Changed from empty string to null to match backend
          balance: 0, // Default balance for new users
        };
        const response = await createUser(userData);
        await setUser(response);
      }
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Authentication failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const socialProviders = [
    { name: 'Google', color: '#DB4437', icon: '🔍' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <LinearGradient colors={gradients.hero as any} style={styles.gradient}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Image source={require('../assets/images/isologo.png')} style={styles.logo} />
            <ThemedText variant="inverse" size="2xl" weight="bold" style={styles.title}>
              Ya Fue
            </ThemedText>
            <ThemedText variant="inverse" size="base" style={styles.subtitle}>
              {isLogin ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta nueva'}
            </ThemedText>
          </View>

          <ThemedCard variant="elevated" padding="medium" style={styles.formContainer}>
            <View style={[styles.tabsContainer, { backgroundColor: colors.background.tertiary }]}>
              <TouchableOpacity
                style={[styles.tab, isLogin && [styles.activeTab, { backgroundColor: colors.background.primary }]]}
                onPress={() => setIsLogin(true)}
              >
                <ThemedText 
                  variant={isLogin ? 'primary' : 'secondary'} 
                  weight={isLogin ? 'medium' : 'regular'}
                  size="sm"
                >
                  Iniciar Sesión
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, !isLogin && [styles.activeTab, { backgroundColor: colors.background.primary }]]}
                onPress={() => setIsLogin(false)}
              >
                <ThemedText 
                  variant={!isLogin ? 'primary' : 'secondary'} 
                  weight={!isLogin ? 'medium' : 'regular'}
                  size="sm"
                >
                  Registrarse
                </ThemedText>
              </TouchableOpacity>
            </View>

            <View style={styles.socialContainer}>
              {socialProviders.map((provider) => (
                <TouchableOpacity
                  key={provider.name}
                  style={[
                    styles.socialButton,
                    { backgroundColor: provider.color },
                    isSocialLoading && styles.disabledButton
                  ]}
                  onPress={() => handleSocialAuth(provider.name)}
                  disabled={isSocialLoading}
                >
                  {isSocialLoading ? (
                    <ActivityIndicator color="white" style={styles.socialIcon} />
                  ) : (
                    <Text style={styles.socialIcon}>{provider.icon}</Text>
                  )}
                  <Text style={styles.socialText}>{provider.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border.primary }]} />
              <ThemedText variant="secondary" size="sm" style={styles.dividerText}>
                o continúa con email
              </ThemedText>
              <View style={[styles.dividerLine, { backgroundColor: colors.border.primary }]} />
            </View>

            <View style={styles.inputContainer}>
              {!isLogin && (
                <>
                  <View style={[styles.inputWrapper, { 
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.border.primary 
                  }]}>
                    <User size={20} color={colors.text.secondary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: colors.text.primary }]}
                      placeholder="Nombre"
                      value={formData.firstName}
                      onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                      placeholderTextColor={colors.text.tertiary}
                      editable={!isLoading}
                    />
                  </View>
                  <View style={[styles.inputWrapper, { 
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.border.primary 
                  }]}>
                    <User size={20} color={colors.text.secondary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: colors.text.primary }]}
                      placeholder="Apellido"
                      value={formData.lastName}
                      onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                      placeholderTextColor={colors.text.tertiary}
                      editable={!isLoading}
                    />
                  </View>
                  <View style={[styles.inputWrapper, { 
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.border.primary 
                  }]}>
                    <User size={20} color={colors.text.secondary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: colors.text.primary }]}
                      placeholder="Apodo"
                      value={formData.username}
                      onChangeText={(text) => setFormData({ ...formData, username: text })}
                      placeholderTextColor={colors.text.tertiary}
                      editable={!isLoading}
                    />
                  </View>
                </>
              )}
              <View style={[styles.inputWrapper, { 
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary 
              }]}>
                <Mail size={20} color={colors.text.secondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text.primary }]}
                  placeholder="Email"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={colors.text.tertiary}
                  editable={!isLoading}
                />
              </View>
              <View style={[styles.inputWrapper, { 
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary 
              }]}>
                <Lock size={20} color={colors.text.secondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text.primary }]}
                  placeholder="Contraseña"
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  secureTextEntry={!showPassword}
                  placeholderTextColor={colors.text.tertiary}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={colors.text.secondary} />
                  ) : (
                    <Eye size={20} color={colors.text.secondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <ThemedButton
              title={isLogin ? 'Iniciar Sesión' : 'Registrarse'}
              onPress={handleEmailAuth}
              variant="primary"
              size="medium"
              gradient={true}
              disabled={isLoading}
              style={styles.primaryButton}
            />

            {isLogin && (
              <TouchableOpacity 
                style={styles.forgotPassword}
                disabled={isLoading}
              >
                <ThemedText variant="accent" size="sm" weight="medium">
                  ¿Olvidaste tu contraseña?
                </ThemedText>
              </TouchableOpacity>
            )}
          </ThemedCard>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.9,
    textAlign: 'center',
  },
  formContainer: {
    marginHorizontal: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  socialContainer: {
    marginBottom: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 6,
  },
  socialIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  socialText: {
    color: 'white',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 4,
  },
  primaryButton: {
    marginBottom: 12,
  },
  forgotPassword: {
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
});