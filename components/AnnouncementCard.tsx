import { ThemedText } from '@/components/ThemedText';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
type Props = {
  date?: string;
  title?: string;
  description?: string;
  branchName?: string;
  loading?: boolean;
};

export default function AnnouncementCard({ date, title, description, branchName, loading }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="titleSmall" style={styles.announcement}>
          Announcement
        </ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#D11315" />
            <ThemedText type="default" style={styles.loadingText}>Loading announcements...</ThemedText>
          </View>
        ) : (
          <>
            {branchName ? (
              <View style={styles.branchTagWrapper} pointerEvents="none">
                <View style={styles.branchTag}>
                  <ThemedText type="option" style={styles.branchText}>{branchName}</ThemedText>
                </View>
              </View>
            ) : null}
            {date ? (
              <ThemedText type="subtitle2" style={styles.date}>
                Posted on {date}
              </ThemedText>
            ) : null}

            <View style={styles.content}>
              <View>
                <ThemedText type="subtitle1" style={styles.contentText}>{title}</ThemedText>
                <ThemedText type="default" style={styles.contentText}>{description}</ThemedText>
              </View>
            </View>
          </>
        )}
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
    marginTop: 8,
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
  ,
  loadingContainer: {
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
  },
  branchTagWrapper: {
    position: 'absolute',
    top: 4,
    right: 8,
    zIndex: 10,
  },
  branchTag: {
    backgroundColor: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    elevation: 2,
  },
  branchText: {
    fontSize: 12,
    color: '#333',
  }
});
