import axios from "axios";
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "../config/firebase";

let notificationsInitialized = false;

export const RegisterDeviceToken = async (
  user_uid: string,
  user_type: "user" | "teller"
) => {
  try {
    if (!user_uid) {
      console.warn("Impossible d'enregistrer FCM : user_uid absent");
      return null;
    }

    if (!("Notification" in window)) {
      console.warn("Les notifications ne sont pas supportées");
      return null;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn("Permission notification refusée");
      return null;
    }

    const messaging = await getFirebaseMessaging();

    if (!messaging) {
      console.warn("Firebase Messaging non supporté");
      return null;
    }

    const registration =
      await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.warn("Aucun token FCM obtenu");
      return null;
    }

    console.log("FCM TOKEN :", token);

    await axios.post(
      `/api/pushnotification/register_device_token`,
      {
        user_uid,
        user_type,
        device_token: token,
        device_type: "web",
      }
    );
    console.log(
      `Token FCM enregistré pour ${user_type}`
    );
    return token;
  } catch (error) {
    console.error(
      "Erreur enregistrement token FCM :",
      error
    );
    return null;
  }
};


export const listenForegroundMessages = async (
  callback: (payload: any) => void
) => {
  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) {
      return;
    }
    return onMessage(messaging, (payload) => {
      console.log(
        "Notification FCM reçue au premier plan :",
        payload
      );
      callback(payload);
    });
  } catch (error) {
    console.error(
      "Erreur écoute notifications FCM :",
      error
    );
  }
};


export const initializeNotifications = async (): Promise<void> => {
  if (notificationsInitialized) {
    return;
  }
  notificationsInitialized = true;
  try {
    console.log("Initialisation FCM...");

    /*
     * Vérifier d'abord le teller
     */
    const tellerData = localStorage.getItem("teller");

    /*
     * Vérifier ensuite le user
     */
    const userData = localStorage.getItem("user");

    /*
     * CAS TELLER
     */
    if (tellerData) {
      const teller = JSON.parse(tellerData);
      if (!teller?.uid) {
        console.warn("UID teller absent");
        return;
      }
      console.log(
        "Initialisation FCM pour le teller :",
        teller.uid
      );
      await RegisterDeviceToken(
        teller.uid,
        "teller"
      );
    }

    /*
     * CAS USER
     */
    else if (userData) {
      const user = JSON.parse(userData);
      if (!user?.uid) {
        console.warn("UID utilisateur absent");
        return;
      }

      console.log(
        "Initialisation FCM pour l'utilisateur :",
        user.uid
      );

      await RegisterDeviceToken(
        user.uid,
        "user"
      );
    }

    /*
     * AUCUN UTILISATEUR CONNECTÉ
     */
    else {
      console.log(
        "Aucun utilisateur ou teller connecté"
      );
      return;
    }


    /*
     * Écoute des notifications lorsque
     * l'application est ouverte
     */
    await listenForegroundMessages((payload) => {
      console.log(
        "Notification reçue dans Founa :",
        payload
      );
    });

  } catch (error) {
    console.error(
      "Erreur initialisation FCM :",
      error
    );
  }
};