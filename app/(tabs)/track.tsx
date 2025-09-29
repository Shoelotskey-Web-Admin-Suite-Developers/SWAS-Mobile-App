import type { ILineItemService } from '@/backend/src/models/LineItem';
import HeaderConfig from '@/components/HeaderConfig';
import { ThemedText } from '@/components/ThemedText';
import TrackServiceCard from '@/components/TrackServiceCard';
import { getLineItems } from '@/utils/api/getLineItems';
import { getServiceName } from '@/utils/api/getServiceName'; // <-- import helper
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#F2F2F2',
  },
  sectionHeader: {
    
    color: '#C40000',
  },
  note: {
    marginBottom: 10,
  }
});

export default function TrackServiceScreen() {
  const insets = useSafeAreaInsets();
  const [lineItems, setLineItems] = useState<any[]>([]);
  const [serviceNames, setServiceNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLineItems = async () => {
      setLoading(true);
      const data = await getLineItems();
      setLineItems(data || []);

      // Gather all unique service_ids
      const allServiceIds = new Set<string>();
      (data || []).forEach((item: any) => {
        (item.services || []).forEach((s: ILineItemService) => {
          allServiceIds.add(s.service_id);
        });
      });

      // Fetch names for each service_id
      const names: Record<string, string> = {};
      await Promise.all(
        Array.from(allServiceIds).map(async (id) => {
          const name = await getServiceName(id);
          if (name) names[id] = name;
        })
      );
      setServiceNames(names);

      setLoading(false);
    };
    fetchLineItems();
  }, []);

  const handlePress = (item: any) => {
    router.push({
      pathname: '/trackItem/trackItem',
      params: {
        trackNumber: item.line_item_id,
        receiptId: item.transaction_id,
        customerId: item.cust_id,
      },
    });
  };

  return (
    <>
      <HeaderConfig title="Track Service" />

      {/* ensure items are not clipped by the bottom tab/navigation bar */}
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['left', 'right', 'bottom']}>
        <ScrollView contentContainerStyle={[styles.container, { paddingBottom: Math.max(insets.bottom, 80) }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <ThemedText type="titleSmall" style={styles.sectionHeader}>
            Current Service Request ({lineItems.length})
          </ThemedText>
          <ThemedText type="default" style={styles.note}>
            Note: Click an item to see more details and updates on your service request.
          </ThemedText>

          {loading && <ThemedText>Loading...</ThemedText>}

          {!loading &&
            lineItems.map((item, index) => (
              <View key={item.line_item_id || index} style={{ marginBottom: 0 }}>
                <TrackServiceCard
                  branch={item.branch_id} // Pass the original branch_id, not the transformed version
                  services={(Array.isArray(item.services) ? item.services : [])
                    .map((s: ILineItemService) => `${serviceNames[s.service_id] || s.service_id} (${s.quantity})`)
                    .join(' + ')}
                  shoeModel={item.shoes}
                  receiptId={item.transaction_id}
                  trackNumber={item.line_item_id}
                  customerId={item.cust_id}
                  onPress={() => handlePress(item)}
                />
              </View>
            ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
