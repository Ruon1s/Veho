import React, { useEffect, useState } from 'react';
import { Container, Text, Button, View, StyleProvider, Toast, Root } from 'native-base';
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

const Home = ({ navigation }) => {
    // State: for queue information
    const [state, setState] = useState({
        adding: false, //Disable the queue button while adding the document to firebase to prevent double documents
        inQueue: false, //Test purposes?
        queue: 0,
        free: 0,
        queuePosition: 0
    });
    const [batteryStatus, setBatteryStatus] = useState(54)

    //Add a listeners for firebase collections changes
    useEffect(() => {
        //Check how many people are in the queue and update the state according to that. Also check if the user is found on the queue
        const unsubscribeQueueListener = firebase.firestore().collection('queue').orderBy('time', 'asc').onSnapshot(snapShot => {
            setState((state) => ({
                ...state,
                queue: snapShot.size
            }));

            //Just to tell your spot in the queue (if it is even working). Need to come up with better later
            let placement = 0;

            snapShot.forEach(document => {
                const user = firebase.auth().currentUser
                const data = document.data();

                placement++;

                if (data.user_id === user.uid) {
                    setState((state) => ({
                        ...state,
                        inQueue: true,
                        queuePosition: placement,
                    }));
                }
            });
        });

        //Listener for the parkingspots
        const unsubscribeParkingSpotListener = firebase.firestore().collection('parkingspots').onSnapshot(snapShot => {
            //Just a little ducktape fix so there are no duplicates
            setState((state) => ({
                ...state,
                free: 0,
            }));

            snapShot.forEach(document => {
                const data = document.data();

                if (data.availability === true) {
                    setState((state) => ({
                        ...state,
                        free: state.free + 1
                    }));
                }
            });
        });

        return () => {
            unsubscribeQueueListener();
            unsubscribeParkingSpotListener();
        }
    }, []);

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
            console.log(`Token: ${toJSON.access_token}`);
            await SecureStore.setItemAsync('token', toJSON.access_token);
        } catch (error) {
            console.log(error);
        }
    }


    // QueueInfo re-renders according to this state change
    /* const handleClick = () => {
        if (state.queuePosition == 1) {
            setState({ queuePosition: 0 })
        } else {
            setState({ queuePosition: 1 })
        }
    } */

    //Function that handles adding user to the queue
    const addToQueue = async () => {
        try {

            setState((state) => ({
                ...state,
                adding: true
            }));

            const db = firebase.firestore();
            const user = firebase.auth().currentUser;
            const timestamp = Date.now();

            const response = await db.collection('queue').add({
                time: timestamp,
                user_id: user.uid
            });

            await SecureStore.setItemAsync('queueId', response.id);

            setState((state) => ({
                ...state,
                inQueue: true,
                adding: false,
            }));

            Toast.show({
                text: 'You are added to the queue!',
                position: 'bottom',
                duration: 3000,
                type: 'success',
            });
        } catch (error) {
            console.log(`Error adding user to the queue: ${ error.message }`);
        }
    }

    //Function that will remove the user from queue
    const removeFromQueue = async () => {
        try {
            const docId = await SecureStore.getItemAsync('queueId');
            const db = firebase.firestore();
            await db.collection('queue').doc(docId).delete();

            setState((state) => ({
                ...state,
                inQueue: false,
                queuePosition: 0,
            }));

            Toast.show({
                text: 'You were removed from the queue',
                position: 'bottom',
                duration: 3000,
                type: 'success'
            });
        } catch (error) {
            console.log(`Error while removing from queue: ${ error.message }`);
        }
    }

    const logout = async () => {
        await firebase.auth().signOut();
        navigation.replace('Auth');
    }

    /* Functions needed, GET:
          - battery %
          - # of free spots in parking space
          - the length of queue
    */
    return (
        <Root>
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
                        <Button full onPress={fetchToken}
                            style={GlobalStyles.button}>
                            <Text>(DEV) Get Token</Text>
                        </Button>
                        <Button full onPress={fetchSoc}
                            style={GlobalStyles.button}>
                            <Text>(DEV) Refresh SOC</Text>
                        </Button>
                        {state.inQueue ?
                        <Button full onPress={ removeFromQueue } style={ GlobalStyles.button }>
                            <Text>Leave Queue</Text>
                        </Button>
                        :
                        <Button full onPress={addToQueue} style={GlobalStyles.button} disabled={ state.adding } >
                            {state.adding ?
                            <Text>Adding...</Text>
                            :
                            <Text>Queue</Text>}
                        </Button>}
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
                                    onPress={ logout }
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
