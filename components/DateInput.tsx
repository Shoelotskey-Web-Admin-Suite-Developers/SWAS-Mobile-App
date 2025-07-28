import { formatDate } from '@/utils/date';
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

export default function DateInput({ label = 'Select Date*', value, onChange }: Props) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={{ width: '48%' }}>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={() => setShowPicker(true)}>
        <TextInput
          style={styles.input}
          value={formatDate(value)}
          editable={false}
        />
      </Pressable>
      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          minimumDate={new Date()}
          display={Platform.OS === 'android' ? 'calendar' : 'spinner'}
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) onChange(selectedDate);
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
