import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { fechaCorta, precioReferencial } from '@/lib/formato';
import { colors, fonts, radius, shadows, spacing, text } from '@/theme';
import type { Evento } from '@/types';
import { Insignia } from './Insignia';
import { PortadaEvento } from './PortadaEvento';

type Props = {
  evento: Evento;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function TarjetaEvento({ evento, onPress, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Ver ${evento.titulo}`}
      style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada, style]}
    >
      <View>
        <PortadaEvento
          imagenUrl={evento.imagenUrl}
          categoria={evento.categoria.nombre}
          style={styles.portada}
        />
        <View style={styles.insignia}>
          <Insignia texto={evento.categoria.nombre} />
        </View>
      </View>
      <View style={styles.contenido}>
        <Text style={styles.titulo} numberOfLines={2}>
          {evento.titulo}
        </Text>
        <View style={styles.fila}>
          <Ionicons name="calendar-outline" size={14} color={colors.textoSuave} />
          <Text style={text.cuerpoSm}>{fechaCorta(evento.fechaInicio)}</Text>
          <Text style={text.cuerpoSm}>·</Text>
          <Ionicons name="location-outline" size={14} color={colors.textoSuave} />
          <Text style={text.cuerpoSm}>{evento.lugar.distrito}</Text>
        </View>
        <Text style={styles.precio}>
          Precio referencial: {precioReferencial(evento.precioReferencia)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borde,
    backgroundColor: colors.blanco,
    overflow: 'hidden',
    ...shadows.suave,
  },
  presionada: {
    opacity: 0.85,
  },
  portada: {
    height: 140,
  },
  insignia: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  contenido: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  titulo: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 21,
    color: colors.texto,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  precio: {
    ...text.cuerpoSm,
    color: colors.textoMedio,
  },
});
