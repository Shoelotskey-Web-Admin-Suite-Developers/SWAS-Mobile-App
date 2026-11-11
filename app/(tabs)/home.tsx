import AnnouncementCard from '@/components/AnnouncementCard';
import AnnouncementsModal from '@/components/AnnouncementsModal';
import GreetingHeader from '@/components/GreetingHeader';
import HeroLogo from '@/components/HeroLogo';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import PromosModal from '@/components/PromosModal';
import QuickActionsRow from '@/components/QuickActionsRow';
import ServicesCarousel, { HomeService } from '@/components/ServicesCarousel';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useServices } from '@/hooks/useServices';
import { registerPushToken } from '@/utils/notifPermission';


import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [showModal, setShowModal] = useState(false);
  const [showPromosModal, setShowPromosModal] = useState(false);
  const { announcements, loading } = useAnnouncements();
  const { services } = useServices();
  const [currentIndex, setCurrentIndex] = useState(0);

  const formatPrice = (serviceId: string) => {
    const price = services[serviceId]?.service_base_price;
    return price === undefined ? '—' : `₱${price.toLocaleString()}`;
  };

  const homeServices: HomeService[] = [
    {
      image: require('@/assets/images/home-basic_cleaning.png'),
      name: 'Basic Cleaning',
      price: formatPrice('SERVICE-1'),
    },
    {
      image: require('@/assets/images/home-minor_reglue.png'),
      name: 'Minor Reglue (with basic cleaning)',
      price: formatPrice('SERVICE-2'),
    },
    {
      image: require('@/assets/images/home-full_reglue.png'),
      name: 'Full Reglue (with basic cleaning)',
      price: formatPrice('SERVICE-3'),
    },
    {
      image: require('@/assets/images/home-color_renewal.png'),
      name: 'Color Renewal (with basic cleaning)',
      price: formatPrice('SERVICE-4'),
    },
  ];

  useEffect(() => {
    (async () => {
      const result = await registerPushToken();
      console.log('registerPushToken result:', result);
    })();
  }, []);

  // Rotate the announcement every 30 seconds
  useEffect(() => {
    if (!announcements || announcements.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    }, 7000); // 30 seconds

    return () => clearInterval(interval);
  }, [announcements]);

  return (
    <ImageBackground style={styles.screen} resizeMode="cover">
      <ParallaxScrollView
        headerBackgroundColor={{ light: 'transparent', dark: 'transparent' }}
        headerImage={<></>}
        contentContainerStyle={styles.scrollContent}
      >
        <GreetingHeader />
        <HeroLogo />

        <AnnouncementCard
          loading={loading}
          date={announcements && announcements.length > 0 ? announcements[currentIndex].date : ''}
          title={announcements && announcements.length > 0 ? announcements[currentIndex].title : 'No announcements yet.'}
          description={announcements && announcements.length > 0 ? announcements[currentIndex].description : 'There are currently no announcements. Check back later or open the announcements panel.'}
          branchName={announcements && announcements.length > 0 ? announcements[currentIndex].branchName : undefined}
        />

        <View style={styles.divider} />

  <QuickActionsRow onAnnouncementsPress={() => setShowModal(true)} onPromosPress={() => setShowPromosModal(true)} />

        <View style={styles.divider} />

        <ThemedView style={styles.servicesSection}>
          <View style={styles.servicesHeader}>
            <ThemedText type="titleSmall" style={styles.servicesTitle}>Services Offered</ThemedText>
            <TouchableOpacity onPress={() => router.push('/services')}>
              <ThemedText type="link">View All {'>'}</ThemedText>
            </TouchableOpacity>
          </View>
          <ServicesCarousel services={homeServices} />
        </ThemedView>
      </ParallaxScrollView>

  <AnnouncementsModal visible={showModal} onClose={() => setShowModal(false)} />
  <PromosModal visible={showPromosModal} onClose={() => setShowPromosModal(false)} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    opacity: 0.5,
    marginVertical: 0,
    marginHorizontal: 16,
  },
  servicesSection: {
    paddingHorizontal: 0,
    marginTop: -12,
    color: '#00000ff',
  },
  servicesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  servicesTitle: {
    // ensure vertical centering next to the 'View All' link
    lineHeight: 20,
    marginTop: 0,
    marginBottom: 0,
    paddingVertical: 0,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#888',
  },
});
