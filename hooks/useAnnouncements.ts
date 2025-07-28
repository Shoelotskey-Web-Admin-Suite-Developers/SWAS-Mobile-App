import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Announcement = {
  id: string;
  title: string;
  description: string;
  date: string;
};

const STORAGE_KEY = 'READ_ANNOUNCEMENTS';

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

export function useAnnouncements() {
  const [readIds, setReadIds] = useState<string[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    setAnnouncements(MOCK_ANNOUNCEMENTS);
    loadReadIds();
  }, []);

  const loadReadIds = async () => {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) setReadIds(JSON.parse(json));
  };

  const markAsRead = async (id: string) => {
    if (readIds.includes(id)) return;
    const newReadIds = [...readIds, id];
    setReadIds(newReadIds);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newReadIds));
  };

  const unreadCount = announcements.filter(a => !readIds.includes(a.id)).length;

  return { announcements, unreadCount, markAsRead, readIds };
}
