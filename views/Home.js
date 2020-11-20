import React, { useEffect, useState } from 'react';
import { Container, Text, Button, View, StyleProvider, Toast, Root, Spinner } from 'native-base';
import { Col, Grid } from 'react-native-easy-grid';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import GlobalStyles from '../styles/GlobalStyles';
import BatteryInfo from '../components/BatteryInfo';
import QueueInfo from '../components/QueueInfo';
import CustomHeader from '../components/CustomHeader';
import { AUTH, GRANT, UNAME, PASS } from "@env";
import * as SecureStore from 'expo-secure-store';
import { schedulePushNotification } from '../services/NotificationService';
import * as firebase from 'firebase';
import 'firebase/firestore';
import useQueueHooks from '../hooks/QueueHooks';

const Home = ({ navigation }) => {
    const [available, setAvailable] = useState();           //To check if there is a spot available right away
    const [batteryStatus, setBatteryStatus] = useState(54)
    const [currentUser, setCurrentUser] = useState('')

    useEffect(() => {
        const user = firebase.auth().currentUser        // To display user id @Home, change to name later
        // console.log('Current User: ' + user)
        setCurrentUser(user.uid)
    }, []);

    const {
        queue,
        parkingSpots,
        queueListener,
        parkingSpotListener,
        addUserToQueue,
        removeUserFromQueue,
        startCharging,
        checkStatus,
    } = useQueueHooks();

    useEffect(() => {
        const unsubscribeQueueListener = queueListener();
        const unsubscribeParkingSpotListener = parkingSpotListener();

        return () => {
            unsubscribeQueueListener();
            unsubscribeParkingSpotListener();
        }
    }, []);

    useEffect(() => {
        setAvailable(checkStatus());
    }, [parkingSpots, queue]);

    const getCarVin = async () => {
        const user = firebase.auth().currentUser;
        console.log(user)
        const db = firebase.firestore();

        const carsRef = db.collection('cars');
        const snapshot = await carsRef.where('uid', '==', user.uid).get();
        if (snapshot.empty) {
            console.log('No documents.');
            return;
        }
        const carVin = snapshot.docs[0].data().vin
        console.log('current users cars vin number: ', carVin)
        return carVin
    }

    const fetchSoc = async () => {
        const token = await SecureStore.getItemAsync('token');
        try {
            const headers = {
                'Cache-Control': 'no-cache',
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            }

            const options = {
                method: 'GET',
                withCredentials: true,
                headers,
            }
            const user = firebase.auth().currentUser;
            console.log(user)
            const db = firebase.firestore();

            const carsRef = db.collection('cars');
            const snapshot = await carsRef.where('uid', '==', user.uid).get();
            if (snapshot.empty) {
                console.log('No documents.');
                return;
            }
            const carVin = snapshot.docs[0].data().vin
            console.log('current users cars vin number: ', carVin)



            const response = await fetch('https://api.connect-business.net/fleet/v1/fleets/DF89D145A29C43BE80FC2464B54405F9/vehicles.dynamic/C0NNECT0000000100', options);
            //const toJSON = await response.json();
            // HTML response (404/500), response.text
            const toJSON = await response.json();

            console.log(toJSON);


        } catch (error) {
            console.log(error);
        }
    }

    const fetchToken = async () => {
        try {
            const data = {
                'grant_type': GRANT,
                'username': UNAME,
                'password': PASS
            }

            const headers = {
                'Cache-Control': 'no-cache',
                'Authorization': AUTH,
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            }

            const formBody = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');

            const options = {
                method: 'POST',
                headers,
                body: formBody,
            }

            const response = await fetch('https://api.connect-business.net/fleet/v1/oauth/token', options);
            const toJSON = await response.json();

            await SecureStore.setItemAsync('token', toJSON.access_token);
        } catch (error) {
            console.log(error);
        }
    }

    const logout = async () => {                                                            //Functions that logs the user out (Need to be changed to Settings page later?)
        await firebase.auth().signOut();
        navigation.replace('Auth');
    }

    return (
        <Root>
            <StyleProvider style={getTheme(platform)}>
                <Container>
                    <CustomHeader title='Home' subtitle={currentUser} />

                    <View padder style={{ flex: 1, justifyContent: 'space-between', marginBottom: 60 }}>
                        <QueueInfo free={parkingSpots.available.length} queue={queue.size} queuePosition={queue.position} />
                        <BatteryInfo batteryStatus={batteryStatus} />

                        <Button full transparent onPress={() => schedulePushNotification('Test', 'Hello', 123)}>
                            <Text>Test notification</Text>
                        </Button>

                        <View>
                            <Button full onPress={fetchToken}
                                style={GlobalStyles.button}>
                                <Text>(DEV) Get Token</Text>
                            </Button>
                            <Button full onPress={fetchSoc}
                                style={GlobalStyles.button}>
                                <Text>(DEV) Refresh SOC</Text>
                            </Button>
                            {queue.inQueue && available ?
                                <>
                                    <Button full style={GlobalStyles.button} onPress={() => startCharging(navigation)} >
                                        <Text>Start Charging</Text>
                                    </Button>
                                    <Button full style={GlobalStyles.button} onPress={removeUserFromQueue} disabled={queue.processing}>
                                        {queue.processing ? <Spinner /> : <Text>Leave Queue</Text>}
                                    </Button>
                                </>
                                :
                                null}
                            {!queue.inQueue && !available && !parkingSpots.inSpot ?
                                <Button full style={GlobalStyles.button} onPress={addUserToQueue} disabled={queue.processing}>
                                    {queue.processing ? <Spinner /> : <Text>Queue</Text>}
                                </Button>
                                :
                                null}
                            {queue.inQueue && !available ?
                                <Button full style={GlobalStyles.button} onPress={removeUserFromQueue} disabled={queue.processing}>
                                    {queue.processing ? <Spinner /> : <Text>Leave Queue</Text>}
                                </Button>
                                :
                                null}
                            {!queue.inQueue && available ?
                                <Button full style={GlobalStyles.button} onPress={() => startCharging(navigation)}>
                                    <Text>Start Charging</Text>
                                </Button>
                                :
                                null}
                            {parkingSpots.inSpot ?
                                <Button full style={GlobalStyles.button} onPress={() => navigation.navigate('ChargingView')}>
                                    <Text>To Charging View</Text>
                                </Button>
                                :
                                null}
                            <Grid>
                                <Col>
                                    <Button
                                        full
                                        danger transparent
                                        onPress={logout}
                                        style={GlobalStyles.button}>
                                        <Text>Logout</Text>
                                    </Button>
                                </Col>
                            </Grid>
                        </View>
                    </View>
                </Container >
            </StyleProvider >
        </Root>
    );
}

export default Home;
