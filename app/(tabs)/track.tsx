import HeaderConfig from '@/components/HeaderConfig';
import { ThemedText } from '@/components/ThemedText';
import TrackServiceCard from '@/components/TrackServiceCard';
import { StyleSheet, View } from 'react-native';

const dummyData = [
  {
    receiptId: 'RCPT123456',
    trackNumber: 'TRK987654',
    customerId: 'CUST001',
    branch: 'SM Valenzuela Branch',
    services: 'Basic Cleaning',
    shoeModel: 'Nike Air Force 1',
  },
  {
    receiptId: 'RCPT654321',
    trackNumber: 'TRK123456',
    customerId: 'CUST002',
    branch: 'SM Valenzuela Branch',
    services: 'Basic Cleaning',
    shoeModel: 'Nike Air Force 1',
  },
  {
    receiptId: 'RCPT112233',
    trackNumber: 'TRK445566',
    customerId: 'CUST003',
    branch: 'SM Valenzuela Branch',
    services: 'Basic Cleaning',
    shoeModel: 'Nike Air Force 1',
  },
];

export default function TrackServiceScreen() {
  return (
    <>
      <HeaderConfig title="Track Service" />

      <View style={styles.container}>
        <ThemedText type="titleSmall" style={styles.sectionHeader}>
          Current Service Request ({dummyData.length})
        </ThemedText>

        {dummyData.map((item, index) => (
          <TrackServiceCard
            key={index}
            branch={item.branch}
            services={item.services}
            shoeModel={item.shoeModel}
            receiptId={item.receiptId}
            trackNumber={item.trackNumber}
            customerId={item.customerId}
          />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F2F2F2',
    flex: 1,
  },
  sectionHeader: {
    marginBottom: 20,
    color: '#C40000',
  },
});
