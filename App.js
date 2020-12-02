import React, { useState, useEffect, useRef } from 'react';
import * as Expo from "expo";
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import * as firebase from 'firebase';
import Navigator from './navigators/Navigator';
import { registerForPushNotificationsAsync } from './services/NotificationService';
import { firebaseConfig } from './utils/firebaseConfig';
import { LogBox } from 'react-native';
import useQueueHooks from './hooks/QueueHooks';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import en from './assets/languages/en';
import fi from './assets/languages/fi';

i18n.translations = {
  en: en,
  fi: fi,
};

i18n.locale = Localization.locale; // Set the locale at the beginning of the app
i18n.fallbacks = true // Can change to different language if not available

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const App = () => {
  const [fontsLoaded] = useFonts({
    OpenSans_Light: require("./assets/fonts/OpenSans-Light.ttf"),
    OpenSans_Bold: require("./assets/fonts/OpenSans-Bold.ttf"),
    Roboto: require("native-base/Fonts/Roboto.ttf"),
    Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
  });
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const { sendFirstReminder, finalNotification } = useQueueHooks();

  useEffect(() => {
    LogBox.ignoreLogs(['Setting a timer for a long period of time']); // <-- Hide unnecessary warnings with android and firestore

    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // TODO: When users gets a notification (means that user is first in queue and there is a spot available)
      // Handle the notification in the background so we can set a timer for the user to accept/deny the spot
      // If the user does not react to until the timer reches to zero remove the user from the queue.
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    fontsLoaded ?
      <Navigator />
      :
      <Expo.AppLoading />
  );
}

export default App;
