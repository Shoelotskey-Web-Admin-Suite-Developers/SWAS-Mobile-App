import type { ILineItemService } from '@/backend/src/models/LineItem';
import HeaderConfig from '@/components/HeaderConfig';
import { ThemedText } from '@/components/ThemedText';
import TrackServiceCard from '@/components/TrackServiceCard';
import { useSocket } from '@/hooks/useSocket'; // Import socket hook
import { getLineItems } from '@/utils/api/getLineItems';
import { getServiceName } from '@/utils/api/getServiceName';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
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
  
  // Initialize socket
  const {
    joinLineItem,
    leaveLineItem,
    onDatesUpdated,
    onLineItemUpdated,
    offDatesUpdated,
    offLineItemUpdated,
  } = useSocket();

  // Memoized callback for handling line item updates
  const handleLineItemUpdate = useCallback((data: any) => {
    if (!data?.lineItemId) return;
    
    console.log('📱 [Track] Received line item update:', data.lineItemId);
    
    if (data.fullDocument && data.operationType !== 'delete') {
      // Update existing item or add new one
      setLineItems(prevItems => {
        const existingIndex = prevItems.findIndex(item => 
          item.line_item_id === data.lineItemId);
        
        if (existingIndex !== -1) {
          // Update existing item
          const newItems = [...prevItems];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            ...data.fullDocument,
          };
          console.log('✅ [Track] Updated existing line item');
          return newItems;
        } else {
          // Add new item
          console.log('✅ [Track] Added new line item');
          return [...prevItems, data.fullDocument];
        }
      });
      
      // Check if we need to fetch service names for this item
      if (data.fullDocument.services) {
        fetchServiceNamesForItem(data.fullDocument);
      }
    } else if (data.operationType === 'delete') {
      // Remove deleted item
      setLineItems(prevItems => 
        prevItems.filter(item => item.line_item_id !== data.lineItemId)
      );
      console.log('✅ [Track] Removed deleted line item');
    }
  }, []);

  // Memoized callback for dates updates (affects "ready for pickup" status)
  const handleDatesUpdate = useCallback((data: any) => {
    if (!data?.lineItemId) return;
    
    console.log('📱 [Track] Received dates update:', data.lineItemId);
    
    if (data.fullDocument) {
      // Find the line item that this dates update belongs to
      setLineItems(prevItems => {
        return prevItems.map(item => {
          if (item.line_item_id === data.lineItemId) {
            // Mark the item as needing a status refresh
            return { ...item, needsStatusRefresh: true };
          }
          return item;
        });
      });
      console.log('✅ [Track] Marked line item for status refresh');
    }
  }, []);

  // Set up socket listeners
  useEffect(() => {
    onLineItemUpdated(handleLineItemUpdate);
    onDatesUpdated(handleDatesUpdate);
    
    return () => {
      offLineItemUpdated(handleLineItemUpdate);
      offDatesUpdated(handleDatesUpdate);
    };
  }, [handleLineItemUpdate, handleDatesUpdate]);

  // Join socket rooms for all line items
  useEffect(() => {
    // Join rooms for all current line items
    lineItems.forEach(item => {
      if (item.line_item_id) {
        joinLineItem(item.line_item_id);
      }
    });
    
    // Clean up when component unmounts
    return () => {
      lineItems.forEach(item => {
        if (item.line_item_id) {
          leaveLineItem(item.line_item_id);
        }
      });
    };
  }, [lineItems.map(item => item.line_item_id).join(',')]);

  // Fetch service names for a specific item
  const fetchServiceNamesForItem = async (item: any) => {
    if (!item?.services) return;
    
    const newServiceIds = new Set<string>();
    
    item.services.forEach((service: ILineItemService) => {
      if (!serviceNames[service.service_id]) {
        newServiceIds.add(service.service_id);
      }
    });
    
    if (newServiceIds.size === 0) return;
    
    const newNames: Record<string, string> = {};
    await Promise.all(
      Array.from(newServiceIds).map(async (id) => {
        const name = await getServiceName(id);
        if (name) newNames[id] = name;
      })
    );
    
    if (Object.keys(newNames).length > 0) {
      setServiceNames(prev => ({ ...prev, ...newNames }));
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchLineItems = async () => {
      setLoading(true);

     // Read the current user id first to avoid race conditions
     const currentUserId = await (await import('@/utils/session')).getUserId();
     console.log('[Track] currentUserId for fetch:', currentUserId);

      const data = await getLineItems();
      // Defensive filtering: if backend returned items for a different user,
      // filter them out and log the discrepancy for debugging.
      const items = Array.isArray(data) ? data : [];
      const filtered = currentUserId ? items.filter((it: any) => it.cust_id === currentUserId) : items;
      if (items.length !== filtered.length) {
        console.warn(`[Track] getLineItems returned ${items.length} items but ${filtered.length} match the current user (${currentUserId}). Showing filtered list.`);
      }
      setLineItems(filtered);

      // Gather all unique service_ids
      const allServiceIds = new Set<string>();
      (filtered || []).forEach((item: any) => {
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
                  branch={item.branch_id}
                  services={(Array.isArray(item.services) ? item.services : [])
                    .map((s: ILineItemService) => `${serviceNames[s.service_id] || s.service_id} (${s.quantity})`)
                    .join(' + ')}
                  shoeModel={item.shoes}
                  receiptId={item.transaction_id}
                  trackNumber={item.line_item_id}
                  customerId={item.cust_id}
                  needsStatusRefresh={item.needsStatusRefresh}
                  onPress={() => handlePress(item)}
                />
              </View>
            ))}
            
          {!loading && lineItems.length === 0 && (
            <ThemedText style={{ textAlign: 'center', marginTop: 50, color: '#666' }}>
              No service requests found.
            </ThemedText>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
