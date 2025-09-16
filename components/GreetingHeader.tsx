import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { clearUserId } from '@/utils/session'; // 👈 import clearUserId
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function GreetingHeader() {
  const handleLogout = async () => {
    try {
      await clearUserId(); // 🗑 clear from AsyncStorage
      router.replace('/welcome/(auth)/login'); // 🔄 go back to login
    } catch (error) {
      console.error("❌ Logout failed:", error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.textContainer}>
        <ThemedText type="title">Hello!</ThemedText>
        <ThemedView style={styles.userName}>
          <ThemedText type="default">First Name</ThemedText>
          <ThemedText type="default">Last Name</ThemedText>
        </ThemedView>
      </ThemedView>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout} // 👈 use function
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
