import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('✅ Connected to socket server:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from socket server');
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const joinLineItem = (lineItemId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('joinLineItem', lineItemId);
    }
  };

  const leaveLineItem = (lineItemId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('leaveLineItem', lineItemId);
    }
  };

  const onDatesUpdated = (callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on('datesUpdated', callback);
    }
  };

  const onLineItemUpdated = (callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on('lineItemUpdated', callback);
    }
  };

  const offDatesUpdated = (callback?: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.off('datesUpdated', callback);
    }
  };

  const offLineItemUpdated = (callback?: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.off('lineItemUpdated', callback);
    }
  };

  return {
    socket: socketRef.current,
    joinLineItem,
    leaveLineItem,
    onDatesUpdated,
    onLineItemUpdated,
    offDatesUpdated,
    offLineItemUpdated,
  };
};