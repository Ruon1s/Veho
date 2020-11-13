import React, { useEffect, useState, useRef } from 'react';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { Container, Content, Text, Button, View, StyleProvider, Body, Title } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import GlobalStyles from '../styles/GlobalStyles';
import BatteryInfo from '../components/BatteryInfo';
import QueueInfo from '../components/QueueInfo';
import CustomHeader from '../components/CustomHeader';
import { schedulePushNotification } from '../services/NotificationService';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const Home = ({ navigation }) => {
    // State: for queue information
    const [state, setState] = useState({
        queue: 0,
        free: 0,
        queuePosition: 0
    });

    const [batteryStatus, setBatteryStatus] = useState(54)
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    // QueueInfo re-renders according to this state change
    const handleClick = () => {
        if (state.queuePosition == 1) {
            setState({ queuePosition: 0 })
        } else {
            setState({ queuePosition: 1 })
        }
    }

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
            Notifications.removeNotificationSubscription(responseListener);
        };
    }, []);

    /* Functions needed, GET:
          - battery %
          - # of free spots in parking space
          - the length of queue
    */

    // platform.js contains the color and font variables ordered by veho 
    return (
        <StyleProvider style={getTheme(platform)}>
            <Container>
                <CustomHeader title='Home' />

                <View padder style={{ flex: 1, justifyContent: 'space-between', marginBottom: 60 }}>
                    <QueueInfo free={state.free} queue={state.queue} queuePosition={state.queuePosition} />
                    <BatteryInfo batteryStatus={batteryStatus} />

                    <Button full transparent onPress={() => schedulePushNotification('Test', 'Hello', 123)}>
                        <Text>Test notification</Text>
                    </Button>

                    <View>
                        <Button full onPress={handleClick}
                            style={GlobalStyles.button}>
                            <Text>Queue</Text>
                        </Button>
                        <Grid>
                            <Col>
                                <Button
                                    full
                                    onPress={() => navigation.navigate('ChargingView')}
                                    style={GlobalStyles.button}>
                                    <Text>ChargingView</Text>
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    full
                                    danger transparent
                                    onPress={() => navigation.replace('Auth')}
                                    style={GlobalStyles.button}>
                                    <Text>Logout</Text>
                                </Button>
                            </Col>
                        </Grid>
                    </View>
                </View>
            </Container >
        </StyleProvider>
    );
}

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

export default Home;
