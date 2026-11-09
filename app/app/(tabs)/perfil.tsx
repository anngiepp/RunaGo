import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Card, Chip, Screen } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { nombreRol } from '@/lib/formato';
import { spacing, text } from '@/theme';

export default function PerfilScreen() {
  const { usuario, cerrarSesion } = useAuth();
  if (!usuario) return null;

  return (
    <Screen>
      <Text style={text.tituloLg}>Perfil</Text>

      <Card>
        <Text style={text.etiqueta}>Nombre</Text>
        <Text style={text.cuerpoLg}>{usuario.nombre}</Text>
        <Text style={text.etiqueta}>Correo</Text>
        <Text style={text.cuerpoLg}>{usuario.correo}</Text>
        <Text style={text.etiqueta}>Rol</Text>
        <Text style={text.cuerpoLg}>{nombreRol(usuario.rol)}</Text>
      </Card>

      {usuario.intereses.length > 0 ? (
        <Card>
          <Text style={text.etiqueta}>Tus intereses</Text>
          <View style={styles.chips}>
            {usuario.intereses.map((interes) => (
              <Chip key={interes.id} etiqueta={interes.nombre} seleccionado />
            ))}
          </View>
        </Card>
      ) : null}

      <Button titulo="Cerrar sesión" variante="secundario" onPress={cerrarSesion} />

      {/* TEMPORAL: acceso a la vitrina de componentes. Quitar antes de producción */}
      <Card fondo="crema">
        <Text style={text.etiqueta}>Solo para desarrollo</Text>
        <Text style={text.cuerpoSm}>Revisa cómo se ven los componentes y las tipografías.</Text>
        <Button
          titulo="Ver componentes (temporal)"
          variante="texto"
          onPress={() => router.push('/componentes')}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
