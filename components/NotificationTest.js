import React, { useEffect, useState } from 'react';
import { Container, Button, Input, Form, Text, Item, Label, Content } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import GlobalStyles from '../styles/GlobalStyles';
import * as Notifications from 'expo-notifications';

const createNotification = () => {
    // need to study more on how to create notification object and send it to listeners
}

const NotificationTest = () => {
    React.useEffect(() => {
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            const url = response.notification.request.content.data.url;
            Linking.openUrl(url);
        });
        return () => subscription.remove();
    }, []);

    return (
        <Button
            style={GlobalStyles.button}
            transparent
            full
            onPress={createNotification}>
            <Text>send notification</Text>
        </Button>
    )
}

export default NotificationTest
