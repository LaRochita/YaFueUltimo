import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Camera } from 'lucide-react-native';
import { useUserStore } from '../store/userStore';
import { updateUser as updateUserService } from '../services/users';
import { useAppColors } from '../context/ThemeContext';
import { ThemedButton, ThemedCard, ThemedText } from '../components';

export default function EditProfileScreen() {
  const router = useRouter();
  const user = useUserStore(state => state.user);
  const updateUser = useUserStore(state => state.updateUser);
  const { colors } = useAppColors();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    image: user?.image || null,
  });

  const handleSave = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const response = await updateUserService(user.id, {
        ...formData,
        email: user.email, // Mantenemos el email actual
        balance: user.balance, // Mantenemos el balance actual
      });
      
      // Actualizamos el store con los nuevos datos
      const updatedUserData = response.user || response;
      await updateUser(updatedUserData);
      
      router.back();
    } catch (error) {
      console.error('Error updating profile:', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.header, { 
        backgroundColor: colors.background.primary,
        borderBottomColor: colors.border.primary 
      }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <ThemedText variant="primary" size="xl" weight="bold" style={styles.headerTitle}>
          Editar Perfil
        </ThemedText>
        <View style={{ width: 40 }} /> {/* Espaciador para centrar el título */}
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: formData.image || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'
            }}
            style={styles.avatar}
          />
          <TouchableOpacity style={[styles.cameraButton, { backgroundColor: colors.primary[500] }]}>
            <Camera size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <ThemedText variant="primary" size="base" weight="medium" style={styles.label}>
              Nombre de usuario
            </ThemedText>
            <View style={styles.inputWrapper}>
              <User size={20} color={colors.text.secondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background.secondary,
                  borderColor: colors.border.primary,
                  color: colors.text.primary
                }]}
                value={formData.username}
                onChangeText={(text) => setFormData({ ...formData, username: text })}
                placeholder="Nombre de usuario"
                placeholderTextColor={colors.text.secondary}
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <ThemedText variant="primary" size="base" weight="medium" style={styles.label}>
              Nombre
            </ThemedText>
            <View style={styles.inputWrapper}>
              <User size={20} color={colors.text.secondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background.secondary,
                  borderColor: colors.border.primary,
                  color: colors.text.primary
                }]}
                value={formData.firstName}
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                placeholder="Nombre"
                placeholderTextColor={colors.text.secondary}
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <ThemedText variant="primary" size="base" weight="medium" style={styles.label}>
              Apellido
            </ThemedText>
            <View style={styles.inputWrapper}>
              <User size={20} color={colors.text.secondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background.secondary,
                  borderColor: colors.border.primary,
                  color: colors.text.primary
                }]}
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                placeholder="Apellido"
                placeholderTextColor={colors.text.secondary}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Mostramos el email como información no editable */}
          <View style={styles.inputContainer}>
            <ThemedText variant="primary" size="base" weight="medium" style={styles.label}>
              Email
            </ThemedText>
            <ThemedText variant="secondary" size="base" style={styles.emailText}>
              {user?.email}
            </ThemedText>
          </View>
        </View>

        {isLoading ? (
          <View style={[styles.saveButton, styles.disabledButton]}>
            <ActivityIndicator color={colors.text.inverse} />
          </View>
        ) : (
          <ThemedButton
            title="Guardar Cambios"
            onPress={handleSave}
            variant="primary"
            size="large"
            style={styles.saveButton}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#8B5CF6',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  emailText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    paddingHorizontal: 4,
  },
  saveButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  disabledButton: {
    opacity: 0.7,
  },
}); 