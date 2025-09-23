import HeaderConfig from '@/components/HeaderConfig';
import PreviewSlider from '@/components/PreviewSlider';
import { ThemedText } from '@/components/ThemedText';
import { getCustName } from '@/utils/api/getCustName';
import { getDatesByLineItemId } from '@/utils/api/getDatesByLineItemId';
import { getLineItemById } from '@/utils/api/getLineItemById';
import { getServiceName } from '@/utils/api/getServiceName';
import { getTransactionsById } from '@/utils/api/getTransactionsById';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';

export default function TrackItemScreen() {
  const { receiptId, trackNumber, customerId } = useLocalSearchParams();

  const [lineItem, setLineItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState<string>('Customer Name');
  const [serviceNames, setServiceNames] = useState<string[]>([]);
  const [transaction, setTransaction] = useState<any>(null);
  const [dates, setDates] = useState<any>(null);

  useEffect(() => {
    const fetchLineItem = async () => {
      if (!trackNumber) return;
      setLoading(true);
      const data = await getLineItemById(trackNumber as string);
      setLineItem(data);
      setLoading(false);

      // Fetch service names
      if (data?.services && Array.isArray(data.services)) {
        const names = await Promise.all(
          data.services.map(async (s: any) => {
            const name = await getServiceName(s.service_id);
            return name ? `${name} (${s.quantity})` : `${s.service_id} (${s.quantity})`;
          })
        );
        setServiceNames(names);
      }
    };
    fetchLineItem();
  }, [trackNumber]);

  useEffect(() => {
    const fetchName = async () => {
      const name = await getCustName();
      if (name) setCustomerName(name);
    };
    fetchName();
  }, []);

  useEffect(() => {
    const fetchDates = async () => {
      if (!lineItem?.line_item_id) return;
      const data = await getDatesByLineItemId(lineItem.line_item_id);
      setDates(data);
    };
    if (lineItem?.line_item_id) {
      fetchDates();
    }
  }, [lineItem?.line_item_id]);

  // Define the mapping between date keys and labels
  const statusLabels = [
    { key: "srm_date", label: "Shoes acknowledged in shop", statusValue: [1] },
    { key: "rd_date", label: "In transport to Hub for service", statusValue: [2, 3] },
    { key: "wh_date", label: "Arrived in Hub - In process", statusValue: [4] },
    { key: "rb_date", label: "Returning to assigned service branch", statusValue: [ 5, 6] },
    { key: "rpu_date", label: "Ready for Pickup", statusValue: [7] },
  ];

  // Map dates to timeline steps
  const mappedStatuses = statusLabels.map((item) => ({
    date: dates && dates[item.key] ? formatDateMDYY(dates[item.key]) : "",
    label: item.label,
  }));

  // Map lineItem data to UI fields
  const order = {
    customerName,
    customerId: customerId ?? lineItem?.cust_id ?? '',
    branch: lineItem?.branch_id ?? '',
    location: lineItem?.current_location ?? '', 
    estimatedPickup: formatDateMDYY(lineItem?.due_date),
    shoeModel: lineItem?.shoes ?? '',
    services: serviceNames.join(' + '),
    isRush: lineItem?.priority === 'Rush',
    currentStatus: dates?.current_status ?? 0, // Use current_status from dates
    statuses: mappedStatuses, // <-- Use the mapped statuses here
    previewImages: [
      // You can update this later
      lineItem?.before_img ?? '', // URL string or empty
      lineItem?.after_img ?? '',  // URL string or empty
    ],
    // new flag: preview is considered available when there's an after image
    previewAvailable: !!lineItem?.after_img,
    receiptId: lineItem?.transaction_id ?? receiptId ?? '',
    trackNumber: lineItem?.line_item_id ?? trackNumber ?? '',
    payment: {
      total: transaction?.total_amount ?? 0,
      paid: transaction?.amount_paid ?? 0,
      status: transaction?.payment_status ?? 'NP',
    },
  };

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!order.receiptId) return;
      const tx = await getTransactionsById(order.receiptId);
      setTransaction(tx);
    };
    if (order.receiptId) {
      fetchTransaction();
    }
  }, [order.receiptId]);

  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const percentagePaid = order.payment.total
    ? order.payment.paid / order.payment.total
    : 0;
  const paymentPercentDisplay = Math.round(percentagePaid * 100);

  let paymentBadgeText = 'Unpaid';
  if (order.payment.status === 'PAID') {
    paymentBadgeText = 'Fully Paid';
  } else if (order.payment.status === 'PARTIAL') {
    paymentBadgeText = 'Partially Paid';
  }

  if (loading) {
    return (
      <>
        <HeaderConfig title="Track Service" />
        <ThemedText style={{ padding: 20 }}>Loading...</ThemedText>
      </>
    );
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
            <ThemedText type="subtitle1">Current Shoes Location: {order.location}</ThemedText>
        </View>


        {order.statuses.map((step, index) => {
          const statusValues = statusLabels[index].statusValue;
          let color = '#C4C4C4';
          let iconName = 'radio-button-unchecked';

          if (statusValues.includes(order.currentStatus)) {
            color = '#C40000'; // red (active)
            iconName = 'radio-button-checked';
          } else if (order.currentStatus > Math.max(...statusValues)) {
            color = 'black'; // completed
            iconName = 'check-circle';
          }

          return (
            <View key={index} style={styles.statusRow}>
              <View style={styles.timelineWrapper}>
                <MaterialIcons name={iconName as any} size={20} color={color} />
                {index !== order.statuses.length - 1 && (
                  <View
                    style={[
                      styles.verticalLine,
                      {
                        height: index === 2 ? 53 : 32, // changed from index === 3
                        backgroundColor: color,
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
                    fontWeight: statusValues.includes(order.currentStatus) ? 'bold' : 'normal',
                  }}
                >
                  {step.label}
                </ThemedText>

                {index === 2 && ( // changed from index === 3
                <TouchableOpacity
                    disabled={!order.previewAvailable}
                    onPress={() => setIsPreviewVisible(true)}
                >
                    <View style={styles.previewRow}>
                    <MaterialIcons
                        name="image"
                        size={16}
                        color={color}
                        style={{
                        marginRight: 4,
                        opacity: order.previewAvailable ? 1 : 0.4,
                        }}
                    />
                    <ThemedText
                        type="option"
                        style={[
                        styles.previewNote,
                        { color, opacity: order.previewAvailable ? 1 : 0.5 },
                        ]}
                    >
                        {order.previewAvailable
                        ? 'Shoes preview is available. Tap here'
                        : 'Photo will be added once shoes are ready'}
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
        <ThemedText style={{ textAlign: 'center', marginTop: 5 , fontSize: 11.5,}}>(This payment breakdown covers all items in this transaction)</ThemedText>
      </View>
    </ScrollView>
    
    {isPreviewVisible && (
    <Modal visible transparent animationType="fade">
        <View style={styles.modalBackground}>
            <View style={styles.modalCentered}>
            <PreviewSlider
                beforeImage={order.previewImages[0]}
                afterImage={order.previewImages[1]}
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

function formatDateMDYY(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const month = date.getMonth() + 1; // Months are 0-indexed
  const day = date.getDate();
  const year = date.getFullYear().toString().slice(-2); // Last two digits
  return `${month}-${day}-${year}`;
}
