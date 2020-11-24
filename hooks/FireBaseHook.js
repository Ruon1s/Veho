import React from 'react'
import * as firebase from 'firebase';
import 'firebase/firestore';
import { useState } from 'react'


const useFirebase = () => {
    const [locations, setLocations] = useState([]);

    const getUser = async () => {
        const user = firebase.auth().currentUser;
        const db = firebase.firestore();

        const userRef = db.collection('users').doc(user.uid);
        const doc = await userRef.get();
        if (!doc.exists) {
            console.log('no user found')
        } else {
            console.log(doc.data());
            return doc.data()
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
        const snapShot = await locationsRef.get()
        snapShot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            array.push(doc.data().name)
        })
        console.log('function getLocations array', array)
        setLocations(array)
    };

    return {
        getUser,
        getUserCars,
        getLocations,
        locations,
        setLocations
    }
};

export default useFirebase

