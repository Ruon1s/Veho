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

export { schedulePushNotification };