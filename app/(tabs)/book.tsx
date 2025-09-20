import AppointmentCard from '@/components/AppointmentCard';
import DateInput from '@/components/DateInput';
import ErrorModal from '@/components/ErrorSignUpModal';
import HeaderConfig from '@/components/HeaderConfig';
import TimeInput from '@/components/TimeInput';
import { getUnavailability } from '@/utils/api/getUnavailability';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';

import { useAppointmentUpdates } from '@/hooks/useAppointmentUpdates';
import { addAppointment } from '@/utils/api/addAppointment';
import { getAppointment } from '@/utils/api/getAppointment';
import { getBranches } from '@/utils/api/getBranches';

const defaultAppointment = {
  branch: '',
  date: undefined,
  time: undefined,
  status: 'none',
};

export default function BookingScreen() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ItemType<string>[]>([]);
  const [branch, setBranch] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<Date | undefined>();
  const [currentAppointment, setCurrentAppointment] = useState<{
    branch: string;
    date: Date;
    time: Date;
    status: 'none' | 'pending' | 'approved';
  } | null>(null);

  // Error modal state
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 🔹 Hook for real-time updates
  // 🔹 Hook for real-time updates
  const { changes } = useAppointmentUpdates();

  useEffect(() => {
    if (!changes) return;

    // If fullDocument exists (updateLookup), use it directly
    if (changes.fullDocument) {
      const appt = changes.fullDocument;
      const newDate = new Date(appt.date_for_inquiry);
      const newTime = new Date(`${appt.date_for_inquiry}T${appt.time_start}`);
      setCurrentAppointment(prev => ({
        ...prev,
        branch: appt.branch_id || prev?.branch || '',
        date: newDate,
        time: newTime,
        status: (appt.status || prev?.status || 'pending').toLowerCase() as 'pending' | 'approved' | 'none',
      }));
      return;
    }

    // For update operations with updatedFields only
    const updatedFields = changes.updateDescription?.updatedFields;
    if (updatedFields) {
      setCurrentAppointment(prev => {
        if (!prev) return prev; // nothing to update

        const updated = { ...prev };

        for (const [key, value] of Object.entries(updatedFields)) {
          if (key === 'status') updated.status = (value as string).toLowerCase() as 'pending' | 'approved' | 'none';
          if (key === 'branch_id') updated.branch = value as string;
          if (key === 'date_for_inquiry') updated.date = new Date(value as string);
          if (key === 'time_start' && updated.date) {
            updated.time = new Date(`${updated.date.toISOString().split('T')[0]}T${(value as string)}`);
          }
        }

        return updated;
      });
    }
  }, [changes]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const branches = await getBranches();
        const options: ItemType<string>[] = branches.map((b: any) => ({
          label: b.branch_name,
          value: b.branch_id,
        }));
        setItems(options);
      } catch (err) {
        console.error("Failed to fetch branches:", err);
      }
    };

    fetchBranches();
  }, []);

  const safeParseDateTime = (dateInput: any, timeInput?: string) => {
    if (!dateInput) return null;
    const dateObj = new Date(dateInput);
    if (isNaN(dateObj.getTime())) return null;
    const dateOnly = dateObj.toISOString().split("T")[0];

    if (!timeInput) return new Date(`${dateOnly}T00:00`);

    const hhmm = timeInput.trim().slice(0,5);
    return new Date(`${dateOnly}T${hhmm}`);
  };

  const fetchCurrentAppointment = useCallback(async () => {
    try {
      const appointment = await getAppointment();
      if (!appointment) {
        setCurrentAppointment(null);
        return;
      }

      const dateVal = safeParseDateTime(appointment.date_for_inquiry);
      const timeVal = safeParseDateTime(appointment.date_for_inquiry, appointment.time_start);

      setCurrentAppointment(
        dateVal && timeVal
          ? {
              branch: appointment.branch_id || appointment.branch || "",
              date: dateVal,
              time: timeVal,
              status: (appointment.status || 'pending').toLowerCase() as 'pending' | 'approved' | 'none',
            }
          : null
      );
    } catch (err: any) {
      const msg = (err?.message || "").toLowerCase();
      if (msg.includes("no upcoming") || msg.includes("not found")) {
        setCurrentAppointment(null);
        return;
      }
      console.error("Failed to fetch current appointment:", err);
    }
  }, []);

  useEffect(() => {
    fetchCurrentAppointment();
  }, [fetchCurrentAppointment]);

  const handleBookAppointment = async () => {
    if (!branch || !date || !time) {
      setErrorMessage("Please complete all required fields.");
      setShowError(true);
      return;
    }

    const { data, error } = await getUnavailability(branch, date, time);

    if (error) {
      setErrorMessage(error);
      setShowError(true);
      return;
    }

    if (Array.isArray(data) && data.length > 0) {
      const unav = data[0];
      const formattedDate = new Date(unav.date_unavailable).toLocaleDateString([], {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      let msg = "";
      if (unav.type === "Full Day") {
        msg = `We’re sorry, but the branch is unavailable on ${formattedDate} for the whole day. Reason: ${unav.note || "No reason provided."}`;
      } else {
        const baseDate = new Date(unav.date_unavailable);
        const start = unav.time_start
          ? new Date(`${baseDate.toISOString().split("T")[0]}T${unav.time_start}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "the start of the day";
        const end = unav.time_end
          ? new Date(`${baseDate.toISOString().split("T")[0]}T${unav.time_end}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "the end of the day";
        msg = `We’re sorry, but the time slot from ${start} to ${end} on ${formattedDate} is unavailable. Reason: ${unav.note || "No reason provided."}`;
      }

      setErrorMessage(msg);
      setShowError(true);
      return;
    }

    const newAppointment = { branch, date, time, status: "pending" as const };
    setCurrentAppointment(newAppointment);

    try {
      await addAppointment({
        branch_id: branch,
        date_for_inquiry: date.toISOString().split('T')[0],
        time_start: time.toTimeString().slice(0,5),
        time_end: new Date(time.getTime() + 30*60000).toTimeString().slice(0,5),
      });

      await fetchCurrentAppointment();

      setBranch(null);
      setDate(undefined);
      setTime(undefined);

    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create appointment");
      setShowError(true);
    }
  };

  const appointment = currentAppointment || defaultAppointment;
  const isBookingDisabled = appointment.status === 'pending' || appointment.status === 'approved';

  return (
    <>
      <HeaderConfig title="Booking" />
      <View style={styles.container}>
        <AppointmentCard appointment={appointment} onCancelled={fetchCurrentAppointment} />

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

        <TouchableOpacity
          style={[
            styles.button,
            isBookingDisabled && { backgroundColor: '#A0A0A0' }
          ]}
          onPress={handleBookAppointment}
          disabled={isBookingDisabled}
        >
          <Text style={styles.buttonText}>Book Appointment</Text>
        </TouchableOpacity>

        {isBookingDisabled && (
          <Text style={styles.disabledText}>
            Cannot book a new appointment because you already have one {appointment.status} appointment.
          </Text>
        )}
      </View>

      <ErrorModal
        visible={showError}
        onClose={() => setShowError(false)}
        title="Booking Error"
        message={errorMessage}
        buttonLabel="Back"
      />
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
  disabledText: {
    marginTop: 8,
    color: '#939393ff',
    fontWeight: '500',
    textAlign: 'center',
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
