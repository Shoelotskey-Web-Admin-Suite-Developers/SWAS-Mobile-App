import React, { useState } from 'react';
import { View, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import HeaderConfig from '@/components/HeaderConfig';
import ServicesModalCard from '@/components/ServicesModalCard';

const services = [
  {
    title: 'Basic Cleaning',
    subtitle: '',
    price: '₱325 - ₱550',
    image: require('@/assets/images/services-basic_cleaning.png'),
  },
  {
    title: 'Minor Reglue',
    subtitle: '(with basic cleaning)',
    price: '₱450',
    image: require('@/assets/images/services-minor_reglue.png'),
  },
  {
    title: 'Full Reglue',
    subtitle: '(with basic cleaning)',
    price: '₱575',
    image: require('@/assets/images/services-full_reglue.png'),
  },
  {
    title: 'Color Renewal',
    subtitle: '(with basic cleaning)',
    price: '₱600 - ₱700',
    image: require('@/assets/images/services-color_renewal.png'),
  },
];

// ✅ Define modal content for each service
const modalDetailsMap = {
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
      { label: 'Single layer Only'},
      { label: 'Additional Per layer', price: '+ ₱150', duration: '₱750' },
    ],
  },
  'Color Renewal': {
    title: 'Color Renewal',
    imageSource: require('@/assets/images/services-modal-color_renewal.png'),
    price: '₱600 – ₱700',
    days: '20',
    description: 'Restores faded color and vibrance, paired with basic cleaning for a refreshed look',
    additionalDetails: [
      { label: '2 Colors', price: '+₱275', duration: '₱600' },
      { label: '3 Colors', price: '+₱375', duration: '₱700' },
    ],
  },
};

export default function ServicesScreen() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleCardPress = (title: string) => {
    setSelectedService(title);
  };

  const closeModal = () => setSelectedService(null);

  const selectedModalData = selectedService ? modalDetailsMap[selectedService] : null;

  return (
    <>
      <HeaderConfig title="Services" />

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText type="subtitle1" style={styles.sectionTitle}>
            Details and Price
          </ThemedText>

          <View style={styles.grid}>
            {services.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => handleCardPress(item.title)}
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
                    {item.price}
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
      {selectedModalData && (
        <ServicesModalCard
          visible={true}
          onClose={closeModal}
          title={selectedModalData.title}
          imageSource={selectedModalData.imageSource}
          price={selectedModalData.price}
          days={selectedModalData.days}
          description={selectedModalData.description}
          additionalDetails={selectedModalData.additionalDetails}
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
});
