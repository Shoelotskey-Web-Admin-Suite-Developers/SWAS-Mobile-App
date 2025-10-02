// src/hooks/useAppointmentUpdates.ts
import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from 'react-native';
import { io, Socket } from "socket.io-client";

// Derive socket base URL from env; strip trailing slashes and optional /api suffix.
const RAW = (process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.254.109:5001').replace(/\/$/, '');
const BASE_URL = RAW.replace(/\/api$/i, '');

interface ChangeEvent {
  operationType: string;
  documentKey: { _id: string };
  fullDocument?: any;
  updateDescription?: {
    updatedFields: Record<string, any>;
    removedFields: string[];
  };
}

export function useAppointmentUpdates() {
  const [changes, setChanges] = useState<ChangeEvent | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const retriesRef = useRef(0);
  const changeHandlerRef = useRef<typeof setChanges | null>(null);

  useEffect(() => {
    changeHandlerRef.current = setChanges;

    const connectSocket = () => {
      if (socketRef.current) return;
      console.log('⚙️ attempting socket connect to', BASE_URL);
      const socket: Socket = io(BASE_URL, {
        transports: ["websocket", "polling"],
        withCredentials: true,
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelayMax: 10000,
      });
      socketRef.current = socket;

      const onConnect = () => {
        retriesRef.current = 0;
        console.log("🔌 Connected to socket server:", socket.id);
      };

      const onDisconnect = (reason: any) => {
        console.log("❌ Disconnected from socket server", reason);
        // leave socketRef so reconnection can happen automatically
        // but if socket won't reconnect, null it later from cleanup
      };

      const onError = (err: any) => {
        console.error("❌ Socket connect error (appointments):", err?.message || err);
      };

      const onUpdate = (change: ChangeEvent) => {
        if (!change || !change.operationType) return;
        // use handler ref to avoid stale closure
        try {
          console.log("📢 Appointment change received:", change.operationType, change.documentKey?._id);
          changeHandlerRef.current?.(change);
        } catch (e) {
          console.error('Failed to handle appointment change', e);
        }
      };

      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("connect_error", onError);
      socket.on("appointmentUpdated", onUpdate);
    };

    connectSocket();

    // Reconnect when app comes to foreground (helps after long backgrounding on mobile)
    const appStateListener = (next: AppStateStatus) => {
      if (next === 'active') {
        // ensure socket exists or try reconnect
        if (!socketRef.current || socketRef.current.disconnected) {
          // clear previous ref so connectSocket creates a fresh socket
          socketRef.current = null;
          connectSocket();
        }
      }
    };
    const sub = AppState.addEventListener('change', appStateListener);

    return () => {
      try { sub.remove(); } catch (e) {}
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      changeHandlerRef.current = null;
    };
  }, []);

  return { changes };
}
