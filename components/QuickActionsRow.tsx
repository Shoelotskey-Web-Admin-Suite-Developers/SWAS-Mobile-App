import QuickAction from '@/components/QuickAction';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { usePromos } from '@/hooks/usePromos';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

type Props = {
  onAnnouncementsPress: () => void;
  onPromosPress?: () => void;
};

export default function QuickActionsRow({ onAnnouncementsPress, onPromosPress }: Props) {
  const { unreadCount } = useAnnouncements();
  const { unreadCount: promosUnread } = usePromos();

  return (
    <ThemedView style={styles.section}>
      <ThemedText type="titleSmall" style={styles.title}>Quick Options</ThemedText>
      <ThemedView style={styles.row}>
        <QuickAction
          icon={require('@/assets/images/announcement-icon.png')}
          label={`See\nAnnouncements`}
          badgeCount={unreadCount}
          onPress={onAnnouncementsPress}
        />

        <QuickAction
          icon={require('@/assets/images/appointment-icon.png')}
          label={`View\nPromos`}
          badgeCount={promosUnread}
          onPress={onPromosPress || (() => router.push('/book'))}
        />

        <QuickAction
          icon={require('@/assets/images/track-icon.png')}
          label={`Track Service\nStatus`}
          onPress={() => router.push('/track')}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  title: {
    color: '#00000ff',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: -5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginHorizontal: 3,
    gap: 8,
  },
});
