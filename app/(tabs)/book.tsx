import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function BookingScreen() {
  const [branch, setBranch] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<Date | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const formatDate = (d?: Date) => d ? `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}` : 'DD-MM-YY';
  const formatTimeRange = (d?: Date) => {
    if (!d) return 'Select Time';

    const start = new Date(d);
    const end = new Date(d.getTime() + 30 * 60 * 1000); // +30 mins

    const format = (t: Date) =>
      t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `${format(start)} - ${format(end)}`;
  };

  // Round time to nearest 30 minutes
  const roundTo30Min = (date: Date): Date => {
    const ms = 1000 * 60 * 30;
    return new Date(Math.round(date.getTime() / ms) * ms);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Booking',
          headerTitleAlign: 'left',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTitleStyle: {
            fontFamily: 'InterExtraBold',
            fontSize: 32,
            color: "#D11315",
            marginTop: -30,
          },
          headerBackground: () => (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
              <Image
                source={require('@/assets/images/border.png')}
                style={{
                  width: '100%',
                  height: 20,
                  resizeMode: 'stretch',
                  position: 'absolute',
                  bottom: 0,
                }}
              />
            </View>
          ),
        }}
      />

      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Current Appointment</Text>
            <Text style={styles.cardNone}>None</Text>
          </View>
          <Text>🏢 No branch selected</Text>
          <Text>📅 Date not set</Text>
          <Text>⏱ Time not recorded</Text>
        </View>

        <Text style={styles.label}>Select Branch*</Text>
        <TextInput
          placeholder="Branch Name"
          value={branch}
          onChangeText={setBranch}
          style={styles.input}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: '48%' }}>
            <Text style={styles.label}>Select Date*</Text>
            <Pressable onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={styles.input}
                value={formatDate(date)}
                editable={false}
              />
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={date || new Date()}
                mode="date"
                display={Platform.OS === 'android' ? 'spinner' : 'calendar'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}
          </View>

          <View style={{ width: '48%' }}>
            <Text style={styles.label}>Select Time*</Text>
            <Pressable onPress={() => setShowTimePicker(true)}>
              <TextInput
                style={styles.input}
                value={formatTimeRange(time)}
                editable={false}
              />
            </Pressable>
            {showTimePicker && (
              <DateTimePicker
                value={time || roundTo30Min(new Date())}
                mode="time"
                is24Hour={false}
                display={Platform.OS === 'android' ? 'spinner' : 'default'}
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) {
                    const rounded = roundTo30Min(selectedTime);
                    setTime(rounded);
                  }
                }}
              />
            )}
          </View>
        </View>

        <Text style={styles.label}>Notes (Optional)</Text>
        <TextInput
          multiline
          placeholder="Write Text Here...."
          value={notes}
          onChangeText={setNotes}
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F2F2F2',
    flex: 1,
  },
  header: {
    color: '#CE1616',
    backgroundColor: '#ffffff',
    marginHorizontal: -20,
    marginTop: -20,
    marginBottom: 20,
    paddingTop:30,
    paddingHorizontal: 20,
  },
  checkeredLine: {
    height: 20,
    width: '100%',
    resizeMode: 'stretch',
    
    marginTop:10,

    alignSelf: 'center',  
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: 'bold',
    color: '#CE1616',
    fontSize: 16,
  },
  cardNone: {
    backgroundColor: '#EAEAEA',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderColor: '#E6E6E6',
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#CE1616',
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
