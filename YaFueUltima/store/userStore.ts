import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface UserData {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  email: string;
  password: string;
  user: UserData;
}

interface UserState {
  user: UserData | null;
  setUser: (response: AuthResponse | null) => void;
  updateUser: (userData: UserData) => void;
  isLoading: boolean;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
}

const USER_STORAGE_KEY = 'ya_fue_user_data';

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: true,
  setUser: async (response) => {
    try {
      if (response?.user) {
        console.log('Guardando usuario en SecureStore:', response.user);
        await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(response.user));
        set({ user: response.user });
      } else {
        console.log('Eliminando usuario de SecureStore');
        await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
        set({ user: null });
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      set({ user: null });
    }
  },
  updateUser: async (userData) => {
    try {
      console.log('Actualizando usuario:', userData);
      await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(userData));
      set({ user: userData });
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  },
  initialize: async () => {
    try {
      console.log('Inicializando store, buscando usuario guardado...');
      const storedUser = await SecureStore.getItemAsync(USER_STORAGE_KEY);
      console.log('Datos encontrados en SecureStore:', storedUser);
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log('Usuario parseado:', userData);
        set({ user: userData, isLoading: false });
      } else {
        console.log('No se encontró usuario guardado');
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error initializing user store:', error);
      set({ isLoading: false, user: null });
    }
  },
  logout: async () => {
    try {
      console.log('Cerrando sesión, eliminando datos...');
      await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
      set({ user: null });
    } catch (error) {
      console.error('Error during logout:', error);
      set({ user: null });
    }
  },
})); 