import QuickAction from '@/components/QuickAction';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function QuickActionsRow() {
  return (
    <ThemedView style={styles.section}>
      <ThemedText type="titleSmall">Quick Options</ThemedText>
      <ThemedView style={styles.row}>
        <QuickAction
          icon={require('@/assets/images/announcement-icon.png')}
          label="See Announcements"
          badgeCount={10}
          onPress={() => router.push('/announcements')}
        />

        <QuickAction
          icon={require('@/assets/images/appointment-icon.png')}
          label="Book Appointment"
          onPress={() => router.push('/book')}
        />

        <QuickAction
          icon={require('@/assets/images/track-icon.png')}
          label="Track Service Status"
          onPress={() => router.push('/track')}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    marginTop: -5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginHorizontal: 9,
    gap: 5,
  },
});
