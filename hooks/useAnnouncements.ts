import { getAnnouncements } from '@/utils/api/getAnnouncements';
import { getUserId } from '@/utils/session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL;

export type Announcement = {
  id: string;
  title: string;
  description: string;
  date: string;
  branchName?: string;
};

const STORAGE_KEY_BASE = 'READ_ANNOUNCEMENTS';

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: '🔥 Promo Alert – Rainy Day Discount',
    description: 'Caught in the rain? Don’t let muddy shoes ruin your vibe! Today only, enjoy 20% OFF our Basic Shoe Cleaning Service — perfect for getting rid of dirt, stains, and water marks.',
    date: 'June 10, 2025',
  },
  {
    id: '2',
    title: '⏰ Early Closing Notice',
    description: 'The Main Branch will be closed for maintenance. Regular operations resume June 11.',
    date: 'June 10, 2025',
  },
  // Add more
];

// Module-level cache + subscribers so multiple hook instances stay in sync
let _announcementsCache: Announcement[] = [];
let _readIdsCache: string[] = [];

type Subscriber = () => void;
const _subscribers = new Set<Subscriber>();

function notifyAll() {
  _subscribers.forEach((cb) => {
    try {
      cb();
    } catch (e) {
      console.warn('useAnnouncements subscriber error', e);
    }
  });
}

export function useAnnouncements() {
  const [readIds, setReadIds] = useState<string[]>(_readIdsCache);
  const [announcements, setAnnouncements] = useState<Announcement[]>(_announcementsCache);
  const [loading, setLoading] = useState<boolean>(true);
  const [unreadCount, setUnreadCount] = useState<number>(() => announcements.filter(a => !_readIdsCache.includes(a.id)).length);

  useEffect(() => {
    // Initialize from cache and then load fresh values
    setAnnouncements(_announcementsCache);
    setReadIds(_readIdsCache);
    setUnreadCount((_announcementsCache || []).filter(a => !_readIdsCache.includes(a.id)).length);
    loadAnnouncements();
    loadReadIds();

    const subscriber: Subscriber = () => {
      setAnnouncements(_announcementsCache);
      setReadIds(_readIdsCache);
      setUnreadCount((_announcementsCache || []).filter(a => !_readIdsCache.includes(a.id)).length);
    };
    _subscribers.add(subscriber);
    return () => {
      _subscribers.delete(subscriber);
    };
  }, []);

  // Setup socket listener to refresh announcements in real-time
  useEffect(() => {
  const API_BASE = (process.env.EXPO_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
  // derive socket url - if API_BASE contains /api, strip it (backwards compatible)
  const socketUrl = API_BASE.replace(/\/api\/?$/, '');
    let socket: Socket | null = null;

    try {
      socket = io(socketUrl, { transports: ['websocket', 'polling'] });
      socket.on('connect', () => {
        console.log('🔌 announcements socket connected', socket?.id);
      });

      socket.on('announcementsUpdated', (change: any) => {
        console.log('📣 announcementsUpdated', change);
        // Reload announcements and update module cache so all hook instances update
        loadAnnouncements();
      });

      socket.on('disconnect', () => {
        console.log('❌ announcements socket disconnected');
      });
    } catch (err) {
      console.warn('useAnnouncements: socket connection failed', err);
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);




  const loadAnnouncements = async () => {
    try {
      const result = await getAnnouncements();
      const payload = result && result.length ? result : MOCK_ANNOUNCEMENTS;
      _announcementsCache = payload;
      setAnnouncements(payload);
      // notify other hook instances
      notifyAll();
    } catch (err) {
      console.warn('useAnnouncements: failed to load from API, using mock data', err);
      _announcementsCache = MOCK_ANNOUNCEMENTS;
      setAnnouncements(MOCK_ANNOUNCEMENTS);
      notifyAll();
    } finally {
      setLoading(false);
    }
  };

  // After announcements load, prune any stored read IDs that no longer exist on server
  useEffect(() => {
    const pruneReadIds = async () => {
      const userId = await getUserId();
      const key = userId ? `${STORAGE_KEY_BASE}_${userId}` : STORAGE_KEY_BASE;
      const tsKey = userId ? `${key}_LAST_PRUNE` : `${STORAGE_KEY_BASE}_LAST_PRUNE`;

      try {
        const last = await AsyncStorage.getItem(tsKey);
        const now = Date.now();
        const ONE_DAY = 24 * 60 * 60 * 1000;
        if (last && now - Number(last) < ONE_DAY) return; // already pruned within 24h

        const json = await AsyncStorage.getItem(key);
        const parsed: string[] = json ? JSON.parse(json) : [];
        if (!parsed.length || !announcements.length) {
          await AsyncStorage.setItem(tsKey, String(now));
          return;
        }

        const validIds = new Set(announcements.map(a => a.id));
        const filtered = parsed.filter(id => validIds.has(id));
        if (filtered.length !== parsed.length) {
          await AsyncStorage.setItem(key, JSON.stringify(filtered));
          setReadIds(filtered);
        }

        await AsyncStorage.setItem(tsKey, String(now));
      } catch (err) {
        console.warn('pruneReadIds failed', err);
      }
    };

    pruneReadIds();
  }, [announcements]);

  const loadReadIds = async () => {
    const userId = await getUserId();
    const key = userId ? `${STORAGE_KEY_BASE}_${userId}` : STORAGE_KEY_BASE;
    const json = await AsyncStorage.getItem(key);
    const parsed: string[] = json ? JSON.parse(json) : [];
    _readIdsCache = parsed;
    setReadIds(parsed);
    // compute unread based on persisted ids using the cached announcements
    setUnreadCount((_announcementsCache || []).filter(a => !parsed.includes(a.id)).length);
    notifyAll();
  };

  const markAsRead = async (id: string) => {
    if ((_readIdsCache || []).includes(id)) return;
    const newReadIds = [..._readIdsCache, id];
    _readIdsCache = newReadIds;
    setReadIds(newReadIds);
    const userId = await getUserId();
    const key = userId ? `${STORAGE_KEY_BASE}_${userId}` : STORAGE_KEY_BASE;
    await AsyncStorage.setItem(key, JSON.stringify(newReadIds));
    // update unread count using cached announcements and notify other listeners
    setUnreadCount((_announcementsCache || []).filter(a => !newReadIds.includes(a.id)).length);
    notifyAll();
  };

  // keep unreadCount in sync when announcements or readIds change
  useEffect(() => {
    setUnreadCount(announcements.filter(a => !readIds.includes(a.id)).length);
  }, [announcements, readIds]);

  return { announcements, unreadCount, markAsRead, readIds, loading };
}
