import ParallaxScrollView from '@/components/ParallaxScrollView';
import ServiceCard from '@/components/ServiceCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';


export default function HomeScreen() {
  return (
    <ImageBackground style={styles.screen} resizeMode="cover">
      <ParallaxScrollView
        headerBackgroundColor={{ light: 'transparent', dark: 'transparent' }}
        headerImage={<></>}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Greeting Section */}
        <ThemedView style={styles.greetingWrapper}>
          <ThemedView style={styles.greetingTextWrapper}>
            <ThemedText type="subtitle1">Hello</ThemedText>
            <ThemedView style={styles.userNameContainer}>
              <ThemedText type="default">First Name</ThemedText>
              <ThemedText type="default">Last Name</ThemedText>
            </ThemedView>
          </ThemedView>
          <TouchableOpacity style={styles.logoutButton}>
            <IconSymbol
              name="rectangle.portrait.and.arrow.right"
              size={28}
              color="#D11315"
            />
          </TouchableOpacity>
        </ThemedView>

        {/* Logo/Static Visual Section */}
        <ThemedView style={styles.heroImageWrapper}>
          <Image
            source={require('@/assets/images/SWAS-Mobile-Logo-Black.png')}
            style={styles.logoImage}
          />
          <Image
            source={require('@/assets/images/border.png')}
            style={styles.borderImage}
          />
        </ThemedView>

        <View style={styles.divider} />

        {/* Quick Actions */}
        <ThemedView style={styles.quickActionsSection}>
          <ThemedText type="titleSmall">Quick Options</ThemedText>
          <ThemedView style={styles.quickActionsContainer}>
            <TouchableOpacity style={styles.actionCard}>
              <Image
                source={require('@/assets/images/announcement-icon.png')}
                style={styles.actionIcon}
                resizeMode="contain"
              />
              <ThemedText type="option" style={styles.actionLabel}>
                See {'\n'}Announcements
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <Image
                source={require('@/assets/images/appointment-icon.png')}
                style={styles.actionIcon}
                resizeMode="contain"
              />
              <ThemedText type="option" style={styles.actionLabel}>
                Book{'\n'}Appointment
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <Image
                source={require('@/assets/images/track-icon.png')}
                style={styles.actionIcon}
                resizeMode="contain"
              />
              <ThemedText type="option" style={styles.actionLabel}>
                Track{'\n'}Service
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        <View style={styles.divider} />

        {/* Services Offered */}
        <ThemedView style={styles.servicesSection}>
          <View style={styles.servicesHeader}>
            <ThemedText type="titleSmall">Services Offered</ThemedText>
            <TouchableOpacity>
              <ThemedText type="link">View All ➤</ThemedText>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.servicesScroll}>
            {[
              {
                image: require('@/assets/images/home-basic_cleaning.png'),
                name: 'Basic Cleaning',
                price: '₱325 – ₱550',
              },
              {
                image: require('@/assets/images/home-basic_cleaning.png'),
                name: 'Minor Reglue (with basic cleaning)',
                price: '₱450',
              },
              {
                image: require('@/assets/images/home-basic_cleaning.png'),
                name: 'Full Reglue (with basic cleaning)',
                price: '₱575',
              },
              
              {
                image: require('@/assets/images/home-color_renewal.png'),
                name: 'Color Renewal (with basic cleaning)',
                price: '₱600 - ₱700',
              },
            ].map((service, index) => (
              <ServiceCard
                key={index}
                image={service.image}
                name={service.name}
                price={service.price}
              />
            ))}
          </ScrollView>
        </ThemedView>

      </ParallaxScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
  },
  greetingWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingTop: 32,
  },
  greetingTextWrapper: {
    flexDirection: 'row',
  },
  userNameContainer: {
    marginLeft: 12,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  logoutButton: {
    marginTop: 5,
  },
  heroImageWrapper: {
    marginTop: 8,
    alignItems: 'center',
    position: 'relative',
  },
  logoImage: {
    width: 260,
    height: 170,
    resizeMode: 'contain',
    marginBottom: 10,
    marginTop: -30,
  },
  borderImage: {
    width: '100%',
    height: 20,
    resizeMode: 'stretch',
    position: 'absolute',
    bottom: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    opacity: 0.5,
    marginVertical: 12,
    marginHorizontal: 16,
  },
  quickActionsSection: {
    paddingHorizontal: 16,
    marginTop: -5,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginHorizontal: 9,
    gap: 5,
  },
  actionCard: {
    width: 95,
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  actionIcon: {
    width: 58,
    height: 58,
    marginBottom: -25,
    top: -29,
    zIndex: 1,
  },
  actionLabel: {
    textAlign: 'center',
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
servicesScroll: {
  paddingLeft: 16,
  paddingRight: 20,
},

});
