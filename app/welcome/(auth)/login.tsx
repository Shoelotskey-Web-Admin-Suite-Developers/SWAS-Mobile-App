import { ThemedText } from '@/components/ThemedText';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    ImageBackground,
    Platform,
    Pressable,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
          <ThemedText type="title" style={{ marginTop: 250 }}>
            Sign in
          </ThemedText>

          <ThemedText type="titleSmall" style={styles.label}>Name</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <ThemedText type="titleSmall" style={styles.label}>Birthday</ThemedText>
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
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) {
                  setBirthday(selectedDate);
                }
              }}
              maximumDate={new Date()}
            />
          )}

          <TouchableOpacity style={styles.button} onPress={() => router.replace('/(tabs)/home')}>
            <ThemedText type="button" style={{ color: 'white' }}>Enter</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.link} onPress={() => router.push('/register')}>
            <ThemedText type='default'>Don't have an account? </ThemedText>
            <ThemedText type='defaultSemiBold'>Click here to sign up</ThemedText>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </>
  );
}


const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    padding: 24,
    paddingBottom: 50,
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 40,
  },
  input: {
    borderColor: '#E3E3E8',
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 6,
    fontFamily: 'Quicksand',
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#145E4D',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 55,
    elevation: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#666',
    marginRight: 8,
    borderRadius: 4,
  },
  checkedBox: {
    backgroundColor: '#A69DDA',
  },
  checkboxlabel: {
    color: '#AFAFAF',
  },
  checkedBoxlabel: {
    color: '#2A3435',
  },
  link: {
    flexDirection: 'row',
    marginTop: 16,
    alignSelf: 'center',
  },
  label: {
    fontSize: 18,
  },
  titleImage: {
    width: 300,
    height: 200,
    marginBottom: 50,
    top: 70,
    position: 'absolute',
    alignSelf: 'center',
  },
});
