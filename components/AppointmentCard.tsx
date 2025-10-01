import ConfirmModal from '@/components/ConfirmModal';
import { deletePendingAppointment } from '@/utils/api/deleteAppointment';
import { getBranches } from '@/utils/api/getBranches';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type AppointmentStatus =
  | 'canceled'
  | 'pending'
  | 'approved'
  | 'none';

type Appointment = {
  branch?: string; // branch_id
  date?: Date | string | null;
  time?: Date | string | null;
  status: AppointmentStatus | string;
};

type Branch = {
  branch_id: string;
  branch_name: string;
  location: string;
};

// Simple in-memory cache to avoid refetching branches for every card
let _branchesCache: Branch[] | null = null;

export default function AppointmentCard({
  appointment,
  onCancelled,
}: {
  appointment: Appointment;
  onCancelled?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<Branch[] | null>(_branchesCache);
  const [branchInfo, setBranchInfo] = useState<Branch | null>(null);
  const [branchesError, setBranchesError] = useState<string | null>(null);
  const [branchesLoading, setBranchesLoading] = useState(false);

  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      if (_branchesCache) {
        setBranches(_branchesCache);
        return;
      }
      setBranchesLoading(true);
      try {
        const res = await getBranches();
        if (!mounted) return;
        _branchesCache = res;
        setBranches(res);
        setBranchesError(null);
      } catch (err: any) {
        if (!mounted) return;
        console.error('Failed to fetch branches in AppointmentCard:', err);
        setBranches([]);
        setBranchesError(err?.message || 'Failed to load branches');
      } finally {
        if (mounted) setBranchesLoading(false);
      }
    };

    fetch();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!branches || !appointment?.branch) {
      setBranchInfo(null);
      return;
    }
    const found = branches.find((b) => b.branch_id === appointment.branch);
    setBranchInfo(found || null);
  }, [branches, appointment?.branch]);

  const getStatusColor = (status: string) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'pending':
        return '#fceea0ff';
      case 'approved':
      case 'confirmed':
        return '#c3fb88ff';
      case 'canceled':
      case 'cancled':
        return '#E0E0E0';
      default:
        return '#E0E0E0';
    }
  };

  const toDate = (d?: Date | string | null) => {
    if (!d) return null;
    const dt = d instanceof Date ? d : new Date(d);
    return isNaN(dt.getTime()) ? null : dt;
  };

  const formatDate = (d?: Date | string | null) => {
    const dt = toDate(d);
    if (!dt) return 'Date not set';
    const datePart = dt.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const weekday = dt.toLocaleDateString(undefined, { weekday: 'long' });
    return `${datePart} (${weekday})`;
  };

  const formatTimeRange = (d?: Date | string | null) => {
    const dt = toDate(d);
    if (!dt) return 'Time not recorded';
    const start = dt;
    const end = new Date(dt.getTime() + 30 * 60 * 1000);
    const format = (t: Date) => t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${format(start)} - ${format(end)}`;
  };

  const isEmpty =
    !appointment.branch &&
    !toDate(appointment.date) &&
    !toDate(appointment.time) &&
    (appointment.status || '').toLowerCase() === 'none';

  // Check if appointment date has passed
  const isAppointmentPast = () => {
    const appointmentDate = toDate(appointment.date);
    if (!appointmentDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
    
    const appointmentDateOnly = new Date(appointmentDate);
    appointmentDateOnly.setHours(0, 0, 0, 0);
    
    return appointmentDateOnly < today;
  };

  const handleConfirmCancel = async () => {
    setShowConfirmCancel(false);
    setLoading(true);
    try {
      await deletePendingAppointment();
      if (!isMounted.current) return;
      if (onCancelled) onCancelled();
    } catch (err: any) {
      console.error(err?.message || 'Failed to cancel appointment');
    } finally {
      setLoading(false);
    }
  };

  if (isEmpty) {
    return (
      <View style={[styles.card, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#888', fontStyle: 'italic' }}>No appointment scheduled</Text>
      </View>
    );
  }

  const branchDisplay = branchInfo
    ? `${branchInfo.branch_name} — ${branchInfo.location}`
    : appointment.branch || 'No branch selected';
  const statusNormalized = (appointment.status || '').toString().toLowerCase();
  
  // Don't show pending or approved appointments if the date has passed
  if (isAppointmentPast() && (statusNormalized === 'pending' || statusNormalized === 'approved')) {
    return (
      <View style={[styles.card, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#888', fontStyle: 'italic' }}>No upcoming appointment</Text>
      </View>
    );
  }
  const statusLabel = statusNormalized
    ? statusNormalized.charAt(0).toUpperCase() + statusNormalized.slice(1)
    : 'None';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Current Appointment</Text>
        <Text style={[styles.cardStatus, { backgroundColor: getStatusColor(statusNormalized) }]}>
          {statusLabel}
        </Text>
      </View>

      <Text style={styles.detail}>🏢  {branchDisplay}</Text>
      {branchesLoading && <Text style={[styles.detail, { color: '#666' }]}>Loading branch info…</Text>}
      {branchesError && <Text style={[styles.detail, { color: '#b00' }]}>{branchesError}</Text>}

      <Text style={styles.detail}>📅  {formatDate(appointment.date)}</Text>
      <Text style={styles.detail}>🕒  {formatTimeRange(appointment.time)}</Text>

      {(statusNormalized === 'pending' || statusNormalized === 'approved') && (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.cancelButton, loading && { opacity: 0.7 }]}
            onPress={() => setShowConfirmCancel(true)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.cancelText}>Cancel</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <ConfirmModal
        visible={showConfirmCancel}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment?"
        confirmLabel="Yes, Cancel"
        cancelLabel="No"
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowConfirmCancel(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    backgroundColor: '#CE1616',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: 'bold',
    color: '#ffffff',
    fontSize: 16,
  },
  cardStatus: {
    borderWidth: 4,
    borderColor: '#CE1616',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    textTransform: 'capitalize',
    fontWeight: '500',
    color: '#000',
    alignSelf: 'flex-start',
    marginVertical: -5,
    marginRight: -5,
  },
  detail: {
    marginTop: 6,
    fontSize: 14,
    color: '#333',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    backgroundColor: '#CE1616',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -15,
  },
  cancelText: {
    color: '#fff',
    fontWeight: '600',
  },
});
