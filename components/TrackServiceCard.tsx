import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

type Props = {
  branch: string;
  services: string;
  shoeModel: string;
  receiptId: string;
  trackNumber: string;
  customerId: string;
};

export default function TrackServiceCard({
  branch,
  services,
  shoeModel,
  receiptId,
  trackNumber,
  customerId,
}: Props) {
  const handlePress = () => {
    router.push({
      pathname: '/trackItem/trackItem',
      params: {
        receiptId,
        trackNumber,
        customerId,
      },
    });
  };

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      <View>
        <ThemedText type="subtitle1" style={styles.branch}>
          {branch}
        </ThemedText>
        <ThemedText type="default">{services}</ThemedText>
        <ThemedText type="titleSmall" style={styles.model}>
          {shoeModel}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  branch: {
    marginBottom: 2,
  },
  model: {
    marginTop: 2,
    fontWeight: 'bold',
  },
});
