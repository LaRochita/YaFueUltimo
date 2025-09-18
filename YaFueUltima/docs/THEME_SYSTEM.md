# Sistema de Colores y Temas - Ya Fue App

## Descripción

Este documento describe el sistema de colores centralizado implementado en la aplicación Ya Fue, basado en una paleta de colores cyan/turquesa y negro, con soporte completo para modo claro y oscuro.

## Paleta de Colores

### Colores Primarios

- **Cyan Principal**: `#0CE5DC` - Color principal de la marca
- **Turquesa**: `#0DD9C4` - Color secundario
- **Cyan Claro**: `#13C9F2` - Variante más clara
- **Cyan Muy Claro**: `#13DCF2` - Variante más clara aún

### Colores de Acento

- **Turquesa Verde**: `#0FF2C9` - Color de acento
- **Negro**: `#0D0D0D` - Color de contraste

## Estructura del Sistema

### Archivos Principales

- `constants/colors.ts` - Definición de colores y paleta
- `hooks/useTheme.ts` - Hook para manejo de temas
- `context/ThemeContext.tsx` - Contexto React para el tema
- `components/` - Componentes temáticos reutilizables

### Componentes Temáticos Disponibles

#### ThemedButton

```tsx
import { ThemedButton } from '../components'

;<ThemedButton
  title="Mi Botón"
  onPress={() => {}}
  variant="primary" // primary | secondary | accent | outline
  size="medium" // small | medium | large
  gradient={true} // Para gradientes
/>
```

#### ThemedCard

```tsx
import { ThemedCard } from '../components'

;<ThemedCard
  variant="elevated" // default | elevated | outlined
  padding="medium" // none | small | medium | large
>
  <Text>Contenido de la tarjeta</Text>
</ThemedCard>
```

#### ThemedText

```tsx
import { ThemedText } from '../components'

;<ThemedText
  variant="primary" // primary | secondary | tertiary | inverse | accent
  size="lg" // xs | sm | base | lg | xl | 2xl | 3xl
  weight="semiBold" // regular | medium | semiBold | bold
>
  Mi texto temático
</ThemedText>
```

#### ThemeToggle

```tsx
import { ThemeToggle } from '../components'

;<ThemeToggle />
```

## Uso Básico

### 1. Acceder a los Colores

```tsx
import { useAppColors } from '../context/ThemeContext'

const MyComponent = () => {
  const { colors, isDark } = useAppColors()

  return (
    <View style={{ backgroundColor: colors.background.primary }}>
      <Text style={{ color: colors.text.primary }}>Hola Mundo</Text>
    </View>
  )
}
```

### 2. Usar el Hook de Tema

```tsx
import { useThemeContext } from '../context/ThemeContext'

const SettingsScreen = () => {
  const { isDark, toggleTheme, setTheme, currentTheme } = useThemeContext()

  return (
    <View>
      <Text>Modo actual: {isDark ? 'Oscuro' : 'Claro'}</Text>
      <Button title="Alternar Tema" onPress={toggleTheme} />
    </View>
  )
}
```

## Gradientes

El sistema incluye gradientes predefinidos:

```tsx
import { gradients } from '../constants/colors'
import { LinearGradient } from 'expo-linear-gradient'

;<LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
  {/* Contenido */}
</LinearGradient>
```

Gradientes disponibles:

- `gradients.primary` - Cyan principal
- `gradients.secondary` - Cyan secundario
- `gradients.accent` - Turquesa
- `gradients.hero` - Gradiente principal completo
- `gradients.dark` - Gradiente oscuro

## Modo Oscuro vs Claro

### Automático

El sistema detecta automáticamente la preferencia del usuario a través de `Appearance.getColorScheme()`.

### Manual

Los usuarios pueden seleccionar manualmente entre:

- **Claro**: Siempre usa colores claros
- **Oscuro**: Siempre usa colores oscuros
- **Automático**: Sigue la configuración del sistema

## Migración de Componentes Existentes

### Antes (Hardcoded)

```tsx
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  text: {
    color: '#111827',
  },
})
```

### Después (Temático)

```tsx
import { useAppColors } from '../context/ThemeContext'

const MyComponent = () => {
  const { colors } = useAppColors()

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background.primary,
    },
    text: {
      color: colors.text.primary,
    },
  })

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Mi texto</Text>
    </View>
  )
}
```

## Mejores Prácticas

1. **Siempre usar el sistema de colores**: No hardcodear colores
2. **Usar componentes temáticos**: Preferir `ThemedButton` sobre `TouchableOpacity` + estilos
3. **Considerar accesibilidad**: Los colores tienen suficiente contraste
4. **Probar ambos modos**: Verificar que la app se vea bien en claro y oscuro
5. **Usar gradientes con moderación**: Para elementos destacados únicamente

## Configuración de Android

Los colores nativos de Android se han actualizado en:

- `android/app/src/main/res/values/colors.xml`
- `android/app/src/main/res/values/styles.xml`

## Futuras Mejoras

- [ ] Animaciones de transición entre temas
- [ ] Más variantes de gradientes
- [ ] Colores de estado (loading, error, success)
- [ ] Tema personalizable por usuario
- [ ] Colores de accesibilidad mejorados
