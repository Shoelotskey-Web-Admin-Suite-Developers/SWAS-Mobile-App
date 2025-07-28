import {
    formatTimeRange,
    roundTo30Min,
} from '@/utils/date';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

type Props = {
  label?: string;
  value?: Date;
  onChange: (date: Date) => void;
};

export default function TimeInput({ label = 'Select Time*', value, onChange }: Props) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={{ width: '48%' }}>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={() => setShowPicker(true)}>
        <TextInput
          style={styles.input}
          value={formatTimeRange(value)}
          editable={false}
        />
      </Pressable>
      {showPicker && (
        <DateTimePicker
          value={value || roundTo30Min(new Date())}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'android' ? 'spinner' : 'default'}
          onChange={(event, selectedTime) => {
            setShowPicker(false);
            if (selectedTime) onChange(roundTo30Min(selectedTime));
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
