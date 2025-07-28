import AnnouncementCard from '@/components/AnnouncementCard';
import GreetingHeader from '@/components/GreetingHeader';
import HeroLogo from '@/components/HeroLogo';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import QuickActionsRow from '@/components/QuickActionsRow';
import ServicesCarousel from '@/components/ServicesCarousel';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router} from 'expo-router';
import { ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
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
          date="June 10, 2025"
          title="⏰ Early Closing Notice"
          description="The Main Branch will be closed for maintenance. Regular operations resume June 11."
        />

        <View style={styles.divider} />

        <QuickActionsRow />

        <View style={styles.divider} />

        <ThemedView style={styles.servicesSection}>
          <View style={styles.servicesHeader}>
            <ThemedText type="titleSmall">Services Offered</ThemedText>
            <TouchableOpacity onPress={() => router.push('/services')}>
              <ThemedText type="link">View All ></ThemedText>
            </TouchableOpacity>
          </View>
          <ServicesCarousel />
        </ThemedView>
      </ParallaxScrollView>
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
  },
  servicesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
});
