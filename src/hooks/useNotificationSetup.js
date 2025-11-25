import { useEffect } from "react";
import { requestFcmToken, messaging } from "../firebase";
import { onMessage } from "firebase/messaging";

export function useNotificationSetup() {

  // 🔥 Listen for foreground messages
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("[Foreground] Message received: ", payload);
      const { title, body } = payload.notification || {};
      alert(`🔔 ${title}\n\n${body}`);
    });

    return () => unsubscribe();
  }, []);

  const enableNotifications = async (phone) => {
    if (!phone) {
      alert("Phone number missing!");
      return;
    }

    // 1️⃣ Request FCM Token
    const token = await requestFcmToken();

    if (!token) {
      alert("Please allow notification permission.");
      return;
    }

    console.log("FCM TOKEN:", token);

    // 2️⃣ Google Script URL (replace with your URL)
    const SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbw1yPfjabEXFvY-r7rBQo5fCDYrnrF5FAYelKD3Sa_QSSmTpzqtBs4aUe4lGwdj1_-K/exec";

    // 3️⃣ Send token to Google Sheet — MUST use text/plain
    const res = await fetch(SCRIPT_URL + "?table=users", {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        phone: phone,
        token: token
      }),
    });

    console.log("Token sent to sheet.");

    alert("🔥 Notifications Enabled! You will receive match alerts.");
  };

  return { enableNotifications };
}
