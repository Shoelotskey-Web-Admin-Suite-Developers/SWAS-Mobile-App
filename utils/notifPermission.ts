// src/utils/notifPermission.ts
import { getUserId } from "@/utils/session";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

const BACKEND_URL = `${(process.env.EXPO_PUBLIC_API_BASE_URL || '').replace(/\/$/, '')}/api/notif-token`;

/**
 * Request permission, get Expo push token, and send it to backend.
 */
export const registerPushToken = async () => {
  try {
    const cust_id = await getUserId();
    console.log("📥 user_id retrieved:", cust_id);
    if (!cust_id) return;

    if (!Device.isDevice) {
      console.log("Push notifications only work on physical devices");
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: { allowAlert: true, allowSound: true, allowBadge: true },
      });
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("❌ Failed to get push token permissions!");
      return;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;
    console.log("📨 Expo Push Token:", token);

    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cust_id, token }),
    });

    if (!res.ok) throw new Error(`Backend error: ${res.status}`);

    const data = await res.json();
    console.log("✅ Push token registered successfully for", cust_id, data);
  } catch (err) {
    console.error("❌ Error registering push token:", err);
  }
};

/**
 * Unregister Expo push token from backend (use on logout)
 */
export const unregisterPushToken = async () => {
  try {
    const cust_id = await getUserId();
    if (!cust_id) return;

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;
    console.log("📪 Expo Push Token to unregister:", token);

    const res = await fetch(`${BACKEND_URL}/${cust_id}/${token}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error(`Backend error: ${res.status}`);

    const data = await res.json();
    console.log("✅ Push token unregistered successfully for", cust_id, data);
  } catch (err) {
    console.error("❌ Error unregistering push token:", err);
  }
};
