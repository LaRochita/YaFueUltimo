/**
 * Sistema de colores centralizado para la aplicación Ya Fue
 * Basado en paleta cyan/turquesa y negro
 * Soporta modo claro y oscuro
 */

export const colors = {
  // Colores primarios - basados en la paleta cyan/turquesa
  primary: {
    // Cyan principal
    50: '#E6FFFA',   // Muy claro
    100: '#B2F5EA',  // Claro
    200: '#81E6D9',  // Medio claro
    300: '#4FD1C7',  // Medio
    400: '#38B2AC',  // Medio oscuro
    500: '#0CE5DC',  // Principal (de tu paleta)
    600: '#0DD9C4',  // Turquesa (de tu paleta)
    700: '#0A8B7F',  // Oscuro
    800: '#085F56',  // Muy oscuro
    900: '#064E47',  // Extremadamente oscuro
  },
  
  // Colores secundarios - cyan más claro
  secondary: {
    50: '#F0FDFF',   // Muy claro
    100: '#CCFBF1',  // Claro
    200: '#99F6E4',  // Medio claro
    300: '#5EEAD4',  // Medio
    400: '#2DD4BF',  // Medio oscuro
    500: '#13C9F2',  // Principal (de tu paleta)
    600: '#13DCF2',  // Claro (de tu paleta)
    700: '#0F766E',  // Oscuro
    800: '#115E59',  // Muy oscuro
    900: '#134E4A',  // Extremadamente oscuro
  },
  
  // Colores de acento - turquesa verde
  accent: {
    50: '#F0FDFA',   // Muy claro
    100: '#CCFBF1',  // Claro
    200: '#99F6E4',  // Medio claro
    300: '#5EEAD4',  // Medio
    400: '#2DD4BF',  // Medio oscuro
    500: '#0FF2C9',  // Principal (de tu paleta)
    600: '#0DD9C4',  // Turquesa (de tu paleta)
    700: '#0F766E',  // Oscuro
    800: '#115E59',  // Muy oscuro
    900: '#134E4A',  // Extremadamente oscuro
  },
  
  // Colores neutros - escala de grises
  neutral: {
    0: '#FFFFFF',    // Blanco puro
    50: '#F9FAFB',   // Gris muy claro
    100: '#F3F4F6',  // Gris claro
    200: '#E5E7EB',  // Gris medio claro
    300: '#D1D5DB',  // Gris medio
    400: '#9CA3AF',  // Gris
    500: '#6B7280',  // Gris medio oscuro
    600: '#4B5563',  // Gris oscuro
    700: '#374151',  // Gris muy oscuro
    800: '#1F2937',  // Gris extremadamente oscuro
    900: '#111827',  // Casi negro
    950: '#030712',  // Negro
  },
  
  // Colores semánticos
  semantic: {
    success: '#10B981',   // Verde
    warning: '#F59E0B',   // Amarillo
    error: '#EF4444',     // Rojo
    info: '#3B82F6',      // Azul
  },
  
  // Colores de fondo y superficie
  background: {
    primary: '#FFFFFF',     // Fondo principal (claro)
    secondary: '#F9FAFB',   // Fondo secundario (claro)
    tertiary: '#F3F4F6',    // Fondo terciario (claro)
    overlay: 'rgba(0, 0, 0, 0.5)', // Overlay
  },
  
  // Colores de texto
  text: {
    primary: '#111827',     // Texto principal (oscuro)
    secondary: '#6B7280',   // Texto secundario (gris)
    tertiary: '#9CA3AF',    // Texto terciario (gris claro)
    inverse: '#FFFFFF',     // Texto inverso (blanco)
    accent: '#0CE5DC',      // Texto acento (cyan)
  },
  
  // Colores de borde
  border: {
    primary: '#E5E7EB',     // Borde principal
    secondary: '#D1D5DB',   // Borde secundario
    accent: '#0CE5DC',      // Borde acento
  },
  
  // Colores de estado
  state: {
    hover: '#F3F4F6',       // Hover
    pressed: '#E5E7EB',     // Presionado
    disabled: '#9CA3AF',    // Deshabilitado
    focus: '#0CE5DC',       // Focus
  },
};

// Configuración para modo oscuro
export const darkColors = {
  // Colores primarios (se mantienen igual)
  primary: colors.primary,
  secondary: colors.secondary,
  accent: colors.accent,
  neutral: colors.neutral,
  semantic: colors.semantic,
  
  // Colores de fondo y superficie (invertidos)
  background: {
    primary: '#0D0D0D',       // Fondo principal (oscuro)
    secondary: '#1F2937',     // Fondo secundario (gris oscuro)
    tertiary: '#374151',      // Fondo terciario (gris)
    overlay: 'rgba(0, 0, 0, 0.7)', // Overlay más oscuro
  },
  
  // Colores de texto (invertidos)
  text: {
    primary: '#FFFFFF',       // Texto principal (blanco)
    secondary: '#D1D5DB',     // Texto secundario (gris claro)
    tertiary: '#9CA3AF',      // Texto terciario (gris)
    inverse: '#111827',       // Texto inverso (oscuro)
    accent: '#13C9F2',        // Texto acento (cyan más claro)
  },
  
  // Colores de borde (invertidos)
  border: {
    primary: '#374151',       // Borde principal
    secondary: '#4B5563',     // Borde secundario
    accent: '#13C9F2',        // Borde acento
  },
  
  // Colores de estado (invertidos)
  state: {
    hover: '#374151',         // Hover
    pressed: '#4B5563',       // Presionado
    disabled: '#6B7280',      // Deshabilitado
    focus: '#13C9F2',         // Focus
  },
};

// Hook para obtener colores según el tema
export const useColors = (isDark: boolean = false) => {
  return isDark ? darkColors : colors;
};

// Colores específicos para gradientes (basados en tu paleta)
export const gradients = {
  primary: ['#0CE5DC', '#13C9F2'],           // Cyan a cyan claro
  secondary: ['#13C9F2', '#13DCF2'],         // Cyan claro a cyan muy claro
  accent: ['#0DD9C4', '#0FF2C9'],            // Turquesa a turquesa claro
  hero: ['#0CE5DC', '#13C9F2', '#0DD9C4'],   // Gradiente principal
  dark: ['#0D0D0D', '#1F2937', '#374151'],   // Gradiente oscuro
};

// Colores para componentes específicos
export const componentColors = {
  button: {
    primary: colors.primary[500],
    secondary: colors.secondary[500],
    accent: colors.accent[500],
    disabled: colors.neutral[300],
  },
  card: {
    background: colors.background.primary,
    border: colors.border.primary,
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  tab: {
    active: colors.primary[500],
    inactive: colors.neutral[400],
    background: colors.background.primary,
  },
  header: {
    background: colors.primary[500],
    text: colors.text.inverse,
  },
};

export default colors;
