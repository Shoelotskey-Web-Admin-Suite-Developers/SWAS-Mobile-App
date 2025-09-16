import ErrorModal from '@/components/ErrorSignUpModal';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState<Date | undefined>();
  const [showPicker, setShowPicker] = useState(false);
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getFullYear()}`;
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName || !birthday) {
      setErrorMessage('Please fill in all required fields.');
      setShowError(true);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cust_name: `${firstName.trim()} ${lastName.trim()}`,
          cust_bdate: birthday.toISOString(),
          cust_address: address || undefined,
          cust_contact: phoneNumber || undefined,
          cust_email: email || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Success → redirect to login
        router.replace('/welcome/(auth)/login');
      } else {
        // Show backend error
        setErrorMessage(data.error || 'Registration failed.');
        setShowError(true);
      }
    } catch (err) {
      console.error('Network error:', err);
      setErrorMessage('Network or server error. Please try again.');
      setShowError(true);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <ThemedText type="title" style={{ marginTop: 55, marginBottom: 20, textAlign: 'center' }}>
            Sign Up
          </ThemedText>

          <ThemedText type="titleSmall" style={styles.label}>Name*</ThemedText>
          <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TextInput
              style={styles.inputDouble}
              placeholder="First Name"
              autoCapitalize="words"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.inputDouble}
              placeholder="Last Name"
              autoCapitalize="words"
              value={lastName}
              onChangeText={setLastName}
            />
          </ThemedView>

          <ThemedText type="titleSmall" style={styles.label}>Birthdate*</ThemedText>
          <Pressable onPress={() => setShowPicker(true)}>
            <TextInput
              style={styles.input}
              placeholder="DD-MM-YYYY"
              value={formatDate(birthday)}
              editable={false}
              pointerEvents="none"
            />
          </Pressable>

          {showPicker && (
            <DateTimePicker
              value={birthday || new Date()}
              mode="date"
              display={Platform.OS === 'android' ? 'spinner' : 'calendar'}
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) setBirthday(selectedDate);
              }}
              maximumDate={new Date()}
            />
          )}

          <ThemedText type="titleSmall" style={styles.label}>Address</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Brgy/Village - City - Province"
            autoCapitalize="words"
            value={address}
            onChangeText={setAddress}
          />

          <ThemedText type="titleSmall" style={styles.label}>Phone Number</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="0000-000-0000"
            keyboardType="phone-pad"
            autoComplete="tel"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          <ThemedText type="titleSmall" style={styles.label}>Email</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="sample@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <ThemedText type="button" style={{ color: 'white' }}>Enter</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.link} onPress={() => router.replace('/welcome/(auth)/login')}>
              <ThemedText type="default" style={{ textAlign: 'center', color: '#CE1616' }}>
                Already have an account?{'\n'}
                <ThemedText style={{ color: '#CE1616', textDecorationLine: 'underline' }}>
                  Click here to login
                </ThemedText>
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      <ErrorModal
        visible={showError}
        onClose={() => setShowError(false)}
        title="Error Signing Up"
        message={errorMessage}
        buttonLabel="Back"
      />
    </>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: 'center', backgroundColor: 'white' },
  container: { padding: 24, paddingBottom: 50, justifyContent: 'center', flex: 1, paddingHorizontal: 40 },
  input: { width: '100%', borderColor: '#212934', borderBottomWidth: 1, padding: 10, marginBottom: 15, borderRadius: 6, fontFamily: 'Inter', backgroundColor: 'transparent' },
  inputDouble: { width: '48%', borderColor: '#212934', borderBottomWidth: 1, padding: 10, marginBottom: 15, borderRadius: 6, fontFamily: 'Inter', backgroundColor: 'transparent' },
  footer: { marginTop: 'auto', alignItems: 'center', marginBottom: height * 0.05, gap: 16 },
  button: { backgroundColor: '#CE1616', paddingVertical: 12, borderRadius: 50, alignItems: 'center', width: '100%', elevation: 5 },
  link: { flexDirection: 'row', alignSelf: 'center' },
  label: { fontSize: 18 },
});
