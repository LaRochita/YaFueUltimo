import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useAppColors } from '../context/ThemeContext';
import { defaultColors } from '../constants/defaultColors';

interface ThemedCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const ThemedCard: React.FC<ThemedCardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  style,
}) => {
  const { colors: themeColors } = useAppColors();
  const colors = themeColors || defaultColors;

  const getPaddingSize = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'small':
        return 12;
      case 'large':
        return 24;
      default:
        return 16;
    }
  };

  const getVariantStyles = () => {
    const backgrounds = colors.background || defaultColors.background;
    const borders = colors.border || defaultColors.border;

    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: backgrounds.primary,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 6,
          borderWidth: 0,
        };
      case 'outlined':
        return {
          backgroundColor: backgrounds.primary,
          borderWidth: 1,
          borderColor: borders.primary,
          shadowColor: 'transparent',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
        };
      default:
        return {
          backgroundColor: backgrounds.secondary,
          borderWidth: 1,
          borderColor: borders.primary,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 3,
        };
    }
  };

  const cardStyle = [
    styles.card,
    {
      ...getVariantStyles(),
      padding: getPaddingSize(),
    },
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
  },
});
