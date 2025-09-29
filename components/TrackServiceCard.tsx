import { ThemedText } from '@/components/ThemedText';
import { getBranchName } from '@/utils/api/getBranchName';
import { getDatesByLineItemId } from '@/utils/api/getDatesByLineItemId';
import { getLineItemById } from '@/utils/api/getLineItemById';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

type Props = {
  branch: string;
  services: string;
  shoeModel: string;
  receiptId: string;
  trackNumber: string;
  customerId: string;
  onPress?: () => void;
};

export default function TrackServiceCard({
  branch,
  services,
  shoeModel,
  receiptId,
  trackNumber,
  customerId,
  onPress,
}: Props) {
  const [isReady, setIsReady] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [previewAvailable, setPreviewAvailable] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [branchName, setBranchName] = useState<string>(branch);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setStatusLoading(true);
      setPreviewLoading(true);
      
      try {
        // Fetch branch name
        const name = await getBranchName(branch);
        if (mounted) setBranchName(name);
      } catch (e) {
        console.error('Failed to fetch branch name:', e);
      }
      
      try {
        const dates = await getDatesByLineItemId(trackNumber);
        if (mounted) setIsReady(dates?.current_status === 7);
      } catch (e) {
        if (mounted) setIsReady(false);
      } finally {
        if (mounted) setStatusLoading(false);
      }

      try {
        const li = await getLineItemById(trackNumber);
        if (mounted) setPreviewAvailable(Boolean(li?.after_img));
      } catch (e) {
        if (mounted) setPreviewAvailable(false);
      } finally {
        if (mounted) setPreviewLoading(false);
      }
    };

    if (trackNumber) fetchData();
    return () => {
      mounted = false;
    };
  }, [trackNumber, branch]);

  const handlePress = () => {
    if (onPress) return onPress();
    router.push({
      pathname: '/trackItem/trackItem',
      params: {
        receiptId,
        trackNumber,
        customerId,
      },
    });
  };

  const handlePreviewPress = () => {
    // navigate to detailed trackItem screen where preview is shown
    router.push({
      pathname: '/trackItem/trackItem',
      params: {
        receiptId,
        trackNumber,
        customerId,
      },
    });
  };

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      <View>
        <ThemedText type="subtitle1" style={styles.branch}>
          {branchName}
        </ThemedText>
        <ThemedText type="default">{services}</ThemedText>
        <ThemedText type="titleSmall" style={styles.model}>
          {shoeModel}
        </ThemedText>

        {!statusLoading && isReady && (
          <ThemedText type="subtitle2" style={styles.ready}>
            ✓ Ready for pickup
          </ThemedText>
        )}

        {!previewLoading && previewAvailable && (
          <TouchableOpacity style={styles.previewRow} onPress={handlePreviewPress}>
            <MaterialIcons name="image" size={16} color="#C40000" style={{ marginRight: 6 }} />
            <ThemedText type="option" style={styles.previewText}>
              Shoes preview available — view now
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  branch: {
    marginBottom: 10,
  },
  model: {
    marginTop: 2,
    fontSize: 24,
  },
  ready: {
    marginTop: 8,
    color: '#D11315',
    fontWeight: '600',
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  previewText: {
    color: '#C40000',
    textDecorationLine: 'underline',
  },
});
