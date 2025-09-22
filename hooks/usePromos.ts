import { getPromos } from '@/utils/api/getPromos';
import { getUserId } from '@/utils/session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export type Promo = {
  id: string;
  title: string;
  description: string;
  duration?: string;
  branchName?: string;
};

const MOCK_PROMOS: Promo[] = [];
const STORAGE_KEY_BASE = 'READ_PROMOS';

export function usePromos() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    loadPromos();
    loadReadIds();
  }, []);

  // realtime updates via socket
  useEffect(() => {
  const API_BASE = (process.env.EXPO_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
  const socketUrl = API_BASE.replace(/\/api\/?$/, '');
    let socket: Socket | null = null;

    try {
      socket = io(socketUrl, { transports: ['websocket', 'polling'] });
      socket.on('connect', () => console.log('🔌 promos socket connected', socket?.id));
      socket.on('promosUpdated', (change: any) => {
        console.log('🔔 promosUpdated', change);
        loadPromos();
      });
      socket.on('disconnect', () => console.log('❌ promos socket disconnected'));
    } catch (err) {
      console.warn('usePromos: socket connection failed', err);
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const loadReadIds = async () => {
    const userId = await getUserId();
    const key = userId ? `${STORAGE_KEY_BASE}_${userId}` : STORAGE_KEY_BASE;
    const json = await AsyncStorage.getItem(key);
    const parsed: string[] = json ? JSON.parse(json) : [];
    setReadIds(parsed);
    setUnreadCount(promos.filter(p => !parsed.includes(p.id)).length);
  };

  const loadPromos = async () => {
    try {
      const res = await getPromos();
      if (res) setPromos(res.length ? res : MOCK_PROMOS);
      else setPromos(MOCK_PROMOS);
    } catch (err) {
      console.warn('usePromos failed', err);
      setPromos(MOCK_PROMOS);
    } finally {
      setLoading(false);
    }
  };

  // Prune stored read promo IDs that no longer exist on the server
  useEffect(() => {
    const prune = async () => {
      const userId = await getUserId();
      const key = userId ? `${STORAGE_KEY_BASE}_${userId}` : STORAGE_KEY_BASE;
      const tsKey = userId ? `${key}_LAST_PRUNE` : `${STORAGE_KEY_BASE}_LAST_PRUNE`;
      try {
        const last = await AsyncStorage.getItem(tsKey);
        const now = Date.now();
        const ONE_DAY = 24 * 60 * 60 * 1000;
        if (last && now - Number(last) < ONE_DAY) return;

        const json = await AsyncStorage.getItem(key);
        const parsed: string[] = json ? JSON.parse(json) : [];
        if (!parsed.length || !promos.length) {
          await AsyncStorage.setItem(tsKey, String(now));
          return;
        }

        const valid = new Set(promos.map(p => p.id));
        const filtered = parsed.filter(id => valid.has(id));
        if (filtered.length !== parsed.length) {
          await AsyncStorage.setItem(key, JSON.stringify(filtered));
          setReadIds(filtered);
        }

        await AsyncStorage.setItem(tsKey, String(now));
      } catch (err) {
        console.warn('promo prune failed', err);
      }
    };

    prune();
  }, [promos]);

  const markAsRead = async (id: string) => {
    if (readIds.includes(id)) return;
    const newRead = [...readIds, id];
    setReadIds(newRead);
    const userId = await getUserId();
    const key = userId ? `${STORAGE_KEY_BASE}_${userId}` : STORAGE_KEY_BASE;
    await AsyncStorage.setItem(key, JSON.stringify(newRead));
    setUnreadCount(promos.filter(p => !newRead.includes(p.id)).length);
  };

  useEffect(() => {
    setUnreadCount(promos.filter(p => !readIds.includes(p.id)).length);
  }, [promos, readIds]);

  return { promos, loading, reload: loadPromos, readIds, markAsRead, unreadCount };
}
