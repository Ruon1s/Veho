import firebase from 'firebase';
import 'firebase/firestore';
import { useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';

const useQueueHooks = () => {
    const [queue, setQueue] = useState({
        size: 0,                //Size of the queue (users in the queue)
        position: 0,            //If the user is in the queue, the users position in queue,
        inQueue: false,         //If the user is inQueue
        processing: false,      //State to disable some UI elements during async actions
    });

    const [parkingSpots, setParkingSpots] = useState({
        available: [],          //Available parking spots (will be filled with their document id)
        inSpot: false,          //If the user is charging
    });

    /**
     * Listen queue collection updates.
     * 
     * This function listens updates on the queue collection in Firebase.
     */
    const queueListener = () => {
        return firebase.firestore().collection('locations').doc('vehoHq').collection('queue').orderBy('time', 'asc').onSnapshot(snapShot => {     //Return this so we can unsubscribe the listener when componen unmounts
            setQueue(queue => ({                                                                            //Update the queue size depending how many documents is in the collection
                ...queue,
                size: snapShot.size
            }));

            let placement = 0;                                                                              //To keep track the users placement on the queue. Is there better way? 

            snapShot.forEach(document => {
                const userId = firebase.auth().currentUser.uid;                                             //Get the user id
                const data = document.data();                                                               //Extract the data of the document

                placement++;                                                                                //Add +1 to placement

                if (data.user_id === userId) {                                                              //If the documents userid matches to current users id set the position etc.
                    setQueue(queue => ({
                        ...queue,
                        position: placement,
                        inQueue: document.id,
                    }));
                }
            })
        })
    }

    /**
     * Listen parkingspot collection updates.
     * 
     * This function listens updates on the parkingspots collection in Firebase.
     */
    const parkingSpotListener = () => {
        return firebase.firestore().collection('locations').doc('4ZCI4abzkdEhywEmiZ6r').collection('parkingspots').onSnapshot(snapShot => {    //Return so we can unsubscribe when the component unmounts

            setParkingSpots(parkingSpots => ({                                                                          //Clear the state so there will be no duplicates
                ...parkingSpots,        
                available: [],
            }));

            const userId = firebase.auth().currentUser.uid;                                                         //Get the current users id

            snapShot.forEach(document => {                      
                const data = document.data();                                                                           //Get the data of the document

                if (data.availability === true) {                                                                       //If the spot is available, add the document ID to an array
                    setParkingSpots(parkingSpots => ({
                        ...parkingSpots,
                        available: parkingSpots.available.concat(document.id),
                    }));
                }

                if (data.userId === userId) {                                                                           //If the userID matches the userid in spot it means that the user is charging in that spot
                    setParkingSpots(parkingSpots => ({
                        ...parkingSpots,
                        inSpot: true,
                    }));
                }
            });
        });
    }

    /**
     * Add users to queue collection.
     * 
     * This function handles the user adding to the queue collection.
     */
    const addUserToQueue = async () => {
        try {
            setQueue(queue => ({                                                                    //Set processing to true to handle UI changes
                ...queue,
                processing: true,
            }));

            const userId = firebase.auth().currentUser.uid;                                         //Get the user id
            const pushNotificationToken = (await Notifications.getExpoPushTokenAsync()).data        //Get the expo push notification token (to send notification when is the users turn)

            const response = await firebase.firestore().collection('locations').doc('4ZCI4abzkdEhywEmiZ6r').collection('queue').add({                   //Add a new document to Queue collection
                time: firebase.firestore.FieldValue.serverTimestamp(),
                user_id: userId,
                pushNotificationToken
            });

            await SecureStore.setItemAsync('queueId', response.id);                                 //Store the document id to the secure store

            setQueue(queue => ({                                                                    //Handle the state changes
                ...queue,
                inQueue: true,
                processing: false,
            }));
        } catch (error) {
            console.log(`Error on addToQueue function in FirebaseHooks.js: ${ error.message }`);
        }
    }

    /**
     * Remove user from the queue collection.
     * 
     * This function handles the removal of user from queue collection.
     */
    const removeUserFromQueue = async () => {
        try {
            setQueue(queue => ({                                                                    //Set processing to true to handle UI changes
                ...queue,
                processing: true,
            }));

            const queueId = await SecureStore.getItemAsync('queueId');                              //Get the queue collections document ID from the secure store
            await firebase.firestore().collection('locations').doc('4ZCI4abzkdEhywEmiZ6r').collection('queue').doc(queueId).delete();                   //Remove the document from the collection

            setQueue(queue => ({                                                                    //Handle state changes back to original state.
                ...queue,
                processing: false,
                inQueue: false,
                position: 0,
            }));
        } catch (error) {
            console.log(`Error on RemoveUserFromQueue function in FirebaseHooks.js: ${ error.message }`);
        }
    }

    /**
     * Handle the start of the charging.
     * 
     * This function handles the starting of the charging.
     * 
     * @param {*} navigation 
     */
    const startCharging = async (navigation) => {
        try {
            setQueue(queue => ({                                                                    //Set processing to true to handle UI changes
                ...queue,
                processing: true,
            }));

            const chargingStationId = parkingSpots.available[0];                                    //Get the document ID of the charging station
            const userId = firebase.auth().currentUser.uid;                                         //Get the current users ID

            await SecureStore.setItemAsync('chargingStationId', chargingStationId);                 //Store the document ID to the Secure Store
            await firebase.firestore().collection('locations').doc('4ZCI4abzkdEhywEmiZ6r').collection('parkingspots').doc(chargingStationId).set({      //Update the document in firestore
                availability: false,
                userId,
            }, { merge: true });

            if (queue.inQueue) {                                                                    //If the user was in queue, remove it, else just set the processing false
                removeUserFromQueue();
            } else {
                setQueue(queue => ({
                    ...queue,
                    processing: false,
                }));
            }

            setParkingSpots(parkingSpots => ({                                                      //Set the parkingSpot states inSpot property to true (User is charging)
                ...parkingSpots,
                inSpot: true,
            }));

            navigation.navigate('ChargingView');                                                    //Navigate user to the charging view where are the details of the charging
        } catch (error) {
            console.log(`Error on StartCharging function in FirebaseHooks.js: ${ error.message }`);
        }
    }

    /**
     * Stop the charging.
     * 
     * This functions handles necessary things when the user finish the charging.
     * 
     * @param {*} navigation 
     */
    const stopCharging = async (navigation) => {
        try {
            setQueue(queue => ({                                                                    //Set processing to true to handle UI changes
                ...queue,
                processing: true,
            }));

            const chargingStationId = await SecureStore.getItemAsync('chargingStationId');          //Get the document id from the secure store
            await firebase.firestore().collection('locations').doc('vehoHq').collection('parkingspots').doc(chargingStationId).set({      //Update the document in the firestore
                availability: true,
                userId: '',
            }, { merge: true });
            await SecureStore.deleteItemAsync('chargingStationId');                                 //Delete the id from the secure store

            const queue = await firebase.firestore().collection('locations').doc('vehoHq').collection('queue').orderBy('time', 'asc').limit(1).get(); //Get the first user from the queue

            if (!queue.empty) {                                                                     //Check that there really is a user in the queue 
                const token = queue.docs[0].data().pushNotificationToken;                           //Get the users push notification token
    
                const message = {                                                                   //Create the message body
                    to: token,
                    sound: 'default',
                    title: 'Free charging station available!',
                    body: 'There is a free charging station available.'
                }
                
                const options = {                                                                   //Create the correct options (POST, headers, etc...)
                    method: 'POST',
                    headers: {
                        'host': 'exp.host',
                        'accpet': 'application/json',
                        'accept-encoding': 'gzip, deflate',
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(message),
                }
    
                await fetch('https://exp.host/--/api/v2/push/send', options);                       //Post to Expo Notification Service so the notification is delivered
            }

            navigation.replace('App');                                                              //Take user back to main screen
        } catch (error) {
            setQueue(queue => ({
                ...queue,
                processing: false,
            }))
            console.log(`Error on StopCharging function in FirebaseHooks.js: ${ error.message }`)
        }
    }

    /**
     * Check the status of the states.
     * 
     * This function will return true or false depending of the states, it is used to see if there is free parking spot right away.
     */
    const checkStatus = () => {
        try {
            if (!parkingSpots.inSpot && parkingSpots.available.length > 0 && (queue.size === 0 || queue.position === 1)) {  //If the user is NOT charging, there IS FREE parkingspots and there is NO queue or the user is FIRST in queue, return true
                return true;
            }

            return false;                                                                           //Else return false
        } catch (error) {
            console.log(`Error on CheckStatus function in FirebaseHooks.js: ${ error.message }`);
        }
    }

    return {
        queue,
        parkingSpots,
        queueListener,
        parkingSpotListener,
        addUserToQueue,
        removeUserFromQueue,
        startCharging,
        stopCharging,
        checkStatus
    }
};

export default useQueueHooks;