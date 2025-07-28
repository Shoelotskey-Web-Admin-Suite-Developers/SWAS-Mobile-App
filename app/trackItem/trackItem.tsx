import HeaderConfig from '@/components/HeaderConfig';
import PreviewSlider from '@/components/PreviewSlider';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';

export default function TrackItemScreen() {
  const { receiptId, trackNumber, customerId } = useLocalSearchParams();

  const order = {
    customerName: 'Customer Name',
    customerId: customerId ?? '1578',
    branch: 'SM Valenzuela Branch',
    estimatedPickup: '07-06-2025',
    shoeModel: 'Nike Air Force 1',
    services: 'Basic Cleaning + Sole Unyellowing',
    isRush: true,
    currentStatus: 3,
    statuses: [
      {
        date: '30 May 18:29',
        label: 'Shoes acknowledged in shop',
      },
      {
        date: '3 June 08:30',
        label: 'In transport to Hub for service',
      },
      {
        date: '30 May 18:29',
        label: 'Arrived in Hub - In process',
      },
      {
        date: '30 May 18:29',
        label: 'Returning to assigned service branch',
      },
      {
        date: '30 May 18:29',
        label: 'Ready for Pickup',
      },
    ],
    previewImages: [
        'https://example.com/shoe-before.jpg',
        'https://example.com/shoe-after.jpg',
    ],
    receiptId: receiptId ?? '2025-0015-VAL',
    trackNumber: trackNumber ?? 'O1',
    payment: {
      total: 350,
      paid: 175,
    },
  };

  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const percentagePaid = order.payment.paid / order.payment.total;
  const paymentPercentDisplay = Math.round(percentagePaid * 100);

  let paymentBadgeText = 'Unpaid';
  if (percentagePaid >= 1) {
    paymentBadgeText = 'Fully Paid';
  } else if (percentagePaid > 0) {
    paymentBadgeText = 'Partially Paid';
  }

  return (
    <>
    <HeaderConfig title="Track Service" />
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Card */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <ThemedText type="subtitle1">{order.customerName}</ThemedText>
          {order.isRush && (
            <View style={styles.rushTag}>
              <ThemedText type="subtitle1" style={styles.rushText}>RUSH</ThemedText>
            </View>
          )}
        </View>

        <ThemedText type="default">ID: {order.customerId}</ThemedText>
        <View style={styles.rowBetween}>
          <ThemedText type="default">
            Branch{'\n'}
            <ThemedText type="bold">{order.branch}</ThemedText>
          </ThemedText>
          <ThemedText type="default">
            Est. Pickup{'\n'}
            <ThemedText type="bold">{order.estimatedPickup}</ThemedText>
          </ThemedText>
        </View>

        <View style={styles.divider} />

        <View>
          <ThemedText type="subtitle1">{order.shoeModel}</ThemedText>
          <ThemedText type="default">{order.services}</ThemedText>
        </View>
      </View>

      {/* Status Timeline */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <MaterialIcons name="location-on" size={20} color="#1E1E1E" style={{ marginRight: 6 }} />
            <ThemedText type="subtitle1">Current Shoes Location: {order.branch}</ThemedText>
        </View>


        {order.statuses.map((step, index) => {
          let color = '#C4C4C4';
          let iconName = 'radio-button-unchecked';
          if (index < order.currentStatus) {
            color = 'black';
            iconName = 'check-circle';
          } else if (index === order.currentStatus) {
            color = '#C40000';
            iconName = 'radio-button-checked';
          }

          return (
            <View key={index} style={styles.statusRow}>
                <View style={styles.timelineWrapper}>
                    <MaterialIcons name={iconName as any} size={20} color={color} />
                    {/* Show vertical line except on last item */}
                    {index !== order.statuses.length - 1 && (
                    <View
                        style={[
                        styles.verticalLine,
                        {
                            height: index === 3 ? 53 : 32, // Custom height for index 3
                            backgroundColor:
                            index < order.currentStatus
                                ? 'black'
                                : index === order.currentStatus
                                ? '#C40000'
                                : '#C4C4C4',
                        },
                        ]}
                    />
                    )}

                    </View>

                    <View style={{ flex: 1 }}>
                    <ThemedText style={{ color }}>{step.date}</ThemedText>
                    <ThemedText
                        type='bold'
                        style={{
                        color,
                        fontWeight: index === order.currentStatus ? 'bold' : 'normal',
                        }}
                    >
                        {step.label}
                    </ThemedText>

                    {index === 3 && (
                    <TouchableOpacity
                        disabled={order.previewImages.length === 0}
                        onPress={() => setIsPreviewVisible(true)}
                    >
                        <View style={styles.previewRow}>
                        <MaterialIcons
                            name="image"
                            size={16}
                            color={color}
                            style={{
                            marginRight: 4,
                            opacity: order.previewImages?.length > 0 ? 1 : 0.4,
                            }}
                        />
                        <ThemedText
                            type="option"
                            style={[
                            styles.previewNote,
                            { color, opacity: order.previewImages?.length > 0 ? 1 : 0.5 },
                            ]}
                        >
                            {order.previewImages?.length > 0
                            ? 'Shoes preview is available. Tap here'
                            : 'Shoes preview unavailable'}
                        </ThemedText>
                        </View>
                    </TouchableOpacity>
                    )}
                    </View>
                </View>
            );

        })}
      </View>

      {/* Order Details */}
      <View style={styles.card}>
        <ThemedText type="subtitle1" style={{ marginBottom: 10 }}>
          Order Details
        </ThemedText>
        <View style={styles.detailRow}>
          <View style={styles.flexColumn}>
            <ThemedText type="bold">Receipt ID</ThemedText>
            <ThemedText>{order.receiptId}</ThemedText>
          </View>
          <View style={styles.flexColumn}>
            <ThemedText type="bold">Track No.</ThemedText>
            <ThemedText>{order.trackNumber}</ThemedText>
          </View>
        </View>
      </View>

      {/* Payment Status */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <ThemedText type="subtitle1">Payment Status</ThemedText>
          <View style={styles.paymentBadge}>
            <ThemedText type="subtitle1" style={styles.paymentText}>{paymentBadgeText}</ThemedText>
          </View>
        </View>

        <View style={styles.paymentDetails}>
            <View style={styles.paymentRow}>
                <ThemedText type="bold">Total Amount</ThemedText>
                <ThemedText>₱{order.payment.total}</ThemedText>
            </View>
            <View style={styles.paymentRow}>
                <ThemedText type="bold">Amount Paid</ThemedText>
                <ThemedText>₱{order.payment.paid}</ThemedText>
            </View>
            <View style={styles.divider} />
            <View style={styles.paymentRow}>
                <ThemedText type="bold">Balance Left</ThemedText>
                <ThemedText type="bold">₱{order.payment.total - order.payment.paid}</ThemedText>
            </View>
        </View>


        <ProgressBar progress={percentagePaid} color="#C40000" style={styles.progress} />
        <ThemedText style={{ textAlign: 'center', marginTop: 4 }}>{paymentPercentDisplay}% Paid</ThemedText>
      </View>
    </ScrollView>
    
    {isPreviewVisible && (
    <Modal visible transparent animationType="fade">
        <View style={styles.modalBackground}>
            <View style={styles.modalCentered}>
            <PreviewSlider
                beforeImage={require('@/assets/images/sample-before.png')}
                afterImage={require('@/assets/images/sample-after.png')}
                onClose={() => setIsPreviewVisible(false)}
            />
            <ThemedText type="subtitle1" style={{paddingTop: 20, paddingHorizontal: 20, textAlign:"center", color:"#fff"}}>Drag the handle to view the shoe before and after cleaning.</ThemedText>
            <ThemedText type="default" style={{paddingTop: 5, paddingHorizontal: 20, textAlign:"center", color:"#fff"}}>Note: Preview photos will be deleted after 5 days</ThemedText>
            </View>
        </View>
    </Modal>
    )}


    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F2F2F2',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    opacity: 0.5,
    marginVertical: 15,
  },
  rushTag: {
    backgroundColor: '#C40000',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 5,
  },
  rushText: {
    color: 'white',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  timelineWrapper: {
    alignItems: 'center',
    marginRight: 10,
    width: 20,
    position: 'relative',
  },
  verticalLine: {
    position: 'absolute',
    top: 18,
    width: 2,
    height: 32,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  previewNote: {
    fontSize: 11,
    textDecorationLine: 'underline'
  },
  paymentBadge: {
    backgroundColor: '#EEE',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 5,
  },
  paymentText: {
    color: '#333',
  },
  paymentDetails: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#EEE",
    borderRadius: 5,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progress: {
    height: 8,
    borderRadius: 5,
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  flexColumn: {
    flex: 1,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // darkens the background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCentered: {
    width: '100%',
    maxWidth: 400,
  },
});
