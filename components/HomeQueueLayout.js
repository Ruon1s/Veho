import React, { useEffect, useState } from 'react';
import { Container, Text, Button, View, StyleProvider, Toast, Root, Spinner } from 'native-base';
import { Col, Grid } from 'react-native-easy-grid';
import GlobalStyles from '../styles/GlobalStyles';
import BatteryInfo from './BatteryInfo';
import QueueInfo from './QueueInfo';
import CustomHeader from './CustomHeader';
import useQueueHooks from '../hooks/QueueHooks';

const HomeQueueLayout = (props) => {
    const [available, setAvailable] = useState();           //To check if there is a spot available right away
    const [batteryStatus, setBatteryStatus] = useState(54)

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

    return (<View padder style={{ flex: 1, justifyContent: 'space-between', marginBottom: 60 }}>
        <QueueInfo free={parkingSpots.available.length} queue={queue.size} queuePosition={queue.position} />
        <BatteryInfo batteryStatus={batteryStatus} />



        <View>
            {/* 
            <Button block transparent onPress={() => schedulePushNotification('Test', 'Hello', 123)}>
                <Text>Test notification</Text>
            </Button>
            <Button block onPress={fetchToken}>
                <Text>(DEV) Get Token</Text>
            </Button>
            <Button block onPress={fetchSoc}>
                <Text>(DEV) Refresh SOC</Text>
            </Button>
*/}
            {queue.inQueue && available ?
                <>
                    <Button block onPress={() => startCharging(navigation)} >
                        <Text>Start Charging</Text>
                    </Button>
                    <Button block onPress={removeUserFromQueue} disabled={queue.processing}>
                        {queue.processing ? <Spinner /> : <Text>Leave Queue</Text>}
                    </Button>
                </> : null}
            {!queue.inQueue && !available && !parkingSpots.inSpot ?
                <Button block onPress={addUserToQueue} disabled={queue.processing}>
                    {queue.processing ? <Spinner /> : <Text>Queue</Text>}
                </Button> : null}
            {queue.inQueue && !available ?
                <Button block onPress={removeUserFromQueue} disabled={queue.processing}>
                    {queue.processing ? <Spinner /> : <Text>Leave Queue</Text>}
                </Button> : null}
            {!queue.inQueue && available ?
                <Button block onPress={() => startCharging(navigation)}>
                    <Text>Start Charging</Text>
                </Button> : null}
            {parkingSpots.inSpot ?
                <Button block onPress={() => navigation.navigate('ChargingView')}>
                    <Text>To Charging View</Text>
                </Button> : null}
            <Grid>
                <Col>
                    <Button
                        block
                        danger transparent
                        onPress={props.logout}>
                        <Text>Logout</Text>
                    </Button>
                </Col>
            </Grid>
        </View>
    </View>)
}

export default HomeQueueLayout