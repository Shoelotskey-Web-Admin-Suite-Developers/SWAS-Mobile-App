import ServiceCard from '@/components/ServiceCard';
import { services } from '@/constants/services';
import { ScrollView, StyleSheet } from 'react-native';

export default function ServicesCarousel() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
    >
      {services.map((service, index) => (
        <ServiceCard key={index} {...service} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingLeft: 16,
    paddingRight: 20,
  },
});
