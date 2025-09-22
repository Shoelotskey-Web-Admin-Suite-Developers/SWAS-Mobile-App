// components/AnnouncementsModal.tsx
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function AnnouncementsModal({ visible, onClose }: Props) {
  const { announcements, readIds, markAsRead, loading } = useAnnouncements();
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    const isExpanded = expandedIds.includes(id);
    if (!isExpanded) markAsRead(id);

    setExpandedIds(prev =>
      isExpanded ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <ThemedView style={styles.modal}>
          <ThemedText type="titleSmall" style={styles.header}>
            Announcements
          </ThemedText>

          <ScrollView contentContainerStyle={styles.list}>
            {!loading && (!announcements || announcements.length === 0) ? (
              <View style={styles.placeholder}>
                <ThemedText type="titleSmall" style={styles.placeholderTitle}>
                  No announcements yet
                </ThemedText>
                <ThemedText type="default" style={styles.placeholderText}>
                  There are currently no announcements. Check back later or open the announcements panel.
                </ThemedText>
              </View>
            ) : (
              announcements.map(announcement => {
              const isRead = readIds.includes(announcement.id);
              const isExpanded = expandedIds.includes(announcement.id);

              return (
                <Pressable
                  key={announcement.id}
                  style={styles.card}
                  onPress={() => toggleExpand(announcement.id)}
                >
                  <View style={styles.topRow}>
                    <View>
                      <ThemedText type="button" style={styles.date}>
                        Posted on {announcement.date}
                      </ThemedText>
                      {announcement.branchName ? (
                        <ThemedText type="subtitle2" style={styles.branchName}>
                          {announcement.branchName}
                        </ThemedText>
                      ) : null}
                    </View>
                    {!isRead && (
                      <View style={styles.unreadDot}>
                        <ThemedText type="option" style={styles.excl}>
                          !
                        </ThemedText>
                      </View>
                    )}
                  </View>

                  <ThemedText
                    type="button"
                    style={styles.title}
                    numberOfLines={isExpanded ? undefined : 1}
                    ellipsizeMode={isExpanded ? 'clip' : 'tail'}
                  >
                    {announcement.title}
                  </ThemedText>

                  {isExpanded && (
                    <ThemedText type="default" style={styles.desc}>
                      {announcement.description}
                    </ThemedText>
                  )}
                </Pressable>
              );
              })
            )}
          </ScrollView>

          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="white" />
          </Pressable>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  header: {
    textAlign: 'center',
    marginBottom: 12,
    color: '#D11315',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    color: '#919191',
    fontSize: 14,
    marginBottom: -7,
  },
  branchName: {
    color: '#9a9a9aff',
    fontSize: 12,
    marginTop: 4,
  },
  title: {
    marginTop: 4,
    color: '#000000ff',
    fontSize: 17,
  },
  desc: {
    marginTop: 8,
    color: '#000000ff',
  },
  unreadDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D11315',
    justifyContent: 'center',
    alignItems: 'center',
  },
  excl: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#D11315',
    padding: 8,
    borderRadius: 20,
  },
  placeholder: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderTitle: {
    color: '#000',
    marginBottom: 8,
  },
  placeholderText: {
    color: '#666',
    textAlign: 'center',
  },
});
