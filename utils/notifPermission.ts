// src/utils/notifPermission.ts
import { getUserId, getUserToken } from "@/utils/session";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

// Normalize backend URL (env var must be set in app config / eas)
const RAW_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || "";
const API_BASE = RAW_BASE.replace(/\/$/, "");
const BACKEND_URL = `${API_BASE}/api/notif-token`;

// Set a notification handler (can also be called once in root layout)
export const ensureNotificationHandler = () => {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => {
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          // Provide defaults for platforms supporting banners & lists (iOS 14+)
          shouldShowBanner: true,
          shouldShowList: true,
        } as any; // cast to satisfy differing SDK versions
      },
    });
  } catch (e) {
    console.warn("Failed to set notification handler", e);
  }
};

/**
 * Request permission, get Expo push token (with projectId), and send it to backend.
 */
export const registerPushToken = async (opts: { retry?: number } = {}): Promise<
  | { success: true; token: string }
  | { success: false; reason: string; status?: number }
> => {
  const { retry = 0 } = opts;
  try {
    const cust_id = await getUserId();
    if (!cust_id) {
      console.log("� No user id yet; skipping push token registration");
      return { success: false, reason: "NO_USER" };
    }

    if (!Device.isDevice) {
      console.log("🔸 Not a physical device; push token unsupported");
      return { success: false, reason: "NOT_DEVICE" };
    }

    if (!API_BASE) {
      console.warn("⚠️ EXPO_PUBLIC_API_BASE_URL not set; cannot send token");
      return { success: false, reason: "NO_API_BASE" };
    }

    // Android: ensure a default channel exists
    if (Device.osName === "Android") {
      try {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      } catch (e) {
        console.warn("Could not create Android notification channel", e);
      }
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const req = await Notifications.requestPermissionsAsync({
        ios: { allowAlert: true, allowBadge: true, allowSound: true },
      });
      finalStatus = req.status;
    }
    if (finalStatus !== "granted") {
      console.log("❌ Notification permission not granted");
      return { success: false, reason: "PERMISSION_DENIED" };
    }

    // Determine projectId (Expo SDK 49+ often requires this in certain contexts)
    const projectId =
      // @ts-ignore - guard for both locations
      Constants?.expoConfig?.extra?.eas?.projectId ||
      // @ts-ignore
      Constants?.easConfig?.projectId ||
      process.env.EXPO_PROJECT_ID;

    let tokenData;
    try {
      tokenData = await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined
      );
    } catch (err) {
      console.error("❌ Error fetching Expo push token:", err);
      if (retry < 2) {
        console.log("🔁 Retrying push token fetch...", retry + 1);
        return registerPushToken({ retry: retry + 1 });
      }
      return { success: false, reason: "TOKEN_FETCH_FAILED" };
    }
    const token = tokenData.data;
    console.log("📨 Expo Push Token:", token, "projectId:", projectId);

    const authToken = await getUserToken();
    let responseText = "";
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify({ cust_id, token }),
    });
    responseText = await res.text();
    if (!res.ok) {
      console.error("❌ Backend rejected token:", res.status, responseText);
      return { success: false, reason: "BACKEND_ERROR", status: res.status };
    }
    let data: any;
    try { data = JSON.parse(responseText); } catch { data = { raw: responseText }; }
    console.log("✅ Push token registered:", data);
    return { success: true, token };
  } catch (err) {
    console.error("❌ Unexpected error registering push token:", err);
    return { success: false, reason: "UNEXPECTED" };
  }
};

/**
 * Unregister Expo push token from backend (use on logout)
 */
export const unregisterPushToken = async (): Promise<
  | { success: true }
  | { success: false; reason: string; status?: number }
> => {
  try {
    const cust_id = await getUserId();
    if (!cust_id) return { success: false, reason: "NO_USER" };

    const projectId =
      // @ts-ignore
      Constants?.expoConfig?.extra?.eas?.projectId ||
      // @ts-ignore
      Constants?.easConfig?.projectId ||
      process.env.EXPO_PROJECT_ID;

    let tokenData;
    try {
      tokenData = await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined
      );
    } catch (err) {
      console.error("❌ Could not fetch token for unregister:", err);
      return { success: false, reason: "TOKEN_FETCH_FAILED" };
    }
    const token = tokenData.data;
    console.log("📪 Expo Push Token to unregister:", token);

    const res = await fetch(`${BACKEND_URL}/${cust_id}/${token}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const text = await res.text();
    if (!res.ok) {
      console.error("❌ Backend error unregistering token:", res.status, text);
      return { success: false, reason: "BACKEND_ERROR", status: res.status };
    }
    let data: any; try { data = JSON.parse(text); } catch { data = { raw: text }; }
    console.log("✅ Push token unregistered:", data);
    return { success: true };
  } catch (err) {
    console.error("❌ Error unregistering push token:", err);
    return { success: false, reason: "UNEXPECTED" };
  }
};
