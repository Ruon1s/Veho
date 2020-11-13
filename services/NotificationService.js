import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import React, { useState, useEffect, useRef } from 'react';

// call: await schedulePushNotification('string','string',any)
const schedulePushNotification = async (title, body, data) => {
    if (title !== null && body !== null && data !== null) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: title,
                body: body,
                data: { data: data },
            },
            trigger: { seconds: 1 },
        });
    } else {
        console.log('must pass all data to pushNotification')
    };
};

const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Your token: ' + token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}

export { schedulePushNotification, registerForPushNotificationsAsync };