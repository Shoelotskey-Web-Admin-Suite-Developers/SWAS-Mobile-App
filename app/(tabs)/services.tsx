import { View, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import React from 'react';

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

export default function ServicesScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="titleSmall" style={styles.title}>
          Services
        </ThemedText>

        <View style={styles.headerBar} />
        <ThemedText type="subtitle1" style={styles.sectionTitle}>
          Details and Price
        </ThemedText>

        <View style={styles.grid}>
          {services.map((item, index) => (
            <TouchableOpacity key={index} style={styles.card} onPress={() => { /* handle tap */ }}>
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
  title: {
    marginBottom: 8,
    color: '#D11315',
  },
  headerBar: {
    height: 10,
    backgroundColor: '#D11315',
    marginVertical: 5,
    borderRadius: 4,
    width: '100%',
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
