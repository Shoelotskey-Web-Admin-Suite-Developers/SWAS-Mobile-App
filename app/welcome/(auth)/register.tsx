import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import ErrorModal from '@/components/ErrorSignUpModal';
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

export default function LoginScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState<Date | undefined>();
  const [showPicker, setShowPicker] = useState(false);
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [showError, setShowError] = useState(false); // ⛔ Error modal control

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getFullYear()}`;
  };

  const handleSubmit = () => {
    // Mock validation
    const isExisting = true; // Simulate conflict
    if (isExisting) {
      setShowError(true);
      return;
    }

    router.replace('/(tabs)/home');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        // source={require('@/assets/images/loginBG.jpg')}
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
                if (selectedDate) {
                  setBirthday(selectedDate);
                }
              }}
              maximumDate={new Date()}
            />
          )}

          <ThemedText type="titleSmall" style={styles.label}>Address</ThemedText>
          <ThemedView>
            <TextInput
              style={styles.input}
              placeholder="Brgy/Village - City - Province"
              autoCapitalize="words"
              value={address}
              onChangeText={setAddress}
            />
          </ThemedView>

          <ThemedText type="titleSmall" style={styles.label}>Phone Number</ThemedText>
          <ThemedView>
            <TextInput
              style={styles.input}
              placeholder="0000-000-0000"
              keyboardType="phone-pad"
              autoComplete="tel"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </ThemedView>

          <ThemedText type="titleSmall" style={styles.label}>Email</ThemedText>
          <ThemedView>
            <TextInput
              style={styles.input}
              placeholder="sample@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
            />
          </ThemedView>

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
        message="The name entered is already used by an existing account. Try logging in with the said username along with your corresponding birthdate."
        buttonLabel="Back"
      />
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  container: {
    padding: 24,
    paddingBottom: 50,
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 40,
  },
  input: {
    width: '100%',
    borderColor: '#212934',
    borderBottomWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 6,
    fontFamily: 'Inter',
    backgroundColor: 'transparent',
  },
  inputDouble: {
    width: '48%',
    borderColor: '#212934',
    borderBottomWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 6,
    fontFamily: 'Inter',
    backgroundColor: 'transparent',
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    marginBottom: height * 0.05,
    gap: 16,
  },
  button: {
    backgroundColor: '#CE1616',
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: 'center',
    width: '100%',
    elevation: 5,
  },
  link: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  label: {
    fontSize: 18,
  },
  titleImage: {
    width: 250,
    height: 200,
    marginBottom: 50,
    top: 70,
    position: 'absolute',
    alignSelf: 'center',
  },
});
