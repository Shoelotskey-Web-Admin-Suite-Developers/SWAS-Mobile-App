import AppointmentCard from '@/components/AppointmentCard';
import DateInput from '@/components/DateInput';
import HeaderConfig from '@/components/HeaderConfig';
import TimeInput from '@/components/TimeInput';
import {
  roundTo30Min
} from '@/utils/date';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const branchOptions = [
  { label: 'SM Grand', value: 'SM Grand' },
  { label: 'SM Valenzuela', value: 'SM Valenzuela' },
  { label: 'Valenzuela', value: 'Valenzuela' },
];

const defaultAppointment = {
  branch: '',
  date: undefined,
  time: undefined,
  status: 'none',
};

export default function BookingScreen() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(branchOptions);
  const [branch, setBranch] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<Date | undefined>();
  const [currentAppointment, setCurrentAppointment] = useState<{
    branch: string;
    date: Date;
    time: Date;
    status: 'none' | 'pending' | 'confirmed';
  } | null>(null);

  useEffect(() => {
    const dummy = {
      branch: 'SM Grand',
      date: new Date(2025, 6, 8),
      time: roundTo30Min(new Date(2025, 6, 8, 10, 0)),
      status: 'pending',
    };
    setCurrentAppointment(dummy);
  }, []);

  useEffect(() => {
    if (!currentAppointment?.date || !currentAppointment?.time) return;

    const { date, time } = currentAppointment;

    const appointmentDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes()
    );

    if (appointmentDateTime < new Date()) {
      setCurrentAppointment(defaultAppointment);
    }
  }, [currentAppointment]);

  const handleBookAppointment = () => {
    if (!branch || !date || !time) {
      alert('Please complete all required fields.');
      return;
    }

    const newAppointment = {
      branch,
      date,
      time,
      notes: notes.trim() || '',
      status: 'pending',
    };

    setCurrentAppointment(newAppointment);

    console.log('📦 Send this to backend:', {
      userId: 'TODO_USER_ID',
      ...newAppointment,
    });

    setBranch('');
    setDate(undefined);
    setTime(undefined);
    setNotes('');
  };

  const appointment = currentAppointment || defaultAppointment;

  return (
    <>
      <HeaderConfig title="Booking" />

      <View style={styles.container}>
        <AppointmentCard appointment={appointment} />

        <Text style={styles.label}>Select Branch*</Text>
        <View style={styles.selectWrapper}>
          <DropDownPicker
            open={open}
            value={branch}
            items={items}
            setOpen={setOpen}
            setValue={setBranch}
            setItems={setItems}
            placeholder="Select a branch..."
            style={styles.dropdown}
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <DateInput value={date} onChange={setDate} />
          <TimeInput value={time} onChange={setTime} />
        </View>

        <Text style={styles.label}>Notes (Optional)</Text>
        <TextInput
          multiline
          placeholder="Write Text Here...."
          value={notes}
          onChangeText={setNotes}
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        />

        <TouchableOpacity style={styles.button} onPress={handleBookAppointment}>
          <Text style={styles.buttonText}>
            {appointment.branch && appointment.status !== 'none' ? 'Edit Appointment' : 'Book Appointment'}
          </Text>
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
  selectWrapper: {
    borderColor: '#E6E6E6',
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: 'white',
    padding: 0,
  },
  dropdown: {
    borderColor: '#E6E6E6',
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: 'white',
  },
});
