// TEMPORAL: vitrina para revisar el sistema de diseño. Borrar antes de producción.
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, Chip, Input, Screen } from '@/components';
import { colors, fonts, radius, spacing, text } from '@/theme';

const muestrasColor = [
  ['primario', colors.primario],
  ['menta', colors.menta],
  ['crema', colors.crema],
  ['texto', colors.texto],
  ['blanco', colors.blanco],
  ['fondo', colors.fondo],
  ['error', colors.error],
  ['exito', colors.exito],
] as const;

const categorias = ['Rock', 'Indie', 'Jazz', 'Arte urbano', 'Gastronomía'];

export default function ComponentesScreen() {
  const [seleccionadas, setSeleccionadas] = useState<string[]>(['Indie']);
  const [correo, setCorreo] = useState('');

  function alternar(categoria: string) {
    setSeleccionadas((actuales) =>
      actuales.includes(categoria)
        ? actuales.filter((c) => c !== categoria)
        : [...actuales, categoria],
    );
  }

  return (
    <Screen bordes={['bottom']}>
      <View style={styles.aviso}>
        <Text style={[text.etiqueta, { color: colors.error }]}>Pantalla temporal</Text>
        <Text style={text.cuerpoSm}>
          Solo sirve para revisar el diseño. Se borrará más adelante.
        </Text>
      </View>

      <Text style={text.etiqueta}>Tipografías</Text>
      <Text style={text.tituloXl}>
        Crea tu cuenta <Text style={{ fontFamily: fonts.tituloCursiva }}>gratis</Text>
      </Text>
      <Text style={text.tituloLg}>Título grande · Playfair</Text>
      <Text style={text.tituloMd}>Título mediano · Playfair</Text>
      <Text style={text.subtitulo}>Subtítulo · Manrope Bold</Text>
      <Text style={text.cuerpoLg}>Cuerpo grande · Manrope Regular</Text>
      <Text style={text.cuerpo}>Cuerpo · Guarda planes y conecta con la movida independiente.</Text>
      <Text style={text.cuerpoSm}>Texto pequeño · fechas, horarios y notas</Text>

      <Text style={text.etiqueta}>Colores</Text>
      <View style={styles.fila}>
        {muestrasColor.map(([nombre, valor]) => (
          <View key={nombre} style={styles.muestra}>
            <View style={[styles.color, { backgroundColor: valor }]} />
            <Text style={text.cuerpoSm}>{nombre}</Text>
          </View>
        ))}
      </View>

      <Text style={text.etiqueta}>Botones</Text>
      <Button titulo="Crear cuenta y explorar" />
      <Button titulo="Soy organizador" variante="secundario" />
      <Button titulo="Ver todos los eventos" variante="texto" />
      <Button titulo="Cargando" cargando />
      <Button titulo="Deshabilitado" deshabilitado />

      <Text style={text.etiqueta}>Inputs</Text>
      <Input
        etiqueta="Correo electrónico"
        placeholder="tu_nombre@correo.pe"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        etiqueta="Contraseña"
        placeholder="Mínimo 8 caracteres"
        contrasena
        error="La contraseña debe tener al menos 8 caracteres"
      />

      <Text style={text.etiqueta}>Chips</Text>
      <View style={styles.fila}>
        {categorias.map((categoria) => (
          <Chip
            key={categoria}
            etiqueta={categoria}
            seleccionado={seleccionadas.includes(categoria)}
            onPress={() => alternar(categoria)}
          />
        ))}
      </View>

      <Text style={text.etiqueta}>Cards</Text>
      <Card>
        <Text style={text.etiqueta}>Feria · Barranco</Text>
        <Text style={text.tituloMd}>Card normal</Text>
        <Text style={text.cuerpoSm}>Borde fino y fondo blanco.</Text>
      </Card>
      <Card destacada>
        <Text style={text.tituloMd}>Card destacada</Text>
        <Text style={text.cuerpoSm}>Con borde oscuro y sombra dura.</Text>
      </Card>
      <Card fondo="crema">
        <Text style={text.tituloMd}>Card crema</Text>
        <Text style={text.cuerpoSm}>Para paneles internos y destacados suaves.</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  aviso: {
    padding: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.error,
    backgroundColor: colors.errorFondo,
    gap: spacing.xs,
  },
  fila: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  muestra: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  color: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borde,
  },
});
