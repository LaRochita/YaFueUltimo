import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { colors as lightColors, darkColors } from '../constants/colors';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
  colors: typeof lightColors;
}

// Valor inicial del contexto
const defaultContext: ThemeContextType = {
  theme: 'light',
  toggleTheme: () => {},
  isDark: false,
  colors: lightColors, // Aseguramos que siempre haya colores disponibles
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(defaultContext.theme);
  const [isDark, setIsDark] = useState(defaultContext.isDark);

  // Actualizar isDark cuando cambie el tema
  useEffect(() => {
    const newIsDark = theme === 'dark';
    setIsDark(newIsDark);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(current => {
      return current === 'light' ? 'dark' : 'light';
    });
  };

  const value = {
    theme,
    toggleTheme,
    isDark,
    colors: isDark ? darkColors : lightColors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useAppColors = () => {
  const { colors, isDark } = useTheme();
  return { colors, isDark };
};