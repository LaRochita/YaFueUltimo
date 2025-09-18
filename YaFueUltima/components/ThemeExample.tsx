import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppColors } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '../constants/colors';

/**
 * Componente de ejemplo que demuestra cómo usar el nuevo sistema de colores
 * con soporte para modo claro y oscuro
 */
export const ThemeExample: React.FC = () => {
  const { colors, isDark } = useAppColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Header con gradiente */}
      <LinearGradient
        colors={gradients.primary}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={[styles.headerTitle, { color: colors.text.inverse }]}>
          Ya Fue App
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.text.inverse }]}>
          Modo {isDark ? 'Oscuro' : 'Claro'}
        </Text>
      </LinearGradient>

      {/* Tarjeta principal */}
      <View style={[styles.card, { 
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary 
      }]}>
        <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
          Sistema de Colores
        </Text>
        <Text style={[styles.cardDescription, { color: colors.text.secondary }]}>
          Paleta basada en cyan/turquesa y negro con soporte completo para modo claro y oscuro.
        </Text>
        
        {/* Botones de ejemplo */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: colors.primary[500] }]}
          >
            <Text style={[styles.buttonText, { color: colors.text.inverse }]}>
              Botón Primario
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.secondaryButton, { 
              backgroundColor: colors.background.primary,
              borderColor: colors.primary[500],
              borderWidth: 1
            }]}
          >
            <Text style={[styles.buttonText, { color: colors.primary[500] }]}>
              Botón Secundario
            </Text>
          </TouchableOpacity>
        </View>

        {/* Muestra de colores */}
        <View style={styles.colorPalette}>
          <Text style={[styles.paletteTitle, { color: colors.text.primary }]}>
            Paleta de Colores:
          </Text>
          
          <View style={styles.colorRow}>
            <View style={[styles.colorSwatch, { backgroundColor: colors.primary[500] }]} />
            <Text style={[styles.colorName, { color: colors.text.secondary }]}>
              Primario: {colors.primary[500]}
            </Text>
          </View>
          
          <View style={styles.colorRow}>
            <View style={[styles.colorSwatch, { backgroundColor: colors.secondary[500] }]} />
            <Text style={[styles.colorName, { color: colors.text.secondary }]}>
              Secundario: {colors.secondary[500]}
            </Text>
          </View>
          
          <View style={styles.colorRow}>
            <View style={[styles.colorSwatch, { backgroundColor: colors.accent[500] }]} />
            <Text style={[styles.colorName, { color: colors.text.secondary }]}>
              Acento: {colors.accent[500]}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    opacity: 0.9,
  },
  card: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  colorPalette: {
    gap: 12,
  },
  paletteTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  colorName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});
