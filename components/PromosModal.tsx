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
          <ThemedText type="titleSmall" style={styles.header}>
            Promos
          </ThemedText>

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
                <Pressable key={promo.id} style={styles.card} onPress={() => toggleExpand(promo.id)}>
                  <ThemedText type="button" style={styles.date}>{promo.duration}</ThemedText>
                  {promo.branchName ? <ThemedText type="option" style={styles.branchName}>{promo.branchName}</ThemedText> : null}

                  <ThemedText type="button" style={styles.title} numberOfLines={isExpanded ? undefined : 1} ellipsizeMode={isExpanded ? 'clip' : 'tail'}>
                    {promo.title}
                  </ThemedText>

                  {isExpanded && (
                    <ThemedText type="default" style={styles.desc}>{promo.description}</ThemedText>
                  )}
                  {!isRead && (
                    <View style={styles.unreadDotPromo}>
                      <ThemedText type="option" style={styles.unreadExcl}>!</ThemedText>
                    </View>
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
  overlay: { flex: 1, backgroundColor: '#00000099', justifyContent: 'center', alignItems: 'center' },
  modal: { width: '90%', maxHeight: '85%', backgroundColor: '#fff', borderRadius: 16, padding: 16 },
  header: { textAlign: 'center', marginBottom: 12, color: '#D11315' },
  list: { paddingBottom: 20 },
  card: { backgroundColor: '#f2f2f2', borderRadius: 12, padding: 12, marginBottom: 12 },
  date: { color: '#919191', fontSize: 14, marginBottom: 4 },
  branchName: { color: '#6b6b6b', fontSize: 12, marginBottom: 6 },
  title: { marginTop: 4, color: '#000000ff', fontSize: 17 },
  desc: { marginTop: 8, color: '#000000ff' },
  closeBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: '#D11315', padding: 8, borderRadius: 20 },
  unreadDotPromo: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D11315',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadExcl: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
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
