import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { iconoDeInteres } from '@/lib/iconos';
import { colors } from '@/theme';

type Props = {
  imagenUrl: string | null;
  categoria: string;
  style?: StyleProp<ViewStyle>;
};

// Si el evento no tiene imagen, muestra el ícono de su categoría en lugar de una foto inventada
export function PortadaEvento({ imagenUrl, categoria, style }: Props) {
  return (
    <View style={[styles.portada, style]}>
      {imagenUrl ? (
        <Image source={{ uri: imagenUrl }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      ) : (
        <Ionicons name={iconoDeInteres(categoria)} size={44} color={colors.primario} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  portada: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.crema,
  },
});
