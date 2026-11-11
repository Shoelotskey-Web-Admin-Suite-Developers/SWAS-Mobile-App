import { usePromos } from '@/hooks/usePromos';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const formatDate = (value: string) => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const [, year, month, day] = match;
  const monthIndex = Number(month) - 1;
  if (monthIndex < 0 || monthIndex > 11) return null;

  return {
    day: Number(day),
    month: MONTH_NAMES[monthIndex],
    monthIndex,
    year: Number(year),
  };
};

const formatPromoDuration = (duration?: string) => {
  const value = duration?.trim();
  if (!value) return 'Dates to be announced';

  const singleDate = formatDate(value);
  if (singleDate) return `${singleDate.month} ${singleDate.day}, ${singleDate.year}`;

  const dates = value.split(/\s+-\s+|\s*[–—]\s*|\s+\bto\b\s+/i);
  if (dates.length !== 2) return value;

  const start = formatDate(dates[0]);
  const end = formatDate(dates[1]);
  if (!start || !end) return value;

  if (start.year === end.year && start.monthIndex === end.monthIndex) {
    return `${start.month} ${start.day}–${end.day}, ${start.year}`;
  }

  if (start.year === end.year) {
    return `${start.month} ${start.day} – ${end.month} ${end.day}, ${start.year}`;
  }

  return `${start.month} ${start.day}, ${start.year} – ${end.month} ${end.day}, ${end.year}`;
};

export default function PromosModal({ visible, onClose }: Props) {
  const { promos, loading, readIds, markAsRead } = usePromos();
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    const isExpanded = expandedIds.includes(id);
    if (!isExpanded) markAsRead(id);
    setExpandedIds(prev => (isExpanded ? prev.filter(i => i !== id) : [...prev, id]));
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <ThemedView style={styles.modal}>
          <View style={styles.header}>
            <View>
              <ThemedText type="titleSmall" style={styles.headerTitle}>
                Promos
              </ThemedText>
              <ThemedText type="default" style={styles.headerSubtitle}>
                Exclusive offers for you
              </ThemedText>
            </View>
            <Pressable
              accessibilityLabel="Close promos"
              accessibilityRole="button"
              onPress={onClose}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={22} color="#D11315" />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.list}>
            {!loading && (!promos || promos.length === 0) ? (
              <View style={styles.placeholder}>
                <ThemedText type="titleSmall" style={styles.placeholderTitle}>
                  No active promos
                </ThemedText>
                <ThemedText type="default" style={styles.placeholderText}>
                  There are currently no active promotions. Check back later for deals.
                </ThemedText>
              </View>
            ) : (
              promos.map(promo => {
                const isExpanded = expandedIds.includes(promo.id);
                const isRead = readIds.includes(promo.id);

                return (
                  <Pressable
                    accessibilityLabel={`${promo.title}. ${isExpanded ? 'Collapse' : 'Expand'} promo`}
                    accessibilityRole="button"
                    key={promo.id}
                    style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                    onPress={() => toggleExpand(promo.id)}
                  >
                    <View style={styles.cardTopRow}>
                      <View style={styles.dateRow}>
                        <Ionicons name="calendar-outline" size={16} color="#D11315" />
                        <ThemedText type="button" style={styles.date}>
                          {formatPromoDuration(promo.duration)}
                        </ThemedText>
                      </View>
                      {!isRead && (
                        <View style={styles.unreadBadge}>
                          <ThemedText type="option" style={styles.unreadExcl}>!</ThemedText>
                          <ThemedText type="option" style={styles.unreadText}>New</ThemedText>
                        </View>
                      )}
                    </View>

                    {promo.branchName ? (
                      <View style={styles.branchRow}>
                        <Ionicons name="location-outline" size={14} color="#6b6b6b" />
                        <ThemedText type="option" style={styles.branchName}>{promo.branchName}</ThemedText>
                      </View>
                    ) : null}

                    <ThemedText
                      type="button"
                      style={styles.title}
                      numberOfLines={isExpanded ? undefined : 2}
                      ellipsizeMode={isExpanded ? 'clip' : 'tail'}
                    >
                      {promo.title}
                    </ThemedText>

                    {isExpanded && (
                      <ThemedText type="default" style={styles.desc}>{promo.description}</ThemedText>
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
  overlay: { flex: 1, backgroundColor: '#00000099', justifyContent: 'center', alignItems: 'center' },
  modal: { width: '90%', maxHeight: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 18 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerTitle: { color: '#D11315' },
  headerSubtitle: { color: '#777', fontSize: 12, marginTop: 2 },
  list: { paddingBottom: 4 },
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
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  date: { color: '#D11315', fontSize: 14, marginBottom: 0 },
  branchRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 },
  branchName: { color: '#6b6b6b', fontSize: 12, marginBottom: 0 },
  title: { color: '#000000ff', fontSize: 17, lineHeight: 23, marginTop: 10, paddingRight: 22 },
  desc: { color: '#444', lineHeight: 20, marginTop: 8, paddingRight: 4 },
  closeBtn: { alignItems: 'center', backgroundColor: '#fff1f1', borderRadius: 18, height: 36, justifyContent: 'center', width: 36 },
  unreadBadge: {
    alignItems: 'center',
    backgroundColor: '#D11315',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  unreadExcl: {
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
