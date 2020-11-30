import React, { useEffect, useState } from 'react';
import { Container, Text, Button, View, StyleProvider, Toast, Root, Spinner } from 'native-base';
import { Col, Grid } from 'react-native-easy-grid';
import GlobalStyles from '../styles/GlobalStyles';
import BatteryInfo from './BatteryInfo';
import QueueInfo from './QueueInfo';
import CustomHeader from './CustomHeader';
import LocationInfo from './LocationInfo';
import useQueueHooks from '../hooks/QueueHooks';
import useFirebase from "../hooks/FireBaseHook";

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
        if (props.user.location) {
            const unsubscribeQueueListener = queueListener(props.user.location.id);
            const unsubscribeParkingSpotListener = parkingSpotListener(props.user.location.id);
            
            return () => {
                unsubscribeQueueListener();
                unsubscribeParkingSpotListener();
            }
        }
    }, [props.user]);

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

    return (<View padder style={{ flex: 1, justifyContent: 'space-between', marginBottom: 24 }}>
        <QueueInfo free={parkingSpots.available.length} queue={queue.size} queuePosition={queue.position} style={{ flex: 2 }} />
        <LocationInfo user={props.user} style={{ flex: 1 }} />
        <View style={{ display: 'flex', justifyContent: 'center', flex: 8 }}>
            <BatteryInfo batteryStatus={batteryStatus} sizeVariable='large' />
        </View>

        <View style={{ flex: 1 }}>
            {/*
            <Button  large block transparent onPress={() => schedulePushNotification('Test', 'Hello', 123)}>
                <Text>Test notification</Text>
            </Button>
            <Button  large block onPress={fetchToken}>
                <Text>(DEV) Get Token</Text>
            </Button>
            <Button  large block onPress={fetchSoc}>
                <Text>(DEV) Refresh SOC</Text>
            </Button>
*/}
            {queue.inQueue && available ?
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <Button large block style={GlobalStyles.button} onPress={() => startCharging(props.navigation, props.user.location.id)} >
                        <Text>Start Charging</Text>
                    </Button>
                    <Button large block transparent style={GlobalStyles.button} onPress={ () => removeUserFromQueue(props.user.location.id) } disabled={queue.processing}>
                        {queue.processing ? <Spinner /> : <Text>Skip</Text>}
                    </Button>
                </View> : null}
            {!queue.inQueue && !available && !parkingSpots.inSpot ?
                <Button large block style={GlobalStyles.button} onPress={ () => addUserToQueue(props.user.location.id) } disabled={queue.processing}>
                    {queue.processing ? <Spinner /> : <Text>Queue</Text>}
                </Button> : null}
            {queue.inQueue && !available ?
                <Button large block style={GlobalStyles.button} onPress={() => removeUserFromQueue(props.user.location.id)} disabled={queue.processing}>
                    {queue.processing ? <Spinner /> : <Text>Leave Queue</Text>}
                </Button> : null}
            {!queue.inQueue && available ?
                <Button large block style={GlobalStyles.button} onPress={() => startCharging(props.navigation, props.user.location.id)}>
                    <Text>Start Charging</Text>
                </Button> : null}
            {parkingSpots.inSpot ?
                <Button large block style={GlobalStyles.button} onPress={() => props.navigation.navigate('ChargingView', { location: props.user.location.id })}>
                    <Text>To Charging View</Text>
                </Button> : null}
        </View>
    </View>)
}

export default HomeQueueLayout
