importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAOWcKKXMg17-vqTL6wyvF4uxnCUrM4cZI",
  authDomain: "pk-esports-d5dd8.firebaseapp.com",
  projectId: "pk-esports-d5dd8",
  storageBucket: "pk-esports-d5dd8.appspot.com",
  messagingSenderId: "717752398412",
  appId: "1:717752398412:web:eb63be77ec78eb70aefae9"
});

const messaging = firebase.messaging();

// 🔥 Handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log("[FCM SW] Background message: ", payload);

  const notificationTitle = payload.notification?.title || "PK Esports";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/icon.png", // optional icon
    badge: "/icon.png"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
