import { StyleProp, View, ViewStyle } from 'react-native';
import Svg, { Circle, Path, Pattern, Rect, Defs } from 'react-native-svg';
import { colors } from '@/theme';

// Ilustración de mapa (costa, calles y puntos). Es decoración: no muestra eventos reales
export function MapaDecorativo({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ overflow: 'hidden', backgroundColor: '#FBF1E4' }, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <Pattern id="puntos" width="16" height="16" patternUnits="userSpaceOnUse">
            <Circle cx="2" cy="2" r="1.2" fill="rgba(34,22,20,0.12)" />
          </Pattern>
        </Defs>
        <Rect width="400" height="300" fill="url(#puntos)" />
        <Path
          d="M40 -10 C 70 80, 10 160, 60 320"
          stroke={colors.menta}
          strokeWidth="28"
          fill="none"
          opacity={0.55}
        />
        <Path
          d="M40 -10 C 70 80, 10 160, 60 320"
          stroke={colors.menta}
          strokeWidth="2"
          fill="none"
        />
        <Path d="M120 40 L 400 10" stroke="rgba(105,74,71,0.18)" strokeWidth="10" />
        <Path d="M90 150 L 400 120" stroke="rgba(105,74,71,0.18)" strokeWidth="10" />
        <Path d="M110 250 L 400 230" stroke="rgba(105,74,71,0.14)" strokeWidth="8" />
        <Path d="M190 0 L 230 300" stroke="rgba(105,74,71,0.14)" strokeWidth="8" />
        <Path d="M310 0 L 340 300" stroke="rgba(105,74,71,0.14)" strokeWidth="8" />
        <Circle cx="215" cy="95" r="18" fill="rgba(150,193,197,0.35)" />
        <Circle
          cx="215"
          cy="95"
          r="9"
          fill={colors.primario}
          stroke={colors.blanco}
          strokeWidth="3"
        />
        <Circle
          cx="300"
          cy="175"
          r="8"
          fill={colors.menta}
          stroke={colors.texto}
          strokeWidth="1.5"
        />
        <Circle
          cx="160"
          cy="205"
          r="8"
          fill={colors.menta}
          stroke={colors.texto}
          strokeWidth="1.5"
        />
        <Circle
          cx="345"
          cy="70"
          r="6"
          fill={colors.menta}
          stroke={colors.texto}
          strokeWidth="1.5"
        />
      </Svg>
    </View>
  );
}
