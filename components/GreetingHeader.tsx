import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { unregisterPushToken } from '@/utils/notifPermission'; // 👈 import
import { clearUserId, getUserId } from '@/utils/session';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function GreetingHeader() {
  const [firstName, setFirstName] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;

    const fetchFirstName = async () => {
      try {
        const cust_id = await getUserId();
        if (!cust_id) return;

        const base = (process.env.EXPO_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
        const res = await fetch(`${base}/api/customers/${cust_id}/first-name`);
        
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setFirstName(data.firstName || null);
      } catch (err) {
        console.error('Failed to fetch first name', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchFirstName();
    return () => {
      mounted = false;
    };
  }, []);
  const handleLogout = async () => {
    try {
      // 1️⃣ Unregister push token from backend
      await unregisterPushToken();

      // 2️⃣ Clear user ID from AsyncStorage
      await clearUserId();

      // 3️⃣ Navigate to login
      router.replace('/welcome/(auth)/login');
    } catch (error) {
      console.error("❌ Logout failed:", error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.textContainer}>
        <ThemedText type="title">Hello </ThemedText>
        <ThemedText type="titleRegular">
          {loading ? '...' : firstName || 'Guest'}
        </ThemedText>
        <ThemedText type="title">!</ThemedText>
      </ThemedView>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <IconSymbol
          name="rectangle.portrait.and.arrow.right"
          size={28}
          color="#D11315"
        />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  textContainer: {
    flexDirection: 'row',
  },
  userName: {
    marginLeft: 12,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  logoutButton: {
    marginTop: 5,
  },
});
