import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
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

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Birthday date picker state
  const [birthday, setBirthday] = useState<Date | undefined>();
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getFullYear()}`;
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
          <Image
            source={require('@/assets/images/SWAS-Mobile-Logo-Black.png')}
            style={styles.titleImage}
            resizeMode="contain"
          />
          <ThemedText type="title" style={{ marginTop: 300, marginBottom: 20, textAlign:'center' }}>
            Sign in
          </ThemedText>

          <ThemedText type="titleSmall" style={styles.label}>Name*</ThemedText>
          <ThemedView style={{flexDirection: 'row', justifyContent:'space-between'}}>
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

          <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={() => router.replace('/(tabs)/home')}>
              <ThemedText type="button" style={{ color: 'white' }}>Enter</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.link} onPress={() => router.replace('/welcome/(auth)/register')}>
              <ThemedText type='default' style={{ textAlign:'center', color: '#CE1616' }}>
                Don't have an account?{'\n'}
                <ThemedText style={{ color: '#CE1616', textDecorationLine: 'underline' }}>
                  Click here to sign up
                </ThemedText>
              </ThemedText>
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
  marginBottom: height * 0.05, // consistent bottom padding across screens
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
  titleImage: {
    width: 250,
    height: 200,
    top: 70,
    position: 'absolute',
    alignSelf: 'center',
  },
  label: {
    fontSize: 18,
  },
});
