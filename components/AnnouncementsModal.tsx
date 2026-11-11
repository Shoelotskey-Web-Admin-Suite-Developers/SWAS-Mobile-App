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
          <View style={styles.header}>
            <View>
              <ThemedText type="titleSmall" style={styles.headerTitle}>
                Announcements
              </ThemedText>
              <ThemedText type="default" style={styles.headerSubtitle}>
                Stay updated with SWAS
              </ThemedText>
            </View>
            <Pressable
              accessibilityLabel="Close announcements"
              accessibilityRole="button"
              onPress={onClose}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={22} color="#D11315" />
            </Pressable>
          </View>

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
                    accessibilityLabel={`${announcement.title}. ${isExpanded ? 'Collapse' : 'Expand'} announcement`}
                    accessibilityRole="button"
                    key={announcement.id}
                    style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                    onPress={() => toggleExpand(announcement.id)}
                  >
                    <View style={styles.topRow}>
                      <View style={styles.dateRow}>
                        <Ionicons name="megaphone-outline" size={16} color="#D11315" />
                        <ThemedText type="button" style={styles.date}>
                          Posted {announcement.date}
                        </ThemedText>
                      </View>
                      {!isRead && (
                        <View style={styles.unreadBadge}>
                          <ThemedText type="option" style={styles.excl}>!</ThemedText>
                          <ThemedText type="option" style={styles.unreadText}>New</ThemedText>
                        </View>
                      )}
                    </View>

                    {announcement.branchName ? (
                      <View style={styles.branchRow}>
                        <Ionicons name="location-outline" size={14} color="#6b6b6b" />
                        <ThemedText type="subtitle2" style={styles.branchName}>
                          {announcement.branchName}
                        </ThemedText>
                      </View>
                    ) : null}

                    <ThemedText
                      type="button"
                      style={styles.title}
                      numberOfLines={isExpanded ? undefined : 2}
                      ellipsizeMode={isExpanded ? 'clip' : 'tail'}
                    >
                      {announcement.title}
                    </ThemedText>

                    {isExpanded && (
                      <ThemedText type="default" style={styles.desc}>
                        {announcement.description}
                      </ThemedText>
                    )}
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color="#919191"
                      style={styles.expandIcon}
                    />
                  </Pressable>
                );
              })
            )}
          </ScrollView>
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
    borderRadius: 20,
    padding: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    color: '#D11315',
  },
  headerSubtitle: {
    color: '#777',
    fontSize: 12,
    marginTop: 2,
  },
  list: {
    paddingBottom: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderColor: '#e8e8e8',
    borderRadius: 14,
    borderWidth: 1,
    elevation: 1,
    marginBottom: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  cardPressed: { opacity: 0.78 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  date: {
    color: '#D11315',
    fontSize: 14,
    marginBottom: 0,
  },
  branchRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 },
  branchName: {
    color: '#6b6b6b',
    fontSize: 12,
    marginTop: 0,
  },
  title: {
    color: '#000000ff',
    fontSize: 17,
    lineHeight: 23,
    marginTop: 10,
    paddingRight: 22,
  },
  desc: {
    color: '#444',
    lineHeight: 20,
    marginTop: 8,
    paddingRight: 4,
  },
  closeBtn: {
    alignItems: 'center',
    backgroundColor: '#fff1f1',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  unreadBadge: {
    alignItems: 'center',
    backgroundColor: '#D11315',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  excl: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  unreadText: {
    color: 'white',
    fontSize: 10,
  },
  expandIcon: { position: 'absolute', bottom: 14, right: 14 },
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
