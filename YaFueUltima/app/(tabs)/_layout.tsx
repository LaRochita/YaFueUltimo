import { Tabs } from 'expo-router';
import { Home, Calendar, Users, User } from 'lucide-react-native';
import { useAppColors } from '../../context/ThemeContext';
import { defaultColors } from '@/constants/defaultColors';

export default function TabLayout() {
  const { colors } = useAppColors();

  // Usar los colores del tema o los valores por defecto
  const activeColors = colors || defaultColors;
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColors.primary[500],
        tabBarInactiveTintColor: activeColors.text.secondary,
        tabBarStyle: {
          backgroundColor: activeColors.background.primary,
          borderTopWidth: 1,
          borderTopColor: activeColors.border.primary,
          paddingBottom: 8,
          paddingTop: 8,
          height: 68,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendario',
          tabBarIcon: ({ size, color }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Grupos',
          tabBarIcon: ({ size, color }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}