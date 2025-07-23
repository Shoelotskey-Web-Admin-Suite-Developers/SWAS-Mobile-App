import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      {/* Top Image Section with Logo */}
      <View style={styles.imageSection}>
        <Image
          source={require('@/assets/images/welcome-image.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.overlayContent}>
          <Image
            source={require('@/assets/images/SWAS-Mobile-Logo-White.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <ThemedText type="subtitle" style={styles.subtitle}>
            Customer Loyalty App
          </ThemedText>
        </View>
      </View>

      {/* Bottom Curved Card */}
      <View style={styles.curvedCard}>
        <ThemedText type="title" style={styles.welcomeText}>
          WELCOME
        </ThemedText>
        <ThemedText type="default" style={styles.description}>
          Keep your kicks fresh, track your shoe cleaning services here
        </ThemedText>

        <TouchableOpacity style={styles.loginButton}>
          <ThemedText type="defaultSemiBold" style={styles.loginText}>
            Login
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signUpButton}>
          <ThemedText type="defaultSemiBold" style={styles.signUpText}>
            Sign Up
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageSection: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: width * 1.25, // 125% of screen width
    height: '130%',
    top: '-15%',
    left: '-12.5%',
  },
  overlayContent: {
    zIndex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  logo: {
    width: 220,
    height: 80,
  },
  subtitle: {
    marginTop: 10,
    color: '#fff',
  },
  curvedCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 30,
    alignItems: 'center',
    marginTop: -30,
  },
  welcomeText: {
    marginBottom: 10,
  },
  description: {
    textAlign: 'center',
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#cc0000',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 50,
    marginBottom: 15,
  },
  loginText: {
    color: '#fff',
  },
  signUpButton: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 50,
  },
  signUpText: {
    color: '#333',
  },
});
