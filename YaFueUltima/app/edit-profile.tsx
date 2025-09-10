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
import { updateUser } from '../services/users';

export default function EditProfileScreen() {
  const router = useRouter();
  const user = useUserStore(state => state.user);
  const setUser = useUserStore(state => state.setUser);
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
      const response = await updateUser(user.id, {
        ...formData,
        email: user.email, // Mantenemos el email actual
        balance: user.balance, // Mantenemos el balance actual
      });
      
      // Actualizamos el store con los nuevos datos
      await setUser({
        email: response.email,
        password: '', // No necesitamos la contraseña aquí
        user: response.user || response, // Manejamos ambos casos de respuesta
      });
      
      router.back();
    } catch (error) {
      console.error('Error updating profile:', error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
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
          <TouchableOpacity style={styles.cameraButton}>
            <Camera size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre de usuario</Text>
            <View style={styles.inputWrapper}>
              <User size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={formData.username}
                onChangeText={(text) => setFormData({ ...formData, username: text })}
                placeholder="Nombre de usuario"
                placeholderTextColor="#9CA3AF"
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre</Text>
            <View style={styles.inputWrapper}>
              <User size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                placeholder="Nombre"
                placeholderTextColor="#9CA3AF"
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Apellido</Text>
            <View style={styles.inputWrapper}>
              <User size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                placeholder="Apellido"
                placeholderTextColor="#9CA3AF"
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Mostramos el email como información no editable */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.emailText}>{user?.email}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.disabledButton]}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          )}
        </TouchableOpacity>
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
    backgroundColor: 'white',
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
    color: '#1F2937',
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
    borderColor: 'white',
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
    borderColor: 'white',
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
    color: '#4B5563',
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
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
    color: '#1F2937',
  },
  emailText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
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
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  disabledButton: {
    opacity: 0.7,
  },
}); 