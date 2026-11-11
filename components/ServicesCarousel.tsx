import ServiceCard from '@/components/ServiceCard';
import { ImageSourcePropType, ScrollView, StyleSheet } from 'react-native';

export type HomeService = {
  image: ImageSourcePropType;
  name: string;
  price: string;
};

type Props = {
  services: HomeService[];
};

export default function ServicesCarousel({ services }: Props) {
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
