import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useAppColors } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '../constants/colors';
import { defaultColors } from '../constants/defaultColors';

interface ThemedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradient?: boolean;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
  gradient = false,
}) => {
  const { colors: themeColors } = useAppColors();
  const colors = themeColors || defaultColors;

  const getButtonColors = () => {
    const textColors = colors.text || defaultColors.text;
    const primaryColor = colors.primary?.[500] || defaultColors.primary[500];
    const secondaryColor = colors.secondary?.[500] || defaultColors.secondary[500];
    const accentColor = colors.accent?.[500] || defaultColors.accent[500];

    switch (variant) {
      case 'primary':
        return {
          background: primaryColor,
          text: textColors.inverse,
          border: primaryColor,
        };
      case 'secondary':
        return {
          background: secondaryColor,
          text: textColors.inverse,
          border: secondaryColor,
        };
      case 'accent':
        return {
          background: accentColor,
          text: textColors.inverse,
          border: accentColor,
        };
      case 'outline':
        return {
          background: 'transparent',
          text: primaryColor,
          border: primaryColor,
        };
      default:
        return {
          background: primaryColor,
          text: textColors.inverse,
          border: primaryColor,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          fontSize: 14,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
          fontSize: 18,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 20,
          fontSize: 16,
        };
    }
  };

  const buttonColors = getButtonColors();
  const sizeStyles = getSizeStyles();

  const buttonStyle = [
    styles.button,
    {
      backgroundColor: disabled ? (colors.state?.disabled || '#E5E7EB') : buttonColors.background,
      borderColor: disabled ? (colors.state?.disabled || '#E5E7EB') : buttonColors.border,
      paddingVertical: sizeStyles.paddingVertical,
      paddingHorizontal: sizeStyles.paddingHorizontal,
    },
    style,
  ];

  const textStyleCombined = [
    styles.buttonText,
    {
      color: disabled ? (colors.text?.tertiary || colors.text?.secondary || defaultColors.text.secondary) : buttonColors.text,
      fontSize: sizeStyles.fontSize,
    },
    textStyle,
  ];

  if (gradient && variant === 'primary' && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[buttonStyle, { backgroundColor: 'transparent', borderWidth: 0 }]}
      >
        <LinearGradient
          colors={gradients.primary}
          style={[
            styles.gradientButton,
            {
              paddingVertical: sizeStyles.paddingVertical,
              paddingHorizontal: sizeStyles.paddingHorizontal,
            }
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={textStyleCombined}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={textStyleCombined}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientButton: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
});
