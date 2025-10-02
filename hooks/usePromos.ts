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

// Module-level cache so multiple hook instances stay in sync
let _promosCache: Promo[] = [];
let _promosReadCache: string[] = [];
type Subscriber = () => void;
const _subscribers = new Set<Subscriber>();

export function usePromos() {
  const [promos, setPromos] = useState<Promo[]>(_promosCache);
  const [loading, setLoading] = useState<boolean>(true);
  const [readIds, setReadIds] = useState<string[]>(_promosReadCache);
  const [unreadCount, setUnreadCount] = useState<number>(() => _promosCache.filter(p => !_promosReadCache.includes(p.id)).length);

  useEffect(() => {
    setPromos(_promosCache);
    setReadIds(_promosReadCache);
    setUnreadCount(_promosCache.filter(p => !_promosReadCache.includes(p.id)).length);
    loadPromos();
    loadReadIds();

    const sub: Subscriber = () => {
      setPromos(_promosCache);
      setReadIds(_promosReadCache);
      setUnreadCount(_promosCache.filter(p => !_promosReadCache.includes(p.id)).length);
    };
    _subscribers.add(sub);
    return () => { _subscribers.delete(sub); };
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
    _promosReadCache = parsed;
    setReadIds(parsed);
    setUnreadCount((_promosCache || []).filter(p => !parsed.includes(p.id)).length);
    _subscribers.forEach(cb => cb());
  };

  const loadPromos = async () => {
    try {
      const res = await getPromos();
      const payload = res && res.length ? res : MOCK_PROMOS;
      _promosCache = payload;
      setPromos(payload);
      _subscribers.forEach(cb => cb());
    } catch (err) {
      console.warn('usePromos failed', err);
      _promosCache = MOCK_PROMOS;
      setPromos(MOCK_PROMOS);
      _subscribers.forEach(cb => cb());
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
    const newRead = [..._promosReadCache, id];
    _promosReadCache = newRead;
    setReadIds(newRead);
    const userId = await getUserId();
    const key = userId ? `${STORAGE_KEY_BASE}_${userId}` : STORAGE_KEY_BASE;
    await AsyncStorage.setItem(key, JSON.stringify(newRead));
    setUnreadCount((_promosCache || []).filter(p => !newRead.includes(p.id)).length);
    _subscribers.forEach(cb => cb());
  };

  useEffect(() => {
    setUnreadCount(promos.filter(p => !readIds.includes(p.id)).length);
  }, [promos, readIds]);

  return { promos, loading, reload: loadPromos, readIds, markAsRead, unreadCount };
}
