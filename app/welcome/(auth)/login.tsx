import ErrorModal from '@/components/ErrorSignUpModal'; // ✅ import modal
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { saveUserId } from "@/utils/session";
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { height } = Dimensions.get('window');
const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');

export default function LoginScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState<Date | undefined>();
  const [showPicker, setShowPicker] = useState(false);

  // 🔴 Error modal state
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getFullYear()}`;
  };

  const handleLogin = async () => {
    if (!firstName || !lastName || !birthday) {
      setErrorMessage("⚠️ Please fill in all required fields");
      setShowError(true);
      return;
    }

    try {
  const res = await fetch(`${API_BASE_URL}/api/customers/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          cust_bdate: birthday.toISOString(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.userId) {
          await saveUserId(data.userId);
          console.log("Login response:", data);
        }
        router.replace("/(tabs)/home");
      } else {
        setErrorMessage(data.error || "❌ Login failed");
        setShowError(true);
      }
    } catch (err) {
      console.error("❌ Network error:", err);
      setErrorMessage("⚠️ Network or server error");
      setShowError(true);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground style={styles.background} resizeMode="cover">
        <View style={styles.container}>
          <Image
            source={require('@/assets/images/SWAS-Mobile-Logo-Black.png')}
            style={styles.titleImage}
            resizeMode="contain"
          />
          <ThemedText
            type="title"
            style={{ marginTop: 300, marginBottom: 20, textAlign: 'center' }}
          >
            Sign in
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

          <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <ThemedText type="button" style={{ color: 'white' }}>Enter</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.link}
              onPress={() => router.replace('/welcome/(auth)/register')}
            >
              <ThemedText type="default" style={{ textAlign: 'center', color: '#CE1616' }}>
                Don't have an account?{'\n'}
                <ThemedText style={{ color: '#CE1616', textDecorationLine: 'underline' }}>
                  Click here to sign up
                </ThemedText>
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* ✅ Error modal at bottom */}
      <ErrorModal
        visible={showError}
        onClose={() => setShowError(false)}
        title="Login Error"
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
  titleImage: { width: 250, height: 200, top: 70, position: 'absolute', alignSelf: 'center' },
  label: { fontSize: 18 },
});
