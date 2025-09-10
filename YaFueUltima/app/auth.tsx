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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { createUser, loginUser, loginUserWithGoogle } from '../services/users';
import { useUserStore } from '../store/userStore';

export default function AuthScreen() {
  const router = useRouter();
  const setUser = useUserStore(state => state.setUser);
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
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#8B5CF6', '#EC4899']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Ya Fue 🎉</Text>
            <Text style={styles.subtitle}>
              {isLogin ? 'Bienvenido de vuelta' : 'Únete a la diversión'}
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tab, isLogin && styles.activeTab]}
                onPress={() => setIsLogin(true)}
              >
                <Text style={[styles.tabText, isLogin && styles.activeTabText]}>
                  Iniciar Sesión
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, !isLogin && styles.activeTab]}
                onPress={() => setIsLogin(false)}
              >
                <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>
                  Registrarse
                </Text>
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
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o continúa con email</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.inputContainer}>
              {!isLogin && (
                <>
                  <View style={styles.inputWrapper}>
                    <User size={20} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Nombre"
                      value={formData.firstName}
                      onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                      placeholderTextColor="#9CA3AF"
                      editable={!isLoading}
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <User size={20} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Apellido"
                      value={formData.lastName}
                      onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                      placeholderTextColor="#9CA3AF"
                      editable={!isLoading}
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <User size={20} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Apodo"
                      value={formData.username}
                      onChangeText={(text) => setFormData({ ...formData, username: text })}
                      placeholderTextColor="#9CA3AF"
                      editable={!isLoading}
                    />
                  </View>
                </>
              )}
              <View style={styles.inputWrapper}>
                <Mail size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#9CA3AF"
                  editable={!isLoading}
                />
              </View>
              <View style={styles.inputWrapper}>
                <Lock size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#9CA3AF"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#6B7280" />
                  ) : (
                    <Eye size={20} color="#6B7280" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, isLoading && styles.disabledButton]}
              onPress={handleEmailAuth}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                </Text>
              )}
            </TouchableOpacity>

            {isLogin && (
              <TouchableOpacity 
                style={styles.forgotPassword}
                disabled={isLoading}
              >
                <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    margin: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    fontSize: 14,
  },
  activeTabText: {
    color: '#1F2937',
  },
  socialContainer: {
    marginBottom: 24,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 8,
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
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
  },
  eyeIcon: {
    padding: 4,
  },
  primaryButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  forgotPassword: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#8B5CF6',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.7,
  },
});