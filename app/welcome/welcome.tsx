import { ThemedText } from '@/components/ThemedText';
import { Stack, router } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';

const { height, width } = Dimensions.get('window');

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
  paddingHorizontal: 20,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

    logo: {
    width: width * 0.6,
    height: height * 0.2,
  },
  subtitle: {
    color: '#fff',
    marginTop: 10,
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 100,
    gap: 12,
  },
  welcomeText: {
    marginBottom: 0,
  },
  description: {
    width: width * 0.8,
    marginTop: -10,
    marginBottom: 35,
    textAlign: 'center',
  },
  loginButton: {
    alignItems: 'center',
    backgroundColor: '#cc0000',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 50,
    width: width * 0.7,
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
    
  width: width * 0.7,
  },
  signUpText: {
    color: '#333',
  },
});
