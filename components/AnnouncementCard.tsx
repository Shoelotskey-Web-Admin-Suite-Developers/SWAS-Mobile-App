import { ThemedText } from '@/components/ThemedText';
import { ScrollView, StyleSheet, View } from 'react-native';

type Props = {
  date: string;
  title: string;
  description: string;
};

export default function AnnouncementCard({ date, title, description }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="titleSmall" style={styles.announcement}>
          Announcement
        </ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedText type="subtitle2" style={styles.date}>
          Posted on {date}
        </ThemedText>

        <View style={styles.content}>
          <View>
            <ThemedText type="subtitle1" style={styles.contentText}>{title}</ThemedText>
            <ThemedText type="default" style={styles.contentText}>{description}</ThemedText>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 140,
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 4,
    borderColor: '#D11315',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#D11315',
    paddingVertical: 3,
    paddingHorizontal: 12,
  },
  announcement: {
    alignSelf: 'center',
    fontSize: 14,
    color: 'white',
  },
  scrollContainer: {
    paddingBottom: 10,
  },
  date: {
    marginTop: 6,
    marginHorizontal: 12,
    color: '#888',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 0,
    marginHorizontal: 12,
    paddingBottom: 10,
  },
  contentText: {
    color: '#00000ff',
  }
});
