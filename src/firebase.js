import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAOWcKKXMg17-vqTL6wyvF4uxnCUrM4cZI",
  authDomain: "pk-esports-d5dd8.firebaseapp.com",
  projectId: "pk-esports-d5dd8",
  storageBucket: "pk-esports-d5dd8.appspot.com",
  messagingSenderId: "717752398412",
  appId: "1:717752398412:web:eb63be77ec78eb70aefae9"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export async function requestFcmToken() {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BPcJNzm9IzyhceLmAB3ipW5I99j2YJVv3Pb_ohbCe3phWsYWvaRA5uM9wZxSnY3kK0I5kndEkJrbxzpUs7n3nOY"
    });

    return token;
  } catch (err) {
    console.error("FCM token error:", err);
    return null;
  }
}
