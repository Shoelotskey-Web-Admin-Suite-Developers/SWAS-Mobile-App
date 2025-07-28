import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';

type Props = {
  icon: any;
  label: string;
  badgeCount?: number;
  onPress?: () => void;
};

export default function QuickAction({ icon, label, badgeCount, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.iconWrapper}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
        {badgeCount ? (
          <View style={styles.badge}>
            <ThemedText type="option" style={styles.badgeText}>
              {badgeCount}
            </ThemedText>
          </View>
        ) : null}
      </View>
      <ThemedText type="option" style={styles.label}>
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 95,
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: -25,
    top: -29,
  },
  icon: {
    width: 58,
    height: 58,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: -20,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D11315',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  label: {
    textAlign: 'center',
    color: '#00000ff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
