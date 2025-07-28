// components/AnnouncementsModal.tsx
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useState } from 'react';
import { Announcement, useAnnouncements } from '@/hooks/useAnnouncements';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function AnnouncementsModal({ visible, onClose }: Props) {
  const { announcements, readIds, markAsRead } = useAnnouncements();
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
            {announcements.map(announcement => {
              const isRead = readIds.includes(announcement.id);
              const isExpanded = expandedIds.includes(announcement.id);

              return (
                <Pressable
                  key={announcement.id}
                  style={styles.card}
                  onPress={() => toggleExpand(announcement.id)}
                >
                  <View style={styles.topRow}>
                    <ThemedText type="button" style={styles.date}>
                      Posted on {announcement.date}
                    </ThemedText>
                    {!isRead && (
                      <View style={styles.unreadDot}>
                        <ThemedText type="option" style={styles.excl}>
                          !
                        </ThemedText>
                      </View>
                    )}
                  </View>

                  <ThemedText type="button" style={styles.title}>
                    {announcement.title}
                  </ThemedText>

                  {isExpanded && (
                    <ThemedText type="default" style={styles.desc}>
                      {announcement.description}
                    </ThemedText>
                  )}
                </Pressable>
              );
            })}
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
});
