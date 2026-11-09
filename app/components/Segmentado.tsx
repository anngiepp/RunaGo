import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, spacing, text } from '@/theme';

type Opcion<T extends string> = { valor: T; etiqueta: string };

type Props<T extends string> = {
  opciones: Opcion<T>[];
  valor: T;
  onCambiar: (valor: T) => void;
};

export function Segmentado<T extends string>({ opciones, valor, onCambiar }: Props<T>) {
  return (
    <View style={styles.contenedor} accessibilityRole="radiogroup">
      {opciones.map((opcion) => {
        const activa = opcion.valor === valor;
        return (
          <Pressable
            key={opcion.valor}
            onPress={() => onCambiar(opcion.valor)}
            accessibilityRole="radio"
            accessibilityState={{ checked: activa }}
            style={[styles.opcion, activa && styles.activa, activa && shadows.duraSm]}
          >
            <Text style={[text.boton, { color: activa ? colors.sobrePrimario : colors.texto }]}>
              {opcion.etiqueta}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.xs,
    borderRadius: radius.sm + spacing.xs,
    borderWidth: 1,
    borderColor: colors.borde,
    backgroundColor: colors.crema,
  },
  opcion: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borde,
    backgroundColor: colors.blanco,
  },
  activa: {
    backgroundColor: colors.primario,
    borderColor: colors.texto,
  },
});
