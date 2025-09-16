import { getUserId } from "@/utils/session";
import { Redirect, Stack } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const userId = await getUserId();
        setIsLoggedIn(Boolean(userId));
      } catch (error) {
        console.error("❌ Error checking session:", error);
        setIsLoggedIn(false);
      }
    };

    checkSession();
  }, []);

  if (isLoggedIn === null) return null; // ⏳ waiting for session check

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Redirect
        href={isLoggedIn ? "/(tabs)/home" : "/welcome/welcome"}
      />
    </>
  );
}
