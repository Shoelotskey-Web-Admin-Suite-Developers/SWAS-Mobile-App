import HeaderConfig from '@/components/HeaderConfig';
import ServicesModalCard from '@/components/ServicesModalCard';
import { ThemedText } from '@/components/ThemedText';
import { useServices } from '@/hooks/useServices';
import { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

type ServiceModalDetail = {
  title: string;
  imageSource: ReturnType<typeof require>;
  price: string;
  days: string;
  description: string;
  additionalDetails: { label: string; price: string; duration: string }[];
};

// ✅ Define modal content for each service
const modalDetailsMap: Record<string, ServiceModalDetail> = {
  'Basic Cleaning': {
    title: 'Basic Cleaning',
    imageSource: require('@/assets/images/services-modal-basic_cleaning.png'),
    price: '₱325 – ₱550',
    days: '10 – 25',
    description: 'Gentle cleaning for everyday dirt and stains — perfect for keeping your kicks fresh and ready.',
    additionalDetails: [
      { label: 'Basic Cleaning', price: '₱325', duration: '10 Days' },
      { label: 'Unyellowing', price: '+₱125: ₱450', duration: '10 Days' },
      { label: 'Minor Retouch', price: '+₱125: ₱450', duration: '10 Days' },
      { label: 'Minor Restoration', price: '+₱225: ₱550', duration: '25 Days' },
    ],
  },
  'Minor Reglue': {
    title: 'Minor Reglue',
    imageSource: require('@/assets/images/services-modal-minor_reglue.png'),
    price: '₱450',
    days: '25',
    description: 'Fixes small sole separations with a light reglue, includes basic cleaning to finish it fresh.',
    additionalDetails: [],
  },
  'Full Reglue': {
    title: 'Full Reglue',
    imageSource: require('@/assets/images/services-modal-full_reglue.png'),
    price: '₱575',
    days: '25',
    description: 'Complete sole reattachment for worn-out kicks, finished with a basic cleaning for a fresh look.',
    additionalDetails: [
      { label: 'Single layer Only', price: '₱575', duration: '25 days' },
      { label: 'Additional Per layer', price: '+ ₱150', duration: '25 days' },
    ],
  },
  'Color Renewal': {
    title: 'Color Renewal',
    imageSource: require('@/assets/images/services-modal-color_renewal.png'),
    price: '₱600 – ₱700',
    days: '20',
    description: 'Restores faded color and vibrance, paired with basic cleaning for a refreshed look',
    additionalDetails: [
      { label: '2 Colors', price: '₱275', duration: '20 days' },
      { label: '3 Colors', price: '₱375', duration: '20 days' },
    ],
  },
};

export default function ServicesScreen() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const { services, loading, error } = useServices();

  const serviceCards = useMemo(() => [
    {
      serviceId: 'SERVICE-1',
      title: 'Basic Cleaning',
      subtitle: '',
      image: require('@/assets/images/services-basic_cleaning.png'),
    },
    {
      serviceId: 'SERVICE-2',
      title: 'Minor Reglue',
      subtitle: '(with basic cleaning)',
      image: require('@/assets/images/services-minor_reglue.png'),
    },
    {
      serviceId: 'SERVICE-3',
      title: 'Full Reglue',
      subtitle: '(with basic cleaning)',
      image: require('@/assets/images/services-full_reglue.png'),
    },
    {
      serviceId: 'SERVICE-4',
      title: 'Color Renewal',
      subtitle: '(with basic cleaning)',
      image: require('@/assets/images/services-color_renewal.png'),
    },
  ], []);

  const handleCardPress = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const closeModal = () => setSelectedService(null);

  const selectedServiceCard = selectedService
    ? serviceCards.find(card => card.serviceId === selectedService)
    : null;
  const selectedModalData = selectedServiceCard
    ? modalDetailsMap[selectedServiceCard.title]
    : null;
  const selectedServiceRecord = selectedService ? services[selectedService] : null;
  const formatPrice = (price: number | undefined) => price === undefined ? '—' : `₱${price.toLocaleString()}`;
  const getPrice = (serviceId: string) => formatPrice(services[serviceId]?.service_base_price);
  const priceRange = (firstId: string, secondId: string) => {
    const first = services[firstId]?.service_base_price;
    const second = services[secondId]?.service_base_price;
    return first === undefined || second === undefined
      ? '—'
      : `₱${Math.min(first, second).toLocaleString()} – ₱${Math.max(first, second).toLocaleString()}`;
  };

  return (
    <>
      <HeaderConfig title="Services" />

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText type="subtitle1" style={styles.sectionTitle}>
            Details and Price
          </ThemedText>

          {loading && <ThemedText>Loading services...</ThemedText>}
          {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

          <View style={styles.grid}>
            {serviceCards.map((item) => (
              <TouchableOpacity
                key={item.serviceId}
                style={styles.card}
                onPress={() => handleCardPress(item.serviceId)}
              >
                <Image source={item.image} style={styles.cardImage} />
                <View style={styles.cardOverlay}>
                  <ThemedText type="button" style={styles.cardTitle}>
                    {item.title}
                  </ThemedText>
                  {item.subtitle !== '' && (
                    <ThemedText type="option" style={styles.cardSubtitle}>
                      {item.subtitle}
                    </ThemedText>
                  )}
                  <ThemedText type="button" style={styles.cardPrice}>
                    {item.serviceId === 'SERVICE-4'
                      ? priceRange('SERVICE-4', 'SERVICE-5')
                      : getPrice(item.serviceId)}
                  </ThemedText>
                  <ThemedText
                    type="link"
                    style={{ color: '#fff', fontSize: 14, alignSelf: 'center' }}
                  >
                    View Details
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.note}>
            <ThemedText type="option" style={styles.noteText}>
              Note:{"\n"}This section is for service details only. Actual service will be assessed and scheduled on-site.
            </ThemedText>
          </View>
        </ScrollView>
      </View>

      {/* ✅ Dynamic Modal */}
      {selectedModalData && selectedServiceRecord && (
        <ServicesModalCard
          visible={true}
          onClose={closeModal}
          title={selectedModalData.title}
          imageSource={selectedModalData.imageSource}
          price={
            selectedService === 'SERVICE-4'
              ? priceRange('SERVICE-4', 'SERVICE-5')
              : getPrice(selectedServiceRecord.service_id)
          }
          days={selectedModalData.days}
          description={selectedModalData.description}
          additionalDetails={selectedModalData.additionalDetails.map(detail => {
            const priceByLabel: Record<string, string> = {
              'Basic Cleaning': getPrice('SERVICE-1'),
              Unyellowing: `+${getPrice('SERVICE-8')}`,
              'Minor Retouch': `+${getPrice('SERVICE-9')}`,
              'Minor Restoration': `+${getPrice('SERVICE-6')}`,
              'Additional Per layer': `+ ${getPrice('SERVICE-7')}`,
              '2 Colors': `${getPrice('SERVICE-4')}`,
              '3 Colors': `${getPrice('SERVICE-5')}`,
            };
            return priceByLabel[detail.label]
              ? { ...detail, price: priceByLabel[detail.label] }
              : detail;
          })}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 15,
    color: '#D11315',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    width: '47%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    backgroundColor: '#ccc',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
  cardTitle: {
    color: '#fff',
  },
  cardSubtitle: {
    color: '#fff',
    marginTop: -3,
  },
  cardPrice: {
    color: '#FFF387',
    marginVertical: 6,
  },
  note: {
    marginTop: 20,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
  },
  noteText: {
    color: '#333',
    fontSize: 12,
  },
  errorText: {
    color: '#CE1616',
    marginBottom: 12,
  },
});
