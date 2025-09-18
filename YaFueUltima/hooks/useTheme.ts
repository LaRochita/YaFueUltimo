import { useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { useColors, darkColors, colors } from '../constants/colors';

export interface ThemeConfig {
  isDark: boolean;
  colors: typeof colors;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  currentTheme: 'light' | 'dark' | 'auto';
}

export const useTheme = (): ThemeConfig => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [systemTheme, setSystemTheme] = useState<ColorSchemeName>(Appearance.getColorScheme());
  
  // Detectar cambios en el tema del sistema
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  // Determinar si el tema actual es oscuro
  const isDark = currentTheme === 'dark' || 
                 (currentTheme === 'auto' && systemTheme === 'dark');

  // Obtener colores según el tema
  const themeColors = isDark ? darkColors : colors;

  // Función para alternar entre claro y oscuro
  const toggleTheme = () => {
    setCurrentTheme(isDark ? 'light' : 'dark');
  };

  // Función para establecer un tema específico
  const setTheme = (theme: 'light' | 'dark' | 'auto') => {
    setCurrentTheme(theme);
  };

  return {
    isDark,
    colors: themeColors,
    toggleTheme,
    setTheme,
    currentTheme,
  };
};

// Hook simplificado que solo devuelve los colores
export const useColorsTheme = () => {
  const { isDark, colors } = useTheme();
  return { isDark, colors };
};
