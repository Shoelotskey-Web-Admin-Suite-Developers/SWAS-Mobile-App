import { Image, StyleSheet, View } from 'react-native';

export default function HeroLogo() {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/SWAS-Mobile-Logo-Black.png')}
        style={styles.logo}
      />
      <Image
        source={require('@/assets/images/border.png')}
        style={styles.border}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    alignItems: 'center',
    position: 'relative',
  },
  logo: {
    width: 240,
    height: 160,
    resizeMode: 'contain',
    marginBottom: 10,
    marginTop: -30,
  },
  border: {
    width: '100%',
    height: 20,
    resizeMode: 'stretch',
    position: 'absolute',
    bottom: 0,
  },
});
