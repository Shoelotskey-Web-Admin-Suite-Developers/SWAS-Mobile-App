import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'header' | 'title' | 'titleLarge' | 'titleSmall' | 'subtitle1' | 'subtitle2' |'link' |'option' |'button' | 'button2';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'header' ? styles.header : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'titleLarge' ? styles.titleLarge : undefined,
        type === 'titleSmall' ? styles.titleSmall : undefined,
        type === 'subtitle1' ? styles.subtitle1 : undefined,
        type === 'subtitle2' ? styles.subtitle2 : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'option' ? styles.option : undefined,
        type === 'button' ? styles.button : undefined,
        type === 'button2' ? styles.button2 : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 18,
  },
  header: {
    fontFamily: 'InterExtraBold',
    fontSize: 32,
    lineHeight: 40,
    color: "#D11315",
  },
  title: {
    fontFamily: 'InterExtraBold',
    fontSize: 32,
    lineHeight: 40,
  },
  titleLarge: {
    fontFamily: 'InterExtraBold',
    fontSize: 48,
    lineHeight: 52,
  },
  titleSmall: {
    fontFamily: 'InterExtraBold',
    fontSize: 20,
    lineHeight: 25,
  },
  subtitle1: {
    fontFamily: 'InterBold',
    fontSize: 25,
  },
  subtitle2: {
    fontFamily: 'InterBold',
    fontSize: 25,
  },
  link: {
    fontFamily: 'Inter',
    fontSize: 16,
    lineHeight: 30,
    color: '#D11315',
  },
  option: {
    fontFamily: 'Inter',
    fontSize: 10,
    lineHeight: 13,
  },
  button: {
    fontFamily: 'InterExtraBold',
    fontSize: 17,
    lineHeight: 25,
  },
  button2: {
    fontFamily: 'Inter',
    fontSize: 17,
    lineHeight: 25,
  },
});
