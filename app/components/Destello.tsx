import { StyleProp, Text, TextStyle } from 'react-native';
import { colors } from '@/theme';

// Estrella decorativa ✦ de los diseños
export function Destello({
  tamano = 18,
  style,
}: {
  tamano?: number;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <Text
      style={[{ fontSize: tamano, lineHeight: tamano * 1.1, color: colors.menta }, style]}
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      ✦
    </Text>
  );
}
