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
import * as Notifications from 'expo-notifications';
import { schedulePushNotification } from '../services/NotificationService';
import * as firebase from 'firebase';
import 'firebase/firestore';

const Home = ({ navigation }) => {
    // State: for queue information
    const [state, setState] = useState({
        adding: false,                     //Disable the queue button while adding the document to firebase to prevent double documents
        inQueue: false,                    //Change queue button depending this state
        queue: 0,                          //How many users are in queue
        freeSpots: [],                     //Store the document ID:s of the free spots (This arrays length also tells how many free spots there are)
        queuePosition: 0,                  //The users own position in queue
        charging: false,                   //If the user has the car already charging this will be true (Is the secure storage better?)
        spotAvailable: false,              //If there is spot available
    });
    const [batteryStatus, setBatteryStatus] = useState(54)

    useEffect(() => {
        const unsubscribeQueueListener = firebase.firestore().collection('queue').orderBy('time', 'asc').onSnapshot(snapShot => {   //Check how many people are in the queue and update the state according to that. Also check if the user is found on the queue
            
            setState((state) => ({                                                                                                  //Get the queue size (How many documents there are in the collection)                                                                       
                ...state,
                queue: snapShot.size
            }));

            let placement = 0;                                                                                                      //Just to tell your spot in the queue (if it is even working). Need to come up with better later maybe

            snapShot.forEach(document => {                                                                                          //Loop through the documents in the collection
                const user = firebase.auth().currentUser;
                const data = document.data();

                placement++;

                if (data.user_id === user.uid) {                                                                                    //If the user id is found in one of the documents check the position and change the state as needed
                    setState((state) => ({
                        ...state,
                        inQueue: true,
                        queuePosition: placement,
                    }));
                }
            });
        });

        const unsubscribeParkingSpotListener = firebase.firestore().collection('parkingspots').where("availability", "==", true).onSnapshot(snapShot => {

            setState(state => ({
                ...state,
                freeSpots: [],
            }));

            snapShot.forEach(document => {
                setState(state => ({
                    ...state,
                    freeSpots: state.freeSpots.concat(document.id)
                }));
            }); 
        });

        getChargingDocId();

        return () => {
            unsubscribeQueueListener();
            unsubscribeParkingSpotListener();
        }
    }, []);

    useEffect(() => {                                                                                                       //Pretty awful looking if statement for checking if there are free spots available
        if (!state.charging && state.freeSpots.length > 0 && (state.queue === 0 || state.queuePosition === 1)) {            //First check if the user is not charging and there are more spots available than 
            Toast.show({                                                                                                    //Show a toast to the user
                text: 'Free spot available right away!',
                position: 'bottom',
                duration: 3000,
                type: 'success'
            });

            setState(state => ({                                                                                            //Change the needed states
                ...state,
                spotAvailable: true,
            }));
        } else {                    
            setState(state => ({                                                                                            //Change the availability to false if the conditions change
                ...state,
                spotAvailable: false
            }));
        }
    }, [state.freeSpots, state.queuePosition, state.queue]);

    const getChargingDocId = async () => {                                                                                  //Function that gets the charging stations document id from secure store. If the document ID exists, it means that the user is charging their vehicle
        try {
            const docID = await SecureStore.getItemAsync('chargingDocId');

            if (docID !== null) {
                setState(state => ({
                    ...state,
                    charging: true,
                }));
            }
        } catch (error) {
            console.log(`Error while getting chargingDoc: ${ error.message }`);
        }
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

    const addToQueue = async () => {                                                        //Function that handles adding user to the queue
        try {

            setState((state) => ({                                                          //Change the state to adding to disable the button
                ...state,
                adding: true
            }));

            const user = firebase.auth().currentUser;                                       //Get the curren user
            const timestamp = Date.now();                                                   //Create a timestamp
            const token = (await Notifications.getExpoPushTokenAsync()).data;               //Get the token for the notifications
            
            const response = await firebase.firestore().collection('queue').add({           //Add a new document to the queue collection
                time: timestamp,
                user_id: user.uid,
                pushNotificationToken: token,
            });

            await SecureStore.setItemAsync('queueId', response.id);                         //Store the documentID to secure store so we can delete is later if the users leaves from the queue or the user starts charging

            setState((state) => ({                                                          //Handle rest of state changes (inQueue true to change the button, adding false, since the user has been added to the queue)
                ...state,
                inQueue: true,
                adding: false,
            }));

            Toast.show({                                                                    //Notify user about successful action with the toast!
                text: 'You are added to the queue!',
                position: 'bottom',
                duration: 3000,
                type: 'success',
            });
        } catch (error) {
            console.log(`Error adding user to the queue: ${ error.message }`);
        }
    }

    const removeFromQueue = async () => {                                                   //Function that will remove the user from queue
        try {
            const docId = await SecureStore.getItemAsync('queueId');                        //Get the docId to delete the right one
            await firebase.firestore().collection('queue').doc(docId).delete();             //Delete the document

            setState((state) => ({                                                          //Change needed states back to default to handle the buttons etc..
                ...state,
                inQueue: false,
                queuePosition: 0,
            }));

            Toast.show({                                                                    //Notify user about successful action with the toast!
                text: 'You were removed from the queue',
                position: 'bottom',
                duration: 3000,
                type: 'success'
            });
        } catch (error) {
            console.log(`Error while removing from queue: ${ error.message }`);
        }
    }

    const startCharging = async () => {                                                     //Function that will take user to the charging view when there are free spots avalaible.
        try {

            setState(state => ({                                                            //Just to disable the button
                ...state,
                adding: true,
            }));

            const chargingSpotDocId = state.freeSpots[0];                                               //Get the first available charging spot
            await SecureStore.setItemAsync('chargingDocId', chargingSpotDocId);                         //Save the chargingDocId to secure store so we know if the user is charging

            if (state.inQueue) {
                removeFromQueue();                                                                      //Delete user from the queue if the user is in the queue
            }

            await firebase.firestore().collection('parkingspots').doc(chargingSpotDocId).set({          //Switch the parkingspots availability to false
                availability: false,
            }, { merge: true });

            setState(state => ({
                ...state,
                adding: false,
                charging: true,
            }));

            navigation.navigate('ChargingView');                                            //Navigate to charging view
        } catch (error) {
            console.log(`Error while going to charging view: ${ error.message }`);
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
                    <CustomHeader title='Home' />

                    <View padder style={{ flex: 1, justifyContent: 'space-between', marginBottom: 60 }}>
                        <QueueInfo free={state.freeSpots.length} queue={state.queue} queuePosition={state.queuePosition} />
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
                            {state.inQueue && state.spotAvailable ?
                            <>
                                <Button full style={ GlobalStyles.button } onPress={ startCharging } >
                                    <Text>Start Charging</Text>
                                </Button>
                                <Button full style={ GlobalStyles.button } onPress={ removeFromQueue }>
                                    <Text>Leave Queue</Text>
                                </Button>
                            </>
                            :
                            null}
                            {!state.inQueue && !state.spotAvailable && !state.charging ? 
                            <Button full style={ GlobalStyles.button } onPress={ addToQueue } disabled={ state.adding }>
                                <Text>Queue</Text>
                            </Button>
                            :
                            null}
                            {state.inQueue && !state.spotAvailable ?
                            <Button full style={ GlobalStyles.button } onPress={ removeFromQueue }>
                                <Text>Leave Queue</Text>
                            </Button>
                            :
                            null}
                            {!state.inQueue && state.spotAvailable ?
                            <Button full style={ GlobalStyles.button } onPress={ startCharging }>
                                <Text>Start Charging</Text>
                            </Button>
                            :
                            null}
                            {state.charging ?
                            <Button full style={ GlobalStyles.button } onPress={ () => navigation.navigate('ChargingView') }>
                                <Text>To Charging View</Text>
                            </Button>
                            :
                            null}
                            <Grid>
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
