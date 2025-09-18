import React from 'react';
import { Text, TextStyle } from 'react-native';
import { useAppColors } from '../context/ThemeContext';
import { defaultColors } from '../constants/defaultColors';

interface ThemedTextProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'accent';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold';
  style?: TextStyle;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  children,
  variant = 'primary',
  size = 'base',
  weight = 'regular',
  style,
}) => {
  const { colors: themeColors } = useAppColors();
  const colors = themeColors || defaultColors;

  const getTextColor = () => {
    const textColors = colors.text || defaultColors.text;
    switch (variant) {
      case 'primary':
        return textColors.primary;
      case 'secondary':
        return textColors.secondary;
      case 'tertiary':
        return textColors.tertiary || textColors.secondary;
      case 'inverse':
        return textColors.inverse;
      case 'accent':
        return colors.accent?.[500] || defaultColors.accent[500];
      default:
        return textColors.primary;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'xs':
        return 12;
      case 'sm':
        return 14;
      case 'lg':
        return 18;
      case 'xl':
        return 20;
      case '2xl':
        return 24;
      case '3xl':
        return 30;
      default:
        return 16;
    }
  };

  const getFontWeight = () => {
    switch (weight) {
      case 'medium':
        return 'Inter-Medium';
      case 'semiBold':
        return 'Inter-SemiBold';
      case 'bold':
        return 'Inter-Bold';
      default:
        return 'Inter-Regular';
    }
  };

  const textStyle: TextStyle = {
    color: getTextColor(),
    fontSize: getFontSize(),
    fontFamily: getFontWeight(),
    ...style,
  };

  return <Text style={textStyle}>{children}</Text>;
};
