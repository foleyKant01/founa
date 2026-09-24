importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAeJGVuTi2fW_NbbjmkSqyMix3c1UlJQeY",
  authDomain: "founa-ci.firebaseapp.com",
  projectId: "founa-ci",
  storageBucket: "founa-ci.firebasestorage.app",
  messagingSenderId: "965967849980",
  appId: "1:965967849980:web:fda9ccdba79401c7b1aa79",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Notification reçue :",
    payload
  );

  const notificationTitle =
    payload.notification?.title ||
    payload.data?.title ||
    "FOUNA";

  const notificationOptions = {
    body:
      payload.notification?.body ||
      payload.data?.body ||
      "Vous avez une nouvelle notification.",
    icon: "/logo-founa.png",
    badge: "/logo-founa.png",
    data: {
      url:
        payload.data?.url ||
        payload.fcmOptions?.link ||
        "https://founa.ci",
    },
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener("push", (event) => {

    const payload = event.data?.json() || {};

    const data = payload.data || payload;

    event.waitUntil(
        self.registration.showNotification(
            data.title || "FOUNA",
            {
                body: data.body || "",
                icon: "/logo-founa.png",
                data: data
            }
        )
    );
});


self.addEventListener("notificationclick", (event) => {

    event.notification.close();

    const url =
        event.notification?.data?.url ||
        "https://founa.ci";

    event.waitUntil(
        clients.matchAll({
            type: "window",
            includeUncontrolled: true
        }).then((clientList) => {

            for (const client of clientList) {

                if ("focus" in client) {

                    client.navigate(url);

                    return client.focus();
                }
            }

            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});