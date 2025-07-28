import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type AppointmentStatus = 'none' | 'pending' | 'confirmed';

type Appointment = {
  branch?: string;
  date?: Date;
  time?: Date;
  status: AppointmentStatus;
};

const getStatusColor = (status: AppointmentStatus) => {
  switch (status) {
    case 'pending':
      return '#FFD700';
    case 'confirmed':
      return '#7CB342';
    default:
      return '#EAEAEA';
  }
};

const formatDate = (d?: Date) =>
  d
    ? `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${d.getFullYear()}`
    : 'DD-MM-YY';

const formatTimeRange = (d?: Date) => {
  if (!d) return 'Select Time';
  const start = new Date(d);
  const end = new Date(d.getTime() + 30 * 60 * 1000);
  const format = (t: Date) =>
    t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${format(start)} - ${format(end)}`;
};

export default function AppointmentCard({ appointment }: { appointment: Appointment }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Current Appointment</Text>
        <Text style={[styles.cardStatus, { backgroundColor: getStatusColor(appointment.status) }]}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </Text>
      </View>
      <Text>🏢   {appointment.branch || 'No branch selected'}</Text>
      <Text>📅   {appointment.date ? formatDate(appointment.date) : 'Date not set'}</Text>
      <Text>🕒   {appointment.time ? formatTimeRange(appointment.time) : 'Time not recorded'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  cardStatus: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    textTransform: 'capitalize',
    fontWeight: '500',
    color: '#000',
    alignSelf: 'flex-start',
  },
});
