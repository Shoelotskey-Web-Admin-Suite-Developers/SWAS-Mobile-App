import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Stack, router } from 'expo-router';

const { width  } = Dimensions.get('window');

export default function WelcomeScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        source={require('@/assets/images/welcome-bg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          {/* Top Section */}
          <View style={styles.topSection}>
            <Image
              source={require('@/assets/images/SWAS-Mobile-Logo-White.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <ThemedText type="title" style={[styles.welcomeText, { color: '#000' }]}>
              WELCOME
            </ThemedText>
            <ThemedText type="default" style={[styles.description, { color: '#000' }]}>
              Keep your kicks fresh, track your shoe cleaning services here
            </ThemedText>

            <TouchableOpacity style={styles.loginButton} onPress={() => router.push( '/welcome/(auth)/login')}>
                <ThemedText type="button" style={styles.loginText}>Login</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signUpButton} onPress={() => router.push('/welcome/(auth)/register')}>
                <ThemedText type="button2" style={styles.signUpText}>Sign Up</ThemedText>
            </TouchableOpacity>

          </View>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width,
    minHeight: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 115,
    paddingHorizontal: 20,
  },
  topSection: {
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 180,
  },
  subtitle: {
    color: '#fff',
    marginTop: 10,
  },
  bottomSection: {
    alignItems: 'center',
    gap: 12,
  },
  welcomeText: {
    marginBottom: 0,
  },
  description: {
    textAlign: 'center',
    marginBottom: 35,
    marginTop: -10,
    width: 200,
  },
  loginButton: {
    alignItems: 'center',
    backgroundColor: '#cc0000',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 50,
    width: 200,
  },
  loginText: {
    color: '#fff',
  },
  signUpButton: {
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 12,
    width: 200,
  },
  signUpText: {
    color: '#333',
  },
});
