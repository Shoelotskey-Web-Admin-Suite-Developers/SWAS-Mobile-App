import AnnouncementCard from '@/components/AnnouncementCard';
import GreetingHeader from '@/components/GreetingHeader';
import HeroLogo from '@/components/HeroLogo';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import QuickActionsRow from '@/components/QuickActionsRow';
import ServicesCarousel from '@/components/ServicesCarousel';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AnnouncementsModal from '@/components/AnnouncementsModal';
import { useAnnouncements } from '@/hooks/useAnnouncements';

import { router } from 'expo-router';
import { ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const [showModal, setShowModal] = useState(false);
  const { announcements, loading } = useAnnouncements();
  const [currentIndex, setCurrentIndex] = useState(0);

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

        {!loading && announcements.length > 0 && (
          <AnnouncementCard
            date={announcements[currentIndex].date}
            title={announcements[currentIndex].title}
            description={announcements[currentIndex].description}
          />
        )}

        {!loading && announcements.length === 0 && (
          <ThemedText type="subtitle2" style={styles.emptyText}>
            No announcements yet.
          </ThemedText>
        )}

        <View style={styles.divider} />

        <QuickActionsRow onAnnouncementsPress={() => setShowModal(true)} />

        <View style={styles.divider} />

        <ThemedView style={styles.servicesSection}>
          <View style={styles.servicesHeader}>
            <ThemedText type="titleSmall" style={styles.servicesSection}>Services Offered</ThemedText>
            <TouchableOpacity onPress={() => router.push('/services')}>
              <ThemedText type="link">View All ></ThemedText>
            </TouchableOpacity>
          </View>
          <ServicesCarousel />
        </ThemedView>
      </ParallaxScrollView>

      <AnnouncementsModal visible={showModal} onClose={() => setShowModal(false)} />
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
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#888',
  },
});
