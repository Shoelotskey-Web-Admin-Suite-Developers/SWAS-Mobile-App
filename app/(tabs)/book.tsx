import AppointmentCard from '@/components/AppointmentCard';
import DateInput from '@/components/DateInput';
import ErrorModal from '@/components/ErrorSignUpModal';
import HeaderConfig from '@/components/HeaderConfig';
import TimeInput from '@/components/TimeInput';
import { getUnavailability } from '@/utils/api/getUnavailability';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';

import { useAppointmentUpdates } from '@/hooks/useAppointmentUpdates';
import { addAppointment } from '@/utils/api/addAppointment';
import { checkCanceledSlot } from '@/utils/api/checkCanceledSlot';
import { getAppointment } from '@/utils/api/getAppointment';
import { getBranches } from '@/utils/api/getBranches';
import { getUserId } from '@/utils/session';

const defaultAppointment = {
  appointment_id: undefined as string | undefined,
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
    appointment_id?: string;
    branch: string;
    date: Date;
    time: Date;
    status: 'none' | 'pending' | 'approved' | 'canceled';
  } | null>(null);

  // Error modal state
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 🔹 Hook for real-time updates
  // 🔹 Hook for real-time updates
  const { changes } = useAppointmentUpdates();
  const [userId, setUserId] = useState<string | null>(null);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const id = await getUserId();
        if (mounted) {
          setUserId(id);
          userIdRef.current = id;
        }
      } catch (e) {
        console.warn('Failed to load user id for filtering appointment updates');
      }
    })();
    return () => { mounted = false; };
  }, []);

  // (Effect moved below fetchCurrentAppointment)

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

      if (appointment.status && appointment.status.toLowerCase() === 'canceled') {
        setCurrentAppointment(null);
      } else {
        setCurrentAppointment(
          dateVal && timeVal
            ? {
                appointment_id: appointment.appointment_id,
                branch: appointment.branch_id || appointment.branch || "",
                date: dateVal,
                time: timeVal,
                status: (appointment.status || 'pending').toLowerCase() as any,
              }
            : null
        );
      }
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

  // Socket-driven updates effect (now placed after fetchCurrentAppointment is defined)
  // Refs to avoid re-running effect when local state changes
  const currentAppointmentRef = useRef(currentAppointment);
  const lastProcessedChangeRef = useRef<string | null>(null);

  // Keep the ref in sync with state
  useEffect(() => {
    currentAppointmentRef.current = currentAppointment;
  }, [currentAppointment]);

  useEffect(() => {
    if (!changes) return;

    // Create a stable signature for this change to avoid reprocessing the same stream event
    const sigParts = [changes.operationType, changes.documentKey?._id || 'noid'];
    if (changes.updateDescription?.updatedFields) {
      try {
        sigParts.push(JSON.stringify(changes.updateDescription.updatedFields));
      } catch (e) {
        sigParts.push('u');
      }
    }
    const sig = sigParts.join(':');
    if (lastProcessedChangeRef.current === sig) return;
    lastProcessedChangeRef.current = sig;

    if (changes.operationType === 'delete') {
      // Refresh from server to ensure state sync
      fetchCurrentAppointment();
      return;
    }

    const appt = changes.fullDocument;
    if (!appt) return;

    const changeCustomerId = appt.customer_id || appt.cust_id || appt.user_id || appt.customerId;
    if (userIdRef.current && changeCustomerId && changeCustomerId !== userIdRef.current) return;

    // If we already track a different appointment id, ignore unrelated changes
    if (currentAppointmentRef.current?.appointment_id && appt.appointment_id && appt.appointment_id !== currentAppointmentRef.current.appointment_id) return;

    const rawDate = appt.date_for_inquiry || appt.date || appt.dateForInquiry;
    const rawTime = appt.time_start || appt.timeStart || appt.start_time;
    const normalizedStatus = (appt.status || '').toLowerCase();
    console.log('[Socket] Appointment fullDocument change status=', normalizedStatus);

    if (normalizedStatus === 'canceled') {
      setCurrentAppointment(null);
      currentAppointmentRef.current = null;
      return;
    }

    if (rawDate && rawTime) {
      const newDate = new Date(rawDate);
      const newTime = new Date(`${newDate.toISOString().split('T')[0]}T${rawTime}`);
      const newState = {
        appointment_id: appt.appointment_id || currentAppointmentRef.current?.appointment_id,
        branch: appt.branch_id || appt.branch || currentAppointmentRef.current?.branch || '',
        date: isNaN(newDate.getTime()) ? (currentAppointmentRef.current?.date as any) : newDate,
        time: isNaN(newTime.getTime()) ? (currentAppointmentRef.current?.time as any) : newTime,
        status: (normalizedStatus as any) || (currentAppointmentRef.current?.status as any) || 'pending',
      };
      // Update both state and ref synchronously to avoid triggering the effect again from state change
      currentAppointmentRef.current = newState as any;
      setCurrentAppointment(newState as any);
    }
  }, [changes]);

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

    try {
      // Pre-check canceled slot reuse
      const dateStr = date.toISOString().split('T')[0];
      const startStr = time.toTimeString().slice(0,5);
      const canceledCheck = await checkCanceledSlot(branch, dateStr, startStr);
      if (canceledCheck.blocked) {
        setErrorMessage(canceledCheck.reason || "You previously canceled this slot. Please choose a different time or date.");
        setShowError(true);
        return;
      }

      await addAppointment({
        branch_id: branch,
        date_for_inquiry: dateStr,
        time_start: startStr,
        time_end: new Date(time.getTime() + 30*60000).toTimeString().slice(0,5),
      });

      // Only update UI after successful API response
  const newAppointment = { appointment_id: undefined, branch, date, time, status: "pending" as const };
      setCurrentAppointment(newAppointment);

      await fetchCurrentAppointment();

      setBranch(null);
      setDate(undefined);
      setTime(undefined);

    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create appointment");
      setShowError(true);
    }
  };

  // Helper function to check if appointment date has passed
  const isAppointmentInPast = (appointmentDate?: Date) => {
    if (!appointmentDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    const apptDateOnly = new Date(appointmentDate);
    apptDateOnly.setHours(0, 0, 0, 0);
    
    return apptDateOnly < today;
  };

  const appointment = currentAppointment || defaultAppointment;
  
  // Only disable booking if there's a future/today appointment that's pending or approved
  const isBookingDisabled = 
    (appointment.status === 'pending' || appointment.status === 'approved') &&
    !isAppointmentInPast(appointment.date);

  return (
    <>
      <HeaderConfig title="Booking" />
      <View style={styles.container}>
  <AppointmentCard appointment={appointment} onCanceled={fetchCurrentAppointment} />

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
            Cannot book a new appointment because you already have an upcoming {appointment.status} appointment.
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
