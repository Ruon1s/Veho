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
        pendingSpot: false,     //If the user is first in queue and has a spot available
    });

    const [errors, setErrors] = useState();

    /**
     * Listen queue collection updates.
     *
     * This function listens updates on the queue collection in Firebase.
     * 
     * @param {string} locationId
     */
    const queueListener = (locationId) => {
        return firebase.firestore().collection('locations').doc(locationId).collection('queue').orderBy('time', 'asc').onSnapshot(snapShot => {     //Return this so we can unsubscribe the listener when componen unmounts
            setQueue(queue => ({                                                                            //Update the queue size depending how many documents is in the collection
                ...queue,
                size: snapShot.size
            }));

            let placement = 0;                                                                              //To keep track the users placement on the queue. Is there better way?

            snapShot.forEach(document => {
                const userId = firebase.auth().currentUser.uid;                                             //Get the user id
                const data = document.data();                                                               //Extract the data of the document

                placement++;                                                                                //Add +1 to placement

                if (data.userId === userId) {                                                              //If the documents userid matches to current users id set the position etc.
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
     * 
     * @param {string} locationId
     */
    const parkingSpotListener = (locationId) => {
        return firebase.firestore().collection('locations').doc(locationId).collection('parkingspots').onSnapshot(snapShot => {    //Return so we can unsubscribe when the component unmounts

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
                        available: [...parkingSpots.available, document.id],
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
     * 
     * @param {string} locationId
     */
    const addUserToQueue = async (locationId) => {
        try {
            setQueue(queue => ({                                                                    //Set processing to true to handle UI changes
                ...queue,
                processing: true,
            }));

            const userId = firebase.auth().currentUser.uid;                                         //Get the user id
            const pushNotificationToken = (await Notifications.getExpoPushTokenAsync()).data        //Get the expo push notification token (to send notification when is the users turn)

            const response = await firebase.firestore().collection('locations').doc(locationId).collection('queue').add({                   //Add a new document to Queue collection
                time: firebase.firestore.FieldValue.serverTimestamp(),
                userId,
                pushNotificationToken
            });

            await SecureStore.setItemAsync('queueId', response.id);                                 //Store the document id to the secure store

            setQueue(queue => ({                                                                    //Handle the state changes
                ...queue,
                inQueue: true,
                processing: false,
            }));
        } catch (error) {
            handleErrors('addUserToQueue', error.message);
        }
    }

    /**
     * Remove user from the queue collection.
     *
     * This function handles the removal of user from queue collection.
     * 
     * @param {string} locationId
     */
    const removeUserFromQueue = async (locationId) => {
        try {
            setQueue(queue => ({                                                                    //Set processing to true to handle UI changes
                ...queue,
                processing: true,
            }));

            console.log(`LocationId:${locationId}`);
            const queueId = await SecureStore.getItemAsync('queueId');                              //Get the queue collections document ID from the secure store
            await firebase.firestore().collection('locations').doc(locationId).collection('queue').doc(queueId).delete();                   //Remove the document from the collection

            if (queue.position === 1 && queue.size > 1){
                await notifyNextUser(locationId);
                await Notifications.cancelAllScheduledNotificationsAsync();
            }

            await SecureStore.deleteItemAsync('queueId');

            setQueue(queue => ({                                                                    //Handle state changes back to original state.
                ...queue,
                processing: false,
                inQueue: false,
                position: 0,
            }));
        } catch (error) {
            handleErrors('removeUserFromQueue', error.message);
        }
    }

    /**
     * Handle the start of the charging.
     *
     * This function handles the starting of the charging.
     *
     * @param {string} locationId
     */
    const startCharging = async (locationId) => {
        try {
            setQueue(queue => ({                                                                    //Set processing to true to handle UI changes
                ...queue,
                processing: true,
            }));

            await Notifications.cancelScheduledNotificationAsync('reminder');                       //If the user takes the spot, cancel the reminder notification

            const randomSpot = Math.floor(Math.random() * (parkingSpots.available.length - 1));     //Choose a random spot from the list to prevent that if the users press "Start charging" at the same time they edit the same spot
            const chargingStationId = parkingSpots.available[randomSpot];                           //Get the document ID of the charging station
            const userId = firebase.auth().currentUser.uid;                                         //Get the current users ID

            await SecureStore.setItemAsync('chargingStationId', chargingStationId);                 //Store the document ID to the Secure Store
            await firebase.firestore().collection('locations').doc(locationId).collection('parkingspots').doc(chargingStationId).set({      //Update the document in firestore
                availability: false,
                userId,
            }, { merge: true });

            if (queue.inQueue) {                                                                    //If the user was in queue, remove it, else just set the processing false
                await removeUserFromQueue(locationId);
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
        } catch (error) {
            handleErrors('startCharging', error.message);
        }
    }

    /**
     * Stop the charging.
     *
     * This functions handles necessary things when the user finish the charging.
     *
     * @param {string} locationId
     */
    const stopCharging = async (locationId) => {
        try {
            setQueue(queue => ({                                                                    //Set processing to true to handle UI changes
                ...queue,
                processing: true,
            }));

            const chargingStationId = await SecureStore.getItemAsync('chargingStationId');          //Get the document id from the secure store

            await firebase.firestore().collection('locations').doc(locationId).collection('parkingspots').doc(chargingStationId).set({      //Update the document in the firestore
                    availability: true,
                    userId: '',
                }, { merge: true });
            await SecureStore.deleteItemAsync('chargingStationId');                                 //Delete the id from the secure store

            if (queue.size > 0) {
                await notifyNextUser(locationId);
            }

            setQueue(queue => ({
                ...queue,
                processing: false,
            }));

            setParkingSpots(parkingSpots => ({
                ...parkingSpots,
                inSpot: false,
            }));
        } catch (error) {
            console.log('Error: ', error.message);
            handleErrors('stopCharging', error.message);
        }
    }

    /**
     * 
     * Send a notification.
     * 
     * Sends a notification to the user next in queue.
     * 
     * @param {string} locationId 
     */
    const notifyNextUser = async (locationId) => {
        try {

            const queue = await firebase.firestore().collection('locations').doc(locationId).collection('queue').orderBy('time', 'asc').limit(1).get()

            if (queue.empty) return;

            const notifToken = queue.docs[0].data().pushNotificationToken;

            const message = {                                                                   //Create the message body
                to: notifToken,
                sound: 'default',
                title: 'Free charging station available!',
                body: 'There is a free charging station available.',
                data: {
                    type: 'freeSpot',
                    location: locationId
                }
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
        } catch (error) {
            console.log(`Error while notifying the next user: ${error.message}`)
        }
    }

    /**
     * Send a reminder.
     * 
     * If the user does not react to free spot notification this reminder is sent to the user (NOT IN USE YET).
     * 
     * @param {string} locationId
     */
    const sendFirstReminder = async (locationId) => {
        try {
            console.log('Scheduling first reminder');
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Spot still available',
                    subtitle: 'Please accept or deny the spot.',
                    body: 'Please accept or deny the spot, otherwise you will be removed from the queue.',
                    priority: Notifications.AndroidNotificationPriority.HIGH,
                    data: {
                        type: 'reminder',
                        location: locationId
                    }
                },
                trigger: {
                    seconds: 10,
                },
            });
        } catch (error) {
            console.log(`Error while scheduling a notifications: ${error.message}`);
        }
    }

    /**
     * Send a final notification.
     * 
     * If the user does not react within 5mins for the free spot, the user will be removed from the queue and inform user the removal (NOT IN USE YET).
     * 
     * @param {string} locationId 
     */
    const finalNotification = (locationId) => {
        setTimeout(async () => {
            try {
                await removeUserFromQueue(locationId);
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: 'Removed from the queue.',
                        body: 'You have been removed from the queue.',
                        priority: Notifications.AndroidNotificationPriority.HIGH,
                        data: {
                            type: 'removed'
                        }
                    },
                    trigger: {
                        seconds: 0,
                    }
                });
            } catch (error) {
                console.log('Error: ', error.message);
            }
        }, 10000);
    }

    /**
     * Check the status of the states.
     *
     * This function will return true or false depending of the states, it is used to see if there is free parking spot right away.
     */
    const checkStatus = () => {
        if (!parkingSpots.inSpot && parkingSpots.available.length > 0 && (queue.size === 0 || queue.position === 1)) {  //If the user is NOT charging, there IS FREE parkingspots and there is NO queue or the user is FIRST in queue, return true
            return true;
        }

        return false;                                                                           //Else return false
    }

    const handleErrors = (type, message) => {
        switch (type) {
            case 'addUserToQueue':
                setQueue(queue => ({
                    ...queue,
                    processing: false,
                    inQueue: false,
                }));

                setErrors(message);

                setTimeout(() => {
                    setErrors();
                }, 2000);
                return;
            case 'removeUserFromQueue':
                setQueue(queue => ({
                    ...queue,
                    processing: false,
                }));

                setErrors(message);

                setTimeout(() => {
                    setErrors();
                }, 2000);
                return;
            case 'startCharging':
                setQueue(queue => ({
                    ...queue,
                    processing: false,
                }));

                setErrors(message);

                setTimeout(() => {
                    setErrors();
                }, 2000);
                return;
            case 'stopCharging':
                setQueue(queue => ({
                    ...queue,
                    processing: false
                }));

                setErrors(message);

                setTimeout(() => {
                    setErrors();
                }, 2000);
                return;
            default:
                return;
        }
    }

    return {
        queue,
        parkingSpots,
        errors,
        queueListener,
        parkingSpotListener,
        addUserToQueue,
        removeUserFromQueue,
        startCharging,
        stopCharging,
        checkStatus,
        sendFirstReminder,
        finalNotification,
    }
};

export default useQueueHooks;
