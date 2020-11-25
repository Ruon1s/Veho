import React from 'react'
import * as firebase from 'firebase';
import 'firebase/firestore';
import { useState } from 'react'


const useFirebase = () => {
    const [locations, setLocations] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [loading, setLoading] = useState(true);

    const getUser = async () => {
        setLoading(true)
        const user = firebase.auth().currentUser;
        const db = firebase.firestore();
        if(user){
        const userRef = db.collection('users').doc(user.uid);
        const doc = await userRef.get();
        if (!doc.exists) {
            console.log('no user found')
        } else {
           setCurrentUser(doc.data())
        }
        setLoading(false)
        }
    };

    const getUserCars = async () => {
        const array = [];
        const user = firebase.auth().currentUser;
        const db = firebase.firestore();



        const carsRef = db.collection('users').doc(user.uid).collection('cars');
        const snapshot = await carsRef.get();
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data)
            array.push(doc.data)
        })
        return array
    };

    const getLocations = async () => {
        const array = [];
        const db = firebase.firestore();
        const locationsRef = db.collection('locations');
        const snapShot = await locationsRef.get();

        snapShot.forEach(doc => {
            const locationData = doc.data();
            if (locations.find(doc => doc.id === location.id) !== undefined) {
                return
            }
            setLocations(previousState => ([
                ...previousState, {
                    ...locationData,
                    id: doc.id
                }
            ]));
            console.log('locations', locations)
        });
    };

    return {
        getUser,
        getUserCars,
        getLocations,
        locations,
        setLocations,
        currentUser,
        setCurrentUser,
        loading,

    }
};

export default useFirebase
