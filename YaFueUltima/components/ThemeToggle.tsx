import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { useAppColors, useTheme } from '../context/ThemeContext';
import { ThemedText } from './ThemedText';

interface ThemeToggleProps {
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const ThemeToggle = ({ showLabel = false, size = 'medium' }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  const { colors } = useAppColors();
  
  // Protección contra colores undefined
  if (!colors || !colors.background || !colors.text) {
    return null;
  }

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  const getContainerSize = () => {
    switch (size) {
      case 'small':
        return {
          width: 32,
          height: 32,
          borderRadius: 16,
        };
      case 'large':
        return {
          width: 48,
          height: 48,
          borderRadius: 24,
        };
      default:
        return {
          width: 40,
          height: 40,
          borderRadius: 20,
        };
    }
  };

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[
        styles.container,
        getContainerSize(),
        { backgroundColor: colors.background.secondary }
      ]}
    >
      {theme === 'dark' ? (
        <Moon size={getIconSize()} color={colors.text.primary} />
      ) : (
        <Sun size={getIconSize()} color={colors.text.primary} />
      )}
      {showLabel && (
        <ThemedText
          variant="primary"
          size="sm"
          style={styles.label}
        >
          {theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    padding: 8,
  },
  label: {
    marginLeft: 4,
  },
});