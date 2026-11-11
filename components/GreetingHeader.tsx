import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { unregisterPushToken } from '@/utils/notifPermission'; // 👈 import
import { clearUserId, getUserId } from '@/utils/session';
import { router } from 'expo-router';
import React from 'react';
import { Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function GreetingHeader() {
  const [firstName, setFirstName] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

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
    setShowLogoutModal(false);
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
        accessibilityLabel="Log out"
        accessibilityRole="button"
        style={styles.logoutButton}
        onPress={() => setShowLogoutModal(true)}
      >
        <IconSymbol
          name="rectangle.portrait.and.arrow.right"
          size={28}
          color="#D11315"
        />
      </TouchableOpacity>

      <Modal
        visible={showLogoutModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            accessibilityViewIsModal
            style={styles.logoutModal}
          >
            <View style={styles.logoutIcon}>
              <IconSymbol
                name="rectangle.portrait.and.arrow.right"
                size={28}
                color="#D11315"
              />
            </View>
            <ThemedText type="titleSmall" style={styles.modalTitle}>
              Log out?
            </ThemedText>
            <ThemedText type="default" style={styles.modalMessage}>
              Are you sure you want to log out of your account?
            </ThemedText>
            <View style={styles.modalActions}>
              <Pressable
                accessibilityLabel="Cancel logout"
                accessibilityRole="button"
                onPress={() => setShowLogoutModal(false)}
                style={styles.cancelButton}
              >
                <ThemedText type="button" style={styles.cancelText}>
                  Cancel
                </ThemedText>
              </Pressable>
              <Pressable
                accessibilityLabel="Confirm logout"
                accessibilityRole="button"
                onPress={handleLogout}
                style={styles.confirmButton}
              >
                <ThemedText type="button" style={styles.confirmText}>
                  Log out
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#00000099',
    justifyContent: 'center',
    padding: 24,
  },
  logoutModal: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 360,
  },
  logoutIcon: {
    alignItems: 'center',
    backgroundColor: '#fff1f1',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    marginBottom: 14,
    width: 56,
  },
  modalTitle: {
    color: '#171717',
    marginBottom: 8,
  },
  modalMessage: {
    color: '#6b6b6b',
    lineHeight: 20,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
    width: '100%',
  },
  cancelButton: {
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
    minHeight: 46,
  },
  cancelText: {
    color: '#555',
  },
  confirmButton: {
    alignItems: 'center',
    backgroundColor: '#D11315',
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
    minHeight: 46,
  },
  confirmText: {
    color: '#fff',
  },
});
